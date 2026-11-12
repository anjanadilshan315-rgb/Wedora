import type { StandardInvitationDetails } from "./standard-invitation";
import type { standardAppearance } from "./standard-appearance";

/** A separate postcard composition for the Solstice downloadable keepsake. */
export function drawSolsticeVideoFrame(context: CanvasRenderingContext2D, details: StandardInvitationDetails, palette: ReturnType<typeof standardAppearance>, font: string, photo: HTMLImageElement | null, elapsed: number) {
  context.fillStyle = palette.paper; context.fillRect(0, 0, 720, 1080);
  context.fillStyle = palette.primary; context.fillRect(0, 0, 720, 560);
  if (photo) {
    const scale = Math.max(720 / photo.width, 560 / photo.height) * (1 + elapsed / 200000);
    context.save(); context.beginPath(); context.rect(0, 0, 720, 560); context.clip();
    context.drawImage(photo, (720 - photo.width * scale) / 2, (560 - photo.height * scale) * .3, photo.width * scale, photo.height * scale); context.restore();
  }
  // Interlocking wedding rings match the new folio cover.
  context.save(); context.translate(610, 645); context.rotate(Math.sin(elapsed / 3000) * .08); context.strokeStyle = palette.readableAccent; context.lineWidth = 1.5;
  context.beginPath(); context.ellipse(-14, 0, 22, 26, -.35, 0, Math.PI * 2); context.stroke();
  context.beginPath(); context.ellipse(14, 0, 22, 26, .35, 0, Math.PI * 2); context.stroke(); context.restore();
  context.textAlign = "left"; context.fillStyle = palette.readableAccent; context.font = "12px sans-serif";
  context.fillText("A POSTCARD FROM OUR NEXT CHAPTER", 45, 620);
  const nameSize = Math.min(66, 580 / Math.max(details.brideName.length, details.groomName.length) * 1.6);
  context.fillStyle = palette.ink; context.font = `${nameSize}px ${font}`;
  context.fillText(details.brideName, 45, 720, 580); context.fillText(`& ${details.groomName}`, 45, 805, 620);
  context.strokeStyle = palette.line; context.beginPath(); context.moveTo(45, 850); context.lineTo(675, 850); context.stroke();
  context.fillStyle = palette.readableAccent; context.font = "11px sans-serif"; context.fillText("THE DATE", 45, 890); context.fillText("THE PLACE", 355, 890);
  context.fillStyle = palette.ink; context.font = "20px sans-serif"; context.fillText(details.weddingDate, 45, 930); context.fillText(details.venueName, 355, 930, 300);
  context.fillStyle = palette.primary; context.fillRect(0, 1010, 720, 70);
  context.fillStyle = palette.onPrimary; context.font = "12px sans-serif"; context.fillText("GOOD COMPANY. A LITTLE SUNSHINE. A LIFETIME OF US.", 45, 1052, 630);
}
