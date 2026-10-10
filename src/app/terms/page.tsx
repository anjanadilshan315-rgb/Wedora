import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of Service | Wedora" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="October 2026"
      sections={[
        {
          heading: "Your account",
          body: <p>You are responsible for keeping your login details safe and for the accuracy of the wedding details, photos and guest information you provide.</p>,
        },
        {
          heading: "Ordering an invitation",
          body: (
            <>
              <p>You choose a template, enter your details and submit them. Our team then contacts you to arrange payment.</p>
              <p>Your invitation goes live, and guest e-mails can be sent, once the payment is confirmed. Changes after confirmation are made by our team on request.</p>
            </>
          ),
        },
        {
          heading: "Content",
          body: <p>Only upload photos and text that you have the right to use. We may remove content that is unlawful or offensive.</p>,
        },
        {
          heading: "Sending invitations",
          body: <p>Only add guests who expect to hear from you. Invitation e-mails are sent on your behalf to the addresses you provide.</p>,
        },
      ]}
    />
  );
}
