import type { StandardInvitationDetails } from "./standard-invitation";
import type { standardAppearance } from "./standard-appearance";

/** Aureline's movie uses ornamental arcs and porcelain stationery instead of floral paper. */
export function drawAurelineVideoFrame(context: CanvasRenderingContext2D, details: StandardInvitationDetails, palette: ReturnType<typeof standardAppearance>, font: string, photo: HTMLImageElement | null, elapsed: number) {
  context.fillStyle = palette.background; context.fillRect(0, 0, 720, 1080);
  context.strokeStyle = palette.readableAccent; context.lineWidth = 1;
  for (const radius of [80, 100, 135, 165, 195, 225]) { context.beginPath(); context.arc(360, -15, radius, 0, Math.PI); context.stroke(); }
  for (let n = 0; n < 24; n++) {
    context.save(); context.translate(360, -15); context.rotate(n * Math.PI / 12);
    context.beginPath(); context.ellipse(0, 180, 12, 35, 0, 0, Math.PI * 2); context.stroke(); context.restore();
  }
  context.textAlign = "center"; context.fillStyle = palette.readableAccent; context.font = "12px sans-serif"; context.fillText("THE BEGINNING OF OUR JOURNEY", 360, 270);
  context.fillStyle = palette.primaryText;
  const size = Math.min(62, 560 / Math.max(details.brideName.length, details.groomName.length) * 1.5);
  context.font = `${size}px ${font}`; context.fillText(`${details.brideName}`, 360, 355, 580);
  context.font = "italic 35px Georgia"; context.fillText("&", 360, 405);
  context.font = `${size}px ${font}`; context.fillText(details.groomName, 360, 480, 580);
  context.save(); context.beginPath(); context.roundRect(110, 525, 500, 340, 8); context.clip();
  context.fillStyle = palette.paper; context.fillRect(110, 525, 500, 340);
  if (photo) {
    // Fit the whole photo inside the frame. A gentle reveal never enlarges it past the edges.
    const progress = Math.min(1, Math.max(0, elapsed / 1200));
    const scale = Math.min(476 / photo.width, 316 / photo.height) * (.96 + .04 * progress);
    context.drawImage(photo, 360 - photo.width * scale / 2, 695 - photo.height * scale / 2, photo.width * scale, photo.height * scale);
  }
  context.restore();
  context.fillStyle = palette.ink; context.font = "26px Georgia"; context.fillText(details.weddingDate, 360, 930);
  context.font = "17px sans-serif"; context.fillText(details.venueName, 360, 975, 580);
  context.strokeStyle = palette.readableAccent; context.beginPath(); context.moveTo(70, 1020); context.lineTo(650, 1020); context.stroke();
  context.fillStyle = palette.readableAccent; context.font = "9px sans-serif"; context.fillText("TWO STORIES. ONE BEAUTIFUL BEGINNING.", 360, 1050);
}
