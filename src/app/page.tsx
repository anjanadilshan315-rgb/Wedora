"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig } from "framer-motion";
import {
  ArrowRight, ArrowUpRight,
  Heart, LayoutTemplate, Link2, Plus, Share2, Users, Wand2,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import HomeBanner from "@/components/HomeBanner";
import Footer from "@/components/Footer";
import InvitationTemplateCard from "@/components/InvitationTemplateCard";
import { PREMIUM_SHOWCASE } from "@/lib/invitation-showcase";
import { FREE_PLAN } from "@/lib/template-catalog";
import glass from "./premium-cards.module.css";
import styles from "./home.module.css";

const features = [
  { icon: LayoutTemplate, title: "Thoughtfully designed", text: "From timeless florals to modern romance." },
  { icon: Wand2, title: "Beautifully personal", text: "Your names, your details, your story." },
  { icon: Share2, title: "Effortlessly shared", text: "Send a little love with a simple link." },
  { icon: Users, title: "Guests, all together", text: "Keep your invitations and replies in one place." },
];

const steps = [
  { icon: LayoutTemplate, title: "Find your invitation", text: "Explore the collection and choose a design that feels like the two of you.", link: "Explore designs", href: "/templates" },
  { icon: Wand2, title: "Make it your own", text: "Add your wedding details, personal message and the finishing touches you love.", link: "Find your plan", href: "/packages" },
  { icon: Share2, title: "Send a little joy", text: "Share your invitation link with loved ones and bring everyone into your celebration.", link: "Get started", href: "/register" },
];

const questions = [
  { question: "How do I create my wedding invitation?", answer: "Choose a template and a plan, then personalize your invitation with your names, wedding details and message. Preview it before sharing the invitation link with your guests." },
  { question: "Can I try Liora before choosing a paid plan?", answer: `Yes. The Free plan lets you create one invitation, save your draft and share a permanent invitation link with up to ${FREE_PLAN.guestLimit} guests. Visit Packages to compare the features of each plan.` },
  { question: "Can I use my own photos and music?", answer: "Photo and music options are available on paid plans. Basic includes a couple photo and background music, while Standard and Premium offer additional presentation options. Compare the plans to find the right fit." },
  { question: "How do guests receive the invitation?", answer: "Share your invitation link directly with your guests. Depending on your plan, you can also use WhatsApp, email sharing and a QR code. Guests can open the invitation in their browser." },
];

export default function HomePage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.page}>
        <a href="#main-content" className={styles.skipLink}>Skip to content</a>
        <SiteHeader active="Home" fixed />

        <main id="main-content">
          <HomeBanner />

          <section className={styles.featureStrip} aria-label="The Liora experience">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className={styles.feature}>
                <Icon size={22} strokeWidth={1.3} />
                <div><h2>{title}</h2><p>{text}</p></div>
              </div>
            ))}
          </section>

          {/* Keep the Premium collection and the gold glass treatment. */}
          <section id="signature-collection" className={glass.collection} aria-labelledby="popular-templates-heading">
            <div className={styles.sectionHeader}>
              <div><p className={styles.eyebrow}>THE SIGNATURE COLLECTION</p><h2 id="popular-templates-heading">Popular Invitation Templates</h2><p className={styles.sectionDescription}>Choose from our most loved designs. Make every detail your own.</p></div>
              <Link href="/templates" className={glass.allTemplates}>View all templates <ArrowUpRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PREMIUM_SHOWCASE.map((template) => <InvitationTemplateCard key={template.id} template={template} />)}
            </div>
            <p className={styles.collectionFootnote}><Heart size={13} /> Different styles. The same beautiful beginning.</p>
          </section>

          <section className={styles.howItWorks} aria-labelledby="steps-heading">
            <div className={styles.centerHeading}><p className={styles.eyebrow}>FROM YES TO YOU&apos;RE INVITED</p><h2 id="steps-heading">Something beautiful.<br /><em>Something wonderfully simple.</em></h2><p>Your invitation comes together in three thoughtful steps.</p></div>
            <div className={styles.stepsGrid}>
              {steps.map(({ icon: Icon, title, text, link, href }, index) => (
                <article key={title} className={styles.step}>
                  <div className={styles.stepTop}><span>0{index + 1}</span><Icon size={25} strokeWidth={1.2} /></div>
                  <h3>{title}</h3><p>{text}</p><Link href={href} className={styles.textLink}>{link} <ArrowRight size={14} /></Link>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.story} aria-labelledby="story-heading">
            <div className={styles.storyVisual}>
              <Image src="/assets/evermore/quiet-romance.jpg" alt="A couple sharing a quiet moment on their wedding day" fill sizes="(min-width: 900px) 45vw, 100vw" className="object-cover" />
              <div className={styles.storyNote}><Heart size={18} strokeWidth={1.2} /><span>More moments.<br /><em>Less to worry about.</em></span></div>
            </div>
            <div className={styles.storyCopy}>
              <p className={styles.eyebrow}>BEYOND A BEAUTIFUL INVITATION</p>
              <h2>A little less planning.<br /><em>A lot more celebrating.</em></h2>
              <p>Let your invitation do more than share a date. Give your guests the details they need, collect their replies, and keep your celebration together in one place.</p>
              <ul className={styles.storyFeatures}>
                <li><Link2 size={18} /><div><h3>One link. Every lovely detail.</h3><p>A personal place for your wedding date, venue and message.</p></div></li>
                <li><Users size={18} /><div><h3>Keep your people close.</h3><p>Manage your guests and RSVP replies from your dashboard.</p></div></li>
                <li><Wand2 size={18} /><div><h3>A plan for your celebration.</h3><p>Start simple or explore more with Basic, Standard and Premium.</p></div></li>
              </ul>
              <Link href="/packages" className={styles.textLink}>Explore the possibilities <ArrowUpRight size={16} /></Link>
            </div>
          </section>

          <section className={styles.faq} aria-labelledby="faq-heading">
            <div><p className={styles.eyebrow}>A FEW LITTLE DETAILS</p><h2 id="faq-heading">Before you<br /><em>say hello.</em></h2><p>Everything you need to get started.<br />A little guidance, whenever you need it.</p><Link href="/contact" className={styles.textLink}>Let&apos;s talk <ArrowUpRight size={15} /></Link></div>
            <div className={styles.questions}>
              {questions.map(({ question, answer }) => <details key={question}><summary>{question}<Plus size={17} aria-hidden="true" /></summary><p>{answer}</p></details>)}
            </div>
          </section>

          <section className={styles.finalCta} aria-labelledby="cta-heading">
            <Heart size={25} strokeWidth={1} />
            <p className={styles.eyebrow}>YOUR FOREVER STARTS WITH A HELLO</p>
            <h2 id="cta-heading">Let&apos;s make your first impression<br /><em>one to remember.</em></h2>
            <p>Find an invitation that feels like your love story.</p>
            <Link href="/register" className={styles.primaryButton}>Create your invitation <ArrowRight size={16} /></Link>
            <span className={styles.ctaNote}>A free plan to begin. Room to make it yours.</span>
          </section>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
