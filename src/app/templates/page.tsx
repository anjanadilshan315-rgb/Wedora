"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Crown, Heart, MessageCircle, Search, Sparkles, X } from "lucide-react";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import InvitationTemplateCard from "@/components/InvitationTemplateCard";
import { PREMIUM_SHOWCASE, STANDARD_SHOWCASE } from "@/lib/invitation-showcase";
import glass from "@/app/premium-cards.module.css";
import styles from "./templates.module.css";

const collections = [
  { plan: "Standard", subtitle: "Bring your invitation to life", description: "Animated beginnings, personal details and a little wedding-day magic.", templates: STANDARD_SHOWCASE, icon: Sparkles },
  { plan: "Premium", subtitle: "A celebration, designed around you", description: "Distinctive stories and thoughtful details for a celebration entirely your own.", templates: PREMIUM_SHOWCASE, icon: Crown },
] as const;

const planFilters = ["All", "Standard", "Premium"] as const;
type PlanFilter = typeof planFilters[number];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("All");
  const search = searchQuery.trim().toLowerCase();

  // Search the plan catalogs directly; the retired invitation registry is not used.
  const visibleCollections = collections
    .filter((collection) => planFilter === "All" || collection.plan === planFilter)
    .map((collection) => ({
      ...collection,
      templates: collection.templates.filter((template) =>
        `${template.name} ${template.description} ${template.plan}`.toLowerCase().includes(search),
      ),
    }))
    .filter((collection) => collection.templates.length > 0);

  const resultCount = visibleCollections.reduce((count, collection) => count + collection.templates.length, 0);

  return (
    <div className={styles.page}>
      <SiteHeader active="Templates" />
      <main>
        <section className={styles.intro} aria-labelledby="templates-heading">
          <Link href="/" className={styles.backLink}><ArrowLeft size={13} /> Back to home</Link>
          <p className={styles.eyebrow}><span /><Heart size={13} /><span /></p>
          <p className={styles.kicker}>THE LIORA COLLECTION</p>
          <h1 id="templates-heading">Invitation Templates</h1>
          <p>Find a beautiful beginning in our Standard and Premium collections.<br className="hidden sm:block" /> Preview your favourite, then make every detail yours.</p>
          <Link href="/packages" className={styles.planLink}>Compare the plans <ArrowUpRight size={15} /></Link>
        </section>

        <section className={styles.toolbar} aria-label="Find an invitation template">
          <div className={styles.toolbarInner}>
            <div className={styles.filters} role="group" aria-label="Filter templates by plan">
              {planFilters.map((plan) => (
                <button key={plan} type="button" onClick={() => setPlanFilter(plan)} aria-pressed={planFilter === plan} className={planFilter === plan ? styles.selected : ""}>
                  {plan === "All" ? "All designs" : `${plan} Plan`}
                </button>
              ))}
            </div>
            <div className={styles.search}>
              <label htmlFor="template-search" className="sr-only">Search invitation templates</label>
              <Search size={16} aria-hidden="true" />
              <input id="template-search" type="search" placeholder="Find your favourite design…" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
              {searchQuery && <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search"><X size={14} /></button>}
            </div>
          </div>
        </section>

        <div className={styles.resultsBar}>
          <p role="status" aria-live="polite">Showing <strong>{resultCount}</strong> invitation {resultCount === 1 ? "design" : "designs"}</p>
          <a href="https://wa.me/94757115645?text=Hi%20Liora!%20Could%20you%20help%20me%20choose%20an%20invitation%20template%3F" target="_blank" rel="noopener noreferrer"><MessageCircle size={14} /> A little help choosing?</a>
        </div>

        {visibleCollections.map(({ plan, subtitle, description, templates, icon: Icon }) => (
          <section key={plan} className={`${glass.collection} ${styles.collection}`} aria-labelledby={`${plan.toLowerCase()}-heading`}>
            <div className={styles.collectionHeader}>
              <div>
                <p className={styles.collectionKicker}><Icon size={14} /> {subtitle}</p>
                <h2 id={`${plan.toLowerCase()}-heading`}>{plan} Plan</h2>
                <p className={styles.collectionDescription}>{description}</p>
              </div>
              <span className={styles.designCount}>{templates.length} {templates.length === 1 ? "design" : "designs"} to make your own</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {templates.map((template) => <InvitationTemplateCard key={template.id} template={template} />)}
            </div>
          </section>
        ))}

        {resultCount === 0 && (
          <section className={styles.empty} aria-labelledby="empty-heading">
            <Search size={30} strokeWidth={1.2} />
            <h2 id="empty-heading">A different kind of beautiful?</h2>
            <p>No designs match your search. Try another name or explore both collections.</p>
            <button type="button" onClick={() => { setSearchQuery(""); setPlanFilter("All"); }}>Show all designs <ArrowUpRight size={15} /></button>
          </section>
        )}

        <section className={styles.help}>
          <Heart size={19} strokeWidth={1.2} />
          <h2>Found the one?</h2>
          <p>Open a live preview to explore the invitation, or choose “Make it yours” to start personalizing.</p>
          <Link href="/packages" className={styles.planLink}>Find your perfect plan <ArrowUpRight size={15} /></Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
