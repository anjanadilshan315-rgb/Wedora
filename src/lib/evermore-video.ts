import type { StandardInvitationDetails } from "./standard-invitation";
import type { standardAppearance } from "./standard-appearance";

/** Shared by the film preview and download; images fit without losing their edges. */
export function drawEvermoreVideoFrame(
  ctx: CanvasRenderingContext2D,
  details: StandardInvitationDetails,
  palette: ReturnType<typeof standardAppearance>,
  font: string,
  photo: HTMLImageElement | null,
  elapsed: number,
) {
  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, 720, 1080);
  ctx.fillStyle = palette.paper;
  ctx.beginPath();
  ctx.roundRect(70, 55, 580, 970, [280, 280, 16, 16]);
  ctx.fill();
  ctx.strokeStyle = palette.readableAccent;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(85, 70, 550, 940, [270, 270, 8, 8]);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = palette.readableAccent;
  ctx.font = "11px sans-serif";
  ctx.fillText("THE BEGINNING OF ALWAYS", 360, 225);
  const size = Math.min(
    66,
    (540 / Math.max(details.brideName.length, details.groomName.length)) * 1.5,
  );
  ctx.fillStyle = palette.primaryText;
  ctx.font = `italic ${size}px ${font}`;
  ctx.fillText(details.brideName, 360, 315, 510);
  ctx.font = "italic 32px Georgia";
  ctx.fillStyle = palette.readableAccent;
  ctx.fillText("&", 360, 365);
  ctx.fillStyle = palette.primaryText;
  ctx.font = `italic ${size}px ${font}`;
  ctx.fillText(details.groomName, 360, 445, 510);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(150, 490, 420, 350, 8);
  ctx.clip();
  ctx.fillStyle = palette.background;
  ctx.fillRect(150, 490, 420, 350);
  if (photo) {
    const scale = Math.min(400 / photo.width, 330 / photo.height);
    ctx.drawImage(
      photo,
      360 - (photo.width * scale) / 2,
      665 - (photo.height * scale) / 2,
      photo.width * scale,
      photo.height * scale,
    );
  }
  ctx.restore();
  ctx.fillStyle = palette.ink;
  ctx.font = "25px Georgia";
  ctx.fillText(details.weddingDate, 360, 900);
  ctx.font = "16px sans-serif";
  ctx.fillText(details.venueName, 360, 942, 510);
  ctx.fillStyle = palette.readableAccent;
  ctx.font = "9px sans-serif";
  ctx.fillText("A LITTLE HELLO. A BEAUTIFUL FOREVER.", 360, 985);
  // Gentle orbiting dots echo the invitation's luminous petal background.
  for (let n = 0; n < 8; n++) {
    const angle = (n * Math.PI) / 4 + elapsed / 10000;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(
      360 + Math.cos(angle) * 310,
      540 + Math.sin(angle) * 480,
      3,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
