import { Resend } from 'resend';
import { redis, dayKey, keys } from '../../lib/redis.js';
import { buildWeeklyReportHtml } from '../../lib/email-template.js';
import { MONTHLY_BUDGET_CAP_CENTS } from '../../lib/pricing.js';

export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  const authHeader = req.headers['authorization'];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      return dayKey(d);
    });

    let hits = 0;
    let costCents = 0;
    const ipSet = new Set();

    for (const day of last7Days) {
      const [dayHits, dayCost, dayIps] = await Promise.all([
        redis.get(keys.statsHits(day)),
        redis.get(keys.statsCostCents(day)),
        redis.smembers(keys.statsIps(day)),
      ]);
      hits += Number(dayHits || 0);
      costCents += Number(dayCost || 0);
      (dayIps || []).forEach((ip) => ipSet.add(ip));
    }

    const now = new Date();
    const monthDays = [...Array(now.getUTCDate())].map((_, i) => {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), i + 1));
      return dayKey(d);
    });
    let monthToDateCents = 0;
    for (const day of monthDays) {
      const c = await redis.get(keys.statsCostCents(day));
      monthToDateCents += Number(c || 0);
    }

    const weekLabel = `${last7Days[6]} to ${last7Days[0]}`;

    const html = buildWeeklyReportHtml({
      weekLabel,
      hits,
      uniqueIps: ipSet.size,
      costCents,
      monthToDateCents,
      monthlyCapCents: MONTHLY_BUDGET_CAP_CENTS,
    });

    await resend.emails.send({
      from: process.env.REPORT_FROM_EMAIL,
      to: process.env.REPORT_TO_EMAIL,
      subject: `Strategy Translator — Weekly Report (${hits} runs, $${(costCents / 100).toFixed(2)})`,
      html,
    });

    return res.status(200).json({ ok: true, hits, costCents, monthToDateCents });
  } catch (err) {
    console.error('weekly-report cron error:', err);
    return res.status(500).json({ ok: false, message: err.message });
  }
}