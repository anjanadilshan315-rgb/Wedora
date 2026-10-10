import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy | Wedora" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 2026"
      sections={[
        {
          heading: "What we collect",
          body: (
            <>
              <p>When you create an account we store your name, e-mail address, phone number and a securely hashed password.</p>
              <p>
                For your invitation we store the wedding details and photos you enter, and the guest list you upload (guest names, e-mail
                addresses and optional phone numbers), together with your guests&apos; RSVP replies and wishes.
              </p>
            </>
          ),
        },
        {
          heading: "How we use it",
          body: (
            <>
              <p>We use this information only to create, host and deliver your wedding invitation, to send it to the guests you choose, and to contact you about your order.</p>
              <p>Your invitation page is visible only to people who have its link, and only after your payment is confirmed.</p>
            </>
          ),
        },
        {
          heading: "Sharing",
          body: (
            <p>
              We do not sell your data. Photos are stored with our image hosting provider and e-mails are delivered through our e-mail
              provider, solely to run this service.
            </p>
          ),
        },
        {
          heading: "Your choices",
          body: <p>You can update your profile, edit or remove guests, and hide or delete wishes from your dashboard at any time. To delete your account and all its data, contact us.</p>,
        },
      ]}
    />
  );
}
