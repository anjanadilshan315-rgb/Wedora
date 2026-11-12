import type { StandardInvitationDetails } from "./standard-invitation";
import type { standardAppearance } from "./standard-appearance";

/** One drawing function keeps the film preview and downloaded keepsake identical. */
export function drawSaffronVideoFrame(context: CanvasRenderingContext2D, details: StandardInvitationDetails, palette: ReturnType<typeof standardAppearance>, font: string, photo: HTMLImageElement | null, elapsed: number) {
  context.fillStyle = palette.paper;
  context.fillRect(0, 0, 720, 1080);
  context.fillStyle = palette.ink;
  context.textAlign = "left";
  context.font = "12px sans-serif";
  context.fillText("THE GOOD THINGS / WEDDING EDITION", 45, 55);
  context.strokeStyle = palette.ink;
  context.beginPath(); context.moveTo(45, 80); context.lineTo(675, 80); context.stroke();
  const size = Math.min(74, 580 / Math.max(details.brideName.length, details.groomName.length) * 1.6);
  context.font = `${size}px ${font}`;
  context.fillText(details.brideName, 45, 185, 620);
  context.font = `italic 48px Georgia`;
  context.fillStyle = palette.readableAccent;
  context.fillText("&", 45, 245);
  context.font = `${size}px ${font}`;
  context.fillStyle = palette.ink;
  context.fillText(details.groomName, 45, 330, 620);
  context.save(); context.beginPath(); context.rect(45, 380, 630, 440); context.clip();
  context.fillStyle = palette.background; context.fillRect(45, 380, 630, 440);
  if (photo) {
    const scale = Math.max(630 / photo.width, 440 / photo.height) * (1 + elapsed / 300000);
    context.drawImage(photo, 360 - photo.width * scale / 2, 600 - photo.height * scale / 2, photo.width * scale, photo.height * scale);
  }
  context.restore();
  context.fillStyle = palette.primary; context.fillRect(45, 845, 630, 155);
  context.fillStyle = palette.onPrimary; context.font = "12px sans-serif";
  context.fillText("A DAY FOR OUR FAVOURITE PEOPLE", 65, 878);
  context.font = "24px sans-serif"; context.fillText(details.weddingDate, 65, 923);
  context.font = "17px sans-serif"; context.fillText(details.venueName, 65, 966, 580);
  context.fillStyle = palette.ink; context.font = "10px sans-serif";
  context.fillText("BIG LOVE. GOOD COMPANY. YOU, INCLUDED.", 45, 1045);
  for (let index = 0; index < 10; index++) {
    context.save(); context.translate((index * 73 + 10) % 720, (elapsed / 25 + index * 103) % 1080); context.rotate(elapsed / 2000 + index);
    context.globalAlpha = .22; context.fillStyle = palette.accent; context.fillRect(0, 0, 6, 13); context.restore();
  }
}
