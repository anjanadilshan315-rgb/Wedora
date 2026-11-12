import type { StandardInvitationDetails } from "./standard-invitation";
import type { standardAppearance } from "./standard-appearance";

/** Blush stationery movie, shared by the built-in player and downloaded keepsake. */
export function drawPremiumVideoFrame(context: CanvasRenderingContext2D, details: StandardInvitationDetails, palette: ReturnType<typeof standardAppearance>, font: string, photo: HTMLImageElement | null, elapsed: number) {
  context.fillStyle = palette.background; context.fillRect(0, 0, 720, 1080);
  context.strokeStyle = palette.accent; context.lineWidth = 1;
  context.strokeRect(30, 30, 660, 1020); context.strokeRect(38, 38, 644, 1004);
  context.fillStyle = palette.paper; context.fillRect(60, 65, 600, 930);
  context.textAlign = "center"; context.fillStyle = palette.readableAccent;
  context.font = "11px sans-serif"; context.fillText("TOGETHER WITH OUR FAMILIES", 360, 115);
  const size = Math.min(70, 550 / Math.max(details.brideName.length, details.groomName.length) * 1.6);
  context.fillStyle = palette.primaryText; context.font = `${size}px ${font}`; context.fillText(details.brideName, 360, 220, 550);
  context.font = "italic 40px Georgia"; context.fillText("&", 360, 275);
  context.font = `${size}px ${font}`; context.fillText(details.groomName, 360, 360, 550);
  context.save(); context.beginPath(); context.roundRect(125, 400, 470, 390, [180, 180, 0, 0]); context.clip();
  context.fillStyle = palette.background; context.fillRect(125, 400, 470, 390);
  if (photo) { const scale = Math.max(470 / photo.width, 390 / photo.height) * (1 + elapsed / 300000); context.drawImage(photo, 360 - photo.width * scale / 2, 595 - photo.height * scale / 2, photo.width * scale, photo.height * scale); }
  context.restore();
  context.fillStyle = palette.ink; context.font = "29px Georgia"; context.fillText(details.weddingDate, 360, 860);
  context.font = "19px Georgia"; context.fillText(details.venueName, 360, 910, 550);
  context.fillStyle = palette.readableAccent; context.font = "10px sans-serif"; context.fillText("THE BEGINNING OF OUR ALWAYS", 360, 970);
  for (let index = 0; index < 16; index++) {
    context.save(); context.globalAlpha = .15; context.fillStyle = palette.primary;
    context.translate((index * 127 + 30) % 720, (elapsed / 40 + index * 81) % 1080); context.rotate(elapsed / 1800 + index);
    context.beginPath(); context.ellipse(0, 0, 4, 9, 0, 0, Math.PI * 2); context.fill(); context.restore();
  }
}
