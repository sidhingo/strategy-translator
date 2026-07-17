export function buildWeeklyReportHtml({ weekLabel, hits, uniqueIps, costCents, monthToDateCents, monthlyCapCents }) {
    const dollars = (c) => `$${(c / 100).toFixed(2)}`;
    const pctOfCap = Math.min(100, Math.round((monthToDateCents / monthlyCapCents) * 100));
  
    return `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #0B2545;">
      <p style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #737373; margin-bottom: 4px;">
        Strategy Translator
      </p>
      <h2 style="margin: 0 0 24px 0; font-size: 20px;">Weekly Report — ${weekLabel}</h2>
  
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #737373;">Total runs</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; text-align: right; font-weight: 600;">${hits}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #737373;">Unique visitors (approx.)</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; text-align: right; font-weight: 600;">${uniqueIps}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #737373;">Spend this week</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; text-align: right; font-weight: 600;">${dollars(costCents)}</td>
        </tr>
      </table>
  
      <p style="font-size: 13px; color: #737373; margin-bottom: 6px;">
        Month-to-date across both tools: <strong style="color: #0B2545;">${dollars(monthToDateCents)}</strong> of ${dollars(monthlyCapCents)} cap (${pctOfCap}%)
      </p>
      <div style="width: 100%; height: 6px; background: #e5e5e5; border-radius: 3px; overflow: hidden;">
        <div style="width: ${pctOfCap}%; height: 100%; background: ${pctOfCap > 80 ? '#dc2626' : '#0B2545'};"></div>
      </div>
  
      <p style="font-size: 12px; color: #a3a3a3; margin-top: 32px;">
        Sent automatically every Sunday. This figure only counts this tool's usage; check the 100-Day Plan Generator's own report for its share of the shared cap.
      </p>
    </div>`;
  }