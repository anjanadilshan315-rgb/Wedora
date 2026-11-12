import type { StandardInvitationDetails } from "./standard-invitation";
import { standardAppearance } from "./standard-appearance";
import { drawSolsticeVideoFrame } from "./solstice-video";
import { drawSaffronVideoFrame } from "./saffron-video";
import { drawPremiumVideoFrame } from "./premium-video";
import { drawEvermoreVideoFrame } from "./evermore-video";
import { drawWalawwaVideoFrame } from "./walawwa-video";
import { drawAurelineVideoFrame } from "./aureline-video";
import { drawMoonlitVideoFrame } from "./moonlit-video";

/** Render a shareable, silent 12-second invitation film entirely in the browser. */
export async function downloadInvitationVideo(details: StandardInvitationDetails & { premiumFilm?: boolean; aurelineFilm?: boolean; walawwaFilm?: boolean; evermoreFilm?: boolean }, onProgress: (value: number) => void) {
  if (typeof MediaRecorder === "undefined" || !HTMLCanvasElement.prototype.captureStream) throw new Error("Video export is unavailable in this browser. Please use a current desktop Chrome or Edge.");
  const mimeType = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/mp4", "video/webm"].find((type) => MediaRecorder.isTypeSupported(type));
  if (!mimeType) throw new Error("This browser cannot export invitation videos.");
  const canvas = document.createElement("canvas"); canvas.width = 720; canvas.height = 1080;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Video canvas is unavailable.");
  await document.fonts.ready;
  const sources = [details.couplePhoto, ...details.gallery].filter(Boolean);
  const photos = await Promise.all(sources.map((src) => new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image(); image.onload = () => resolve(image); image.onerror = () => resolve(null); image.src = src;
  })));
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4_000_000 });
  const chunks: BlobPart[] = [];
  let frame = 0;
  const appearance = standardAppearance(details);
  const computed = getComputedStyle(document.documentElement);
  const font = appearance.font.family.replace(/var\((--[a-z-]+)\)/g, (_, name: string) => computed.getPropertyValue(name).trim() || "Georgia");
  try {
    await new Promise<void>((resolve, reject) => {
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => resolve(); recorder.onerror = () => reject(new Error("Video export failed. Please try again."));
      const started = performance.now();
      function draw() {
        const elapsed = performance.now() - started;
        context!.fillStyle = appearance.primary; context!.fillRect(0, 0, 720, 1080);
        const photo = photos.length ? photos[Math.min(photos.length - 1, Math.floor(elapsed / (12000 / photos.length)))] : null;
        if (details.evermoreFilm) {
          drawEvermoreVideoFrame(context!, details, appearance, font, photo, elapsed);
        } else if (details.walawwaFilm) {
          drawWalawwaVideoFrame(context!, details, appearance, font, photo, elapsed);
        } else if (details.aurelineFilm) {
          drawAurelineVideoFrame(context!, details, appearance, font, photo, elapsed);
        } else if (details.premiumFilm) {
          drawPremiumVideoFrame(context!, details, appearance, font, photo, elapsed);
        } else if (details.standardLayout === "saffron") {
          drawSaffronVideoFrame(context!, details, appearance, font, photo, elapsed);
        } else if (details.standardLayout === "moonlit") {
          drawMoonlitVideoFrame(context!, details, appearance, font, photo, elapsed);
        } else if (details.standardLayout === "solstice") {
          drawSolsticeVideoFrame(context!, details, appearance, font, photo, elapsed);
        } else {
        if (photo) {
          const scale = Math.max(720 / photo.width, 1080 / photo.height) * (1 + (elapsed % 4000) / 80000);
          context!.drawImage(photo, (720 - photo.width * scale) / 2, (1080 - photo.height * scale) / 2, photo.width * scale, photo.height * scale);
          context!.fillStyle = "rgba(12,30,24,.57)"; context!.fillRect(0, 0, 720, 1080);
        }
        context!.strokeStyle = appearance.accent; context!.lineWidth = 1; context!.strokeRect(32, 32, 656, 1016);
        const textColor = photos.some(Boolean) ? "#fff8e9" : appearance.onPrimary;
        context!.textAlign = "center"; context!.fillStyle = textColor; context!.font = "14px sans-serif";
        context!.fillText("TOGETHER WITH OUR FAMILIES", 360, 270);
        const nameSize = Math.min(86, 570 / Math.max(details.brideName.length, details.groomName.length) * 1.65);
        context!.fillStyle = textColor; context!.font = `${nameSize}px ${font}`;
        context!.fillText(details.brideName, 360, 415, 590);
        context!.font = `italic 56px ${font}`; context!.fillStyle = textColor; context!.fillText("&", 360, 490);
        context!.font = `${nameSize}px ${font}`; context!.fillStyle = textColor; context!.fillText(details.groomName, 360, 580, 590);
        context!.font = "16px sans-serif"; context!.fillText("INVITE YOU TO CELEBRATE THEIR WEDDING", 360, 690, 600);
        context!.font = `38px ${font}`; context!.fillText(details.weddingDate, 360, 774);
        context!.font = `28px ${font}`; context!.fillText(details.venueName, 360, 830, 590);
        context!.fillStyle = textColor; context!.font = "14px sans-serif"; context!.fillText("THE BEGINNING OF OUR FOREVER", 360, 980);
        }
        onProgress(Math.min(100, Math.round(elapsed / 120)));
        if (elapsed >= 12000) recorder.stop(); else frame = requestAnimationFrame(draw);
      }
      recorder.start(); draw();
    });
    const url = URL.createObjectURL(new Blob(chunks, { type: mimeType }));
    const link = document.createElement("a"); link.href = url; link.download = `our-wedding-invitation.${mimeType.startsWith("video/mp4") ? "mp4" : "webm"}`; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  } finally { cancelAnimationFrame(frame); if (recorder.state !== "inactive") recorder.stop(); stream.getTracks().forEach((track) => track.stop()); }
}
