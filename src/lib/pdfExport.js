import { jsPDF } from 'jspdf';

const ACCENT = [11, 37, 69]; // #0B2545 as RGB
const DISCLAIMER =
  "AI-generated from the text you provided. May be incomplete or inaccurate; treat this as a " +
  "starting point for your own judgment, not a final answer.";

export function exportTranslationToPdf(result) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 56;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const footerReserve = 46;
  const contentBottom = pageHeight - footerReserve;
  let y = margin;
  let pageNum = 1;

  const generatedAt = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const drawFooter = () => {
    const footerTop = pageHeight - footerReserve;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, footerTop, pageWidth - margin, footerTop);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(doc.splitTextToSize(DISCLAIMER, contentWidth * 0.6), margin, footerTop + 13);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('STRATEGY TRANSLATOR // BUILT BY SIDHINGO', pageWidth - margin, footerTop + 13, { align: 'right' });
    doc.text(`PAGE ${pageNum}`, pageWidth - margin, footerTop + 23, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  };

  const newPageIfNeeded = (needed = 14) => {
    if (y + needed > contentBottom) {
      drawFooter();
      doc.addPage();
      pageNum += 1;
      y = margin;
    }
  };

  const addWrapped = (text, size, spacing, font = 'normal') => {
    doc.setFont('helvetica', font);
    doc.setFontSize(size);
    doc.splitTextToSize(text, contentWidth).forEach((line) => {
      newPageIfNeeded(spacing);
      doc.setFont('helvetica', font);
      doc.setFontSize(size);
      doc.text(line, margin, y);
      y += spacing;
    });
  };

  const sectionHeading = (title, isFirst = false) => {
    newPageIfNeeded(38);
    if (!isFirst) {
      y += 8;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 16;
    } else {
      y += 2;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...ACCENT);
    doc.text(title.toUpperCase(), margin, y);
    doc.setTextColor(0, 0, 0);
    y += 18;
  };

  const gapColumnLabels = () => {
    const colWidth = (contentWidth - 24) / 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('STATED', margin, y);
    doc.text('ACTUAL', margin + colWidth + 24, y);
    doc.setTextColor(0, 0, 0);
    y += 12;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;
  };

  const gapRow = (stated, actual, isLast) => {
    const colWidth = (contentWidth - 24) / 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const leftLines = doc.splitTextToSize(stated, colWidth);
    const rightLines = doc.splitTextToSize(actual, colWidth);
    const rowLines = Math.max(leftLines.length, rightLines.length);
    newPageIfNeeded(rowLines * 13 + 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    leftLines.forEach((line, i) => doc.text(line, margin, y + i * 13));
    rightLines.forEach((line, i) => doc.text(line, margin + colWidth + 24, y + i * 13));
    y += rowLines * 13 + 8;
    if (!isLast) {
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
    }
  };

  const scenarioRow = (scenarios) => {
    const colWidth = (contentWidth - 20) / 2;
    const boxes = scenarios.map((s) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const costs = doc.splitTextToSize(`Costs: ${s.costs}`, colWidth - 28);
      const buys = doc.splitTextToSize(`Buys: ${s.buys}`, colWidth - 28);
      return { s, costs, buys, lines: costs.length + buys.length };
    });
    const maxLines = Math.max(...boxes.map((b) => b.lines));
    const boxHeight = 44 + maxLines * 13;
    newPageIfNeeded(boxHeight + 14);

    boxes.forEach((b, i) => {
      const x = margin + i * (colWidth + 20);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.75);
      doc.roundedRect(x, y, colWidth, boxHeight, 4, 4);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11.5);
      doc.text(b.s.name, x + 14, y + 20, { maxWidth: colWidth - 28 });
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.5);
      doc.line(x + 14, y + 28, x + colWidth - 14, y + 28);
      let ly = y + 44;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      b.costs.forEach((line) => {
        doc.text(line, x + 14, ly);
        ly += 13;
      });
      ly += 3;
      b.buys.forEach((line) => {
        doc.text(line, x + 14, ly);
        ly += 13;
      });
    });
    y += boxHeight + 14;
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(result.decisionTitle, contentWidth - 160);
  const headerHeight = 42 + titleLines.length * 20;

  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('STRATEGY TRANSLATOR', margin, 24);
  doc.setFontSize(16);
  titleLines.forEach((line, i) => doc.text(line, margin, 46 + i * 20));
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`Generated ${generatedAt}`, pageWidth - margin, 24, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  y = headerHeight + 22;

  addWrapped(result.summary, 11, 14.5, 'italic');

  sectionHeading('The Reality Check');
  gapColumnLabels();
  result.sayDoGap.forEach((pair, i) => gapRow(pair.stated, pair.actual, i === result.sayDoGap.length - 1));

  sectionHeading('Scenario Branches');
  for (let i = 0; i < result.scenarios.length; i += 2) {
    scenarioRow(result.scenarios.slice(i, i + 2));
  }

  drawFooter();
  doc.save(`strategy-translation-${Date.now()}.pdf`);
}