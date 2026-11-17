import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crown, Sparkles, Wand2 } from "lucide-react";
import type { ShowcaseTemplate } from "@/lib/invitation-showcase";
import styles from "@/app/premium-cards.module.css";

// Home and Templates share the same clear artwork and readable details panel.
export default function InvitationTemplateCard({ template }: { template: ShowcaseTemplate }) {
  const PlanIcon = template.plan === "Premium" ? Crown : Sparkles;

  return (
    <article className={styles.card} data-template={template.id}>
      <div className={styles.artwork}>
        <Image src={template.image} alt={template.alt} fill quality={90} sizes="(min-width: 1280px) 280px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className={template.imageClass} />
      </div>
      <div className={styles.glassBackdrop} aria-hidden="true">
        <Image src={template.image} alt="" fill quality={90} sizes="(min-width: 1280px) 280px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className={styles.imageShade} aria-hidden="true" />
      <span className={styles.planBadge}><PlanIcon aria-hidden="true" size={12} /> {template.plan} Plan</span>
      <div className={styles.glassPanel}>
        <span className={styles.accentLine} aria-hidden="true" />
        <h3 className="font-serif-luxury text-[32px] font-semibold leading-tight">{template.name}</h3>
        <p className={styles.description}>{template.description}</p>
        <Link href={template.previewHref} className={styles.previewButton} aria-label={`View ${template.name} live preview`}>View Live Preview <ArrowRight aria-hidden="true" size={15} /></Link>
        <Link href={template.createHref} className={styles.customizeLink} aria-label={`Customize ${template.name}`}>Make it yours <Wand2 aria-hidden="true" size={13} /></Link>
      </div>
    </article>
  );
}
