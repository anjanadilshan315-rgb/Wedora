import type { StandardInvitationDetails } from "./standard-invitation";
import type { standardAppearance } from "./standard-appearance";

/** Both the player and downloaded film use this same uncropped, day-to-night artwork. */
export function drawWalawwaVideoFrame(ctx: CanvasRenderingContext2D, details: StandardInvitationDetails, palette: ReturnType<typeof standardAppearance>, font: string, photo: HTMLImageElement | null, elapsed: number) {
  const night = Math.min(1, Math.max(0, (elapsed - 4500) / 3500));
  ctx.fillStyle = palette.background; ctx.fillRect(0, 0, 720, 1080);
  ctx.fillStyle = `rgba(12,20,51,${night})`; ctx.fillRect(0, 0, 720, 1080);
  const ink = night > .5 ? "#fff1d8" : palette.primaryText;
  const gold = night > .5 ? "#e8c27a" : palette.readableAccent;
  ctx.strokeStyle = gold; ctx.lineWidth = 1;
  ctx.strokeRect(35, 35, 650, 1010); ctx.strokeRect(44, 44, 632, 992);
  // Hanging lights echo the courtyard's lanterns.
  for (let n = 0; n < 6; n++) {
    const x = 85 + n * 110, y = 90 + n % 3 * 25;
    ctx.beginPath(); ctx.moveTo(x, 44); ctx.lineTo(x, y); ctx.stroke();
    ctx.fillStyle = gold; ctx.beginPath(); ctx.roundRect(x - 10, y, 20, 28, 7); ctx.fill();
  }
  ctx.textAlign = "center"; ctx.fillStyle = gold; ctx.font = "11px sans-serif";
  ctx.fillText(night > .5 ? "A CELEBRATION BENEATH THE STARS" : "TOGETHER WITH OUR FAMILIES", 360, 215);
  ctx.fillStyle = ink;
  const size = Math.min(66, 570 / Math.max(details.brideName.length, details.groomName.length) * 1.5);
  ctx.font = `italic ${size}px ${font}`; ctx.fillText(details.brideName, 360, 300, 560);
  ctx.font = "italic 34px Georgia"; ctx.fillStyle = gold; ctx.fillText("&", 360, 352);
  ctx.font = `italic ${size}px ${font}`; ctx.fillStyle = ink; ctx.fillText(details.groomName, 360, 425, 560);
  ctx.save(); ctx.beginPath(); ctx.roundRect(145, 470, 430, 380, [150, 150, 12, 12]); ctx.clip();
  ctx.fillStyle = palette.paper; ctx.fillRect(145, 470, 430, 380);
  if (photo) { const scale = Math.min(400 / photo.width, 350 / photo.height); ctx.drawImage(photo, 360 - photo.width * scale / 2, 660 - photo.height * scale / 2, photo.width * scale, photo.height * scale); }
  ctx.restore();
  ctx.fillStyle = ink; ctx.font = "26px Georgia"; ctx.fillText(details.weddingDate, 360, 912);
  ctx.font = "17px sans-serif"; ctx.fillText(details.venueName, 360, 955, 560);
  ctx.fillStyle = gold; ctx.font = "10px sans-serif"; ctx.fillText("ONE DAY. TWO FAMILIES. A LIFETIME OF LOVE.", 360, 1003);
}
