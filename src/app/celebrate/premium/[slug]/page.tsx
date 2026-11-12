"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import type { PublicPremiumInvitation } from "@/lib/premium-invitation";
import { premiumRequest, PremiumRequestError } from "@/lib/premium-studio-client";
import PremiumInvitation from "@/components/premium/PremiumInvitation";

function Invitation() {
  const { slug } = useParams<{ slug: string }>();
  const token = useSearchParams().get("guest");
  const query = token ? `?guest=${encodeURIComponent(token)}` : "";
  const [invitation, setInvitation] = useState<PublicPremiumInvitation | null>(null);
  const [locked, setLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setInvitation(null); setError(""); setLocked(false);
    premiumRequest<PublicPremiumInvitation>(`public/${encodeURIComponent(slug)}${query}`).then((data) => { if (!cancelled) setInvitation(data); }).catch((reason) => { if (!cancelled) { if (reason instanceof PremiumRequestError && reason.status === 423) setLocked(true); else setError(reason.message); } });
    return () => { cancelled = true; };
  }, [slug, query]);
  if (locked) return <main className="grid min-h-screen place-items-center bg-[#f7e9ec] px-6 text-[#582635]"><form className="w-full max-w-sm rounded-t-[100px] border border-[#d9bfc4] bg-[#fff8f5] px-8 py-14 text-center shadow-xl shadow-[#792d43]/5" onSubmit={async (event) => { event.preventDefault(); setBusy(true); setError(""); try { await premiumRequest(`public/${slug}/unlock`, "POST", { password }); setPassword(""); setInvitation(await premiumRequest<PublicPremiumInvitation>(`public/${slug}${query}`)); setLocked(false); } catch (reason) { setError(reason instanceof Error ? reason.message : "Please try again."); } finally { setBusy(false); } }}><LockKeyhole className="mx-auto mb-6" size={27} strokeWidth={1} /><p className="text-[9px] uppercase tracking-[.2em]">An invitation just for you</p><h1 className="mt-5 font-serif-luxury text-4xl">A little privacy.<br />A lot of love.</h1><p className="mt-5 text-xs leading-6">Enter the invitation password shared by the couple.</p><label className="mt-7 block text-left text-xs">Invitation password<input required maxLength={128} type="password" autoComplete="current-password" className="mt-2 w-full border border-[#d9bfc4] bg-white px-4 py-3" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p role="alert" className="mt-4 text-xs leading-6">{error}</p>}<button disabled={busy} className="mt-6 w-full bg-[#792d43] px-5 py-3 text-xs text-white disabled:opacity-50">{busy ? "Opening…" : "Open invitation"}</button></form></main>;
  if (error) return <main className="grid min-h-screen place-items-center bg-[#f7e9ec] px-6 text-center"><div><h1 className="font-serif-luxury text-4xl">Your invitation</h1><p role="alert" className="mt-6 text-sm">{error}</p></div></main>;
  if (!invitation) return <p role="status" className="min-h-screen bg-[#f7e9ec] p-20 text-center text-sm">Opening your invitation…</p>;
  return <PremiumInvitation details={invitation.details} guest={invitation.guest} sharePath={`/celebrate/premium/${slug}`} submitRsvp={async (input) => { setInvitation(await premiumRequest<PublicPremiumInvitation>(`public/${slug}/rsvp${query}`, "POST", input)); }} />;
}
export default function Page() { return <Suspense fallback={<p className="p-20 text-center">Opening your invitation…</p>}><Invitation /></Suspense>; }
