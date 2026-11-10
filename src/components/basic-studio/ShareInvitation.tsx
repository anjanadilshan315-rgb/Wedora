"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, Mail, MessageCircle } from "lucide-react";
import styles from "./ShareInvitation.module.css";

/** QR codes are generated here, so invitation links are never sent to a QR service. */
export default function ShareInvitation({ path, title, invitationStyle = false }: { path: string; title: string; invitationStyle?: boolean }) {
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    let cancelled = false;
    const address = new URL(path, window.location.origin).href;
    setUrl(address); setQr(""); setNotice("");
    QRCode.toDataURL(address, { width: 320, margin: 4, errorCorrectionLevel: "M", color: { dark: "#38372e", light: "#ffffff" } })
      .then((image) => { if (!cancelled) setQr(image); })
      .catch(() => { if (!cancelled) setNotice("QR code could not load. You can still share the link."); });
    return () => { cancelled = true; };
  }, [path]);
  const message = `${title}\nYou are warmly invited to celebrate with us.\n${url}`;
  const button = invitationStyle ? styles.button : "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#ded4c3] bg-white px-4 py-3 text-xs text-[#62513c]";
  return <div className={invitationStyle ? styles.share : "mt-5 grid items-center gap-5 rounded-2xl bg-[#f8f5ef] p-5 sm:grid-cols-[130px_1fr]"}>
    {qr && <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qr} width={invitationStyle ? 180 : 130} height={invitationStyle ? 180 : 130} alt="Scan to open this wedding invitation" />
      <a href={qr} download="wedding-invitation-qr.png" className="mt-2 flex items-center justify-center gap-1 text-xs underline"><Download size={12} />Download QR</a>
    </div>}
    <div className="min-w-0"><p className={invitationStyle ? styles.address : "break-all text-xs leading-6 text-[#776b59]"}>{url}</p><div className={invitationStyle ? styles.buttons : "mt-3 flex flex-wrap gap-2"}>
      <button type="button" className={button} onClick={async () => {
        try { await navigator.clipboard.writeText(url); setNotice("Invitation link copied."); }
        catch { setNotice("Select and copy the invitation address shown above."); }
      }}><Copy size={14} />Copy</button>
      <a className={`${button} ${invitationStyle ? styles.whatsapp : ""}`} href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} />WhatsApp</a>
      <a className={button} href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`}><Mail size={14} />Email</a>
    </div><p className={invitationStyle ? styles.hint : "mt-3 text-[11px] text-[#776b59]"}>Email opens your email app with the invitation ready to send.</p>{notice && <p role="status" className="mt-2 text-xs">{notice}</p>}</div>
  </div>;
}
