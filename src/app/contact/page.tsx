import { LegalPage, supportEmail } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact the developer of Tailor: email support (reply within 2 working days), help with payment problems, and requests to copy, correct or delete your data.",
  path: "/contact",
});

export default function Contact() {
  const email = supportEmail();
  return (
    <LegalPage title="Contact" updated="7 November 2026">
      <p>Tailor is run by Panshul Bharadwaj, an individual developer based in India.</p>

      <h2>Email</h2>
      <p>
        {email ? <a className="text-lg font-medium text-zinc-900 underline" href={`mailto:${email}`}>{email}</a> : "Reply to any email you've received from us."}
        <br />We reply within 2 working days.
      </p>

      <h2>Payment problems</h2>
      <p>Include the Razorpay payment ID (it starts with <code>pay_</code> and is in your receipt email) and the email address of your Tailor account, so we can find your payment quickly.</p>

      <h2>Data requests</h2>
      <p>To get a copy of your data, have it corrected, or delete your account, email us from the address on your account.</p>
    </LegalPage>
  );
}
