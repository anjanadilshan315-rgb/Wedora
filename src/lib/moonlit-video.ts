import type { StandardInvitationDetails } from "./standard-invitation";
import type { standardAppearance } from "./standard-appearance";

/** Moonlit's own movie artwork, reused for playback and the downloaded film. */
export function drawMoonlitVideoFrame(context: CanvasRenderingContext2D, details: StandardInvitationDetails, palette: ReturnType<typeof standardAppearance>, font: string, photo: HTMLImageElement | null, elapsed: number) {
  context.fillStyle = palette.background; context.fillRect(0, 0, 720, 1080);
  if (photo) {
    const scale = Math.max(720 / photo.width, 1080 / photo.height) * (1 + elapsed / 220000);
    context.drawImage(photo, (720 - photo.width * scale) / 2, (1080 - photo.height * scale) * .4, photo.width * scale, photo.height * scale);
  }
  const shade = context.createLinearGradient(0, 0, 0, 1080); shade.addColorStop(0, "rgba(5,14,33,.3)"); shade.addColorStop(.45, "rgba(5,14,33,.2)"); shade.addColorStop(1, "rgba(5,14,33,.97)");
  context.fillStyle = shade; context.fillRect(0, 0, 720, 1080);
  for (let star = 0; star < 24; star++) {
    context.globalAlpha = .2 + (Math.sin(elapsed / 900 + star) + 1) * .25;
    context.fillStyle = "#e6efff"; context.beginPath(); context.arc((star * 107 + 30) % 690, (star * 71 + 30) % 650, star % 3 ? 1 : 2, 0, Math.PI * 2); context.fill();
  }
  context.globalAlpha = 1; context.textAlign = "left"; context.fillStyle = "#f5f6ff";
  context.font = "12px sans-serif"; context.fillText("AN EVENING WRITTEN IN THE STARS", 45, 70);
  const size = Math.min(80, 600 / Math.max(details.brideName.length, details.groomName.length) * 1.6);
  context.font = `${size}px ${font}`; context.fillText(details.brideName, 45, 660, 620);
  context.font = `italic 45px ${font}`; context.fillText("&", 45, 720);
  context.font = `${size}px ${font}`; context.fillText(details.groomName, 45, 810, 620);
  context.strokeStyle = "#dbe8ff88"; context.beginPath(); context.moveTo(45, 860); context.lineTo(675, 860); context.stroke();
  context.font = "22px sans-serif"; context.fillText(details.weddingDate, 45, 915);
  context.font = "17px sans-serif"; context.fillText(details.venueName, 45, 955, 620);
  context.font = "10px sans-serif"; context.fillText("ONE EVENING. A THOUSAND FOREVERS.", 45, 1030);
}
