import Konva from 'konva';
import { jsPDF } from 'jspdf';

interface ClipBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function printToPDF(
  stage: Konva.Stage,
  clip: ClipBounds,
  roomWidthUnits: number,
  roomHeightUnits: number,
  title: string,
  subtitle: string,
): Promise<void> {
  const dataUrl = stage.toDataURL({
    pixelRatio: 3,
    x: clip.x,
    y: clip.y,
    width: clip.width,
    height: clip.height,
  });

  const portrait = roomHeightUnits > roomWidthUnits;
  const doc = new jsPDF({ orientation: portrait ? 'portrait' : 'landscape', unit: 'mm', format: 'a4' });
  const pageW = portrait ? 210 : 297;
  const pageH = portrait ? 297 : 210;
  const margin = 15;
  const hasTitle = title.trim().length > 0;
  const hasSubtitle = subtitle.trim().length > 0;
  const headerH = hasTitle && hasSubtitle ? 18 : (hasTitle || hasSubtitle) ? 12 : 0;
  const availW = pageW - margin * 2;
  const availH = pageH - margin * 2 - headerH;

  const roomAspect = roomWidthUnits / roomHeightUnits;
  let imgW = availW;
  let imgH = imgW / roomAspect;
  if (imgH > availH) {
    imgH = availH;
    imgW = imgH * roomAspect;
  }

  const imgX = margin + (availW - imgW) / 2;
  const imgY = margin + headerH;

  if (hasTitle) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title.trim(), pageW / 2, margin + 6, { align: 'center' });
  }

  if (hasSubtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const subtitleY = hasTitle ? margin + 13 : margin + 6;
    doc.text(subtitle.trim(), pageW / 2, subtitleY, { align: 'center' });
  }

  doc.addImage(dataUrl, 'PNG', imgX, imgY, imgW, imgH);
  doc.save('piantina-ristorante.pdf');
}
