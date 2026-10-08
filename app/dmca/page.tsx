import type { Metadata } from "next";
import Link from "next/link";
import CopyrightForms from "@/components/legal/CopyrightForms";
import { DMCA_AGENT, dmcaAgentComplete } from "@/lib/dmcaAgent";

export const metadata: Metadata = {
  title: "Copyright and DMCA Policy",
  description:
    "How to tell Companies Center about content that infringes your copyright, how to send a counter-notice, and our repeat-infringer policy.",
};

/** The company's published mailing address (also on /contact). */
const MAILING_ADDRESS = ["30190 US Highway 19N #1064", "Clearwater, Florida 33761", "United States"];

function AgentDetails() {
  if (dmcaAgentComplete()) {
    const a = DMCA_AGENT;
    return (
      <address className="not-italic rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-950/40">
        <strong>{a.name}</strong>
        <br />
        {a.organization}
        <br />
        {a.address.map((line) => (
          <span key={line}>
            {line}
            <br />
          </span>
        ))}
        Phone: <a href={`tel:${a.phone.replace(/[^+\d]/g, "")}`}>{a.phone}</a>
        <br />
        Email: <a href={`mailto:${a.email}`}>{a.email}</a>
        <br />
        U.S. Copyright Office registration: {a.registrationNumber}
      </address>
    );
  }
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-950/40">
      <p>
        Our designated agent&apos;s registered contact details are being added to this page. Until then, use
        the form below, which goes to the same team, or post your notice to:
      </p>
      <address className="mt-2 not-italic">
        Companies Center LLC, Attn: Copyright Agent
        <br />
        {MAILING_ADDRESS.map((line) => (
          <span key={line}>
            {line}
            <br />
          </span>
        ))}
      </address>
    </div>
  );
}

/**
 * The notice-and-counter-notice procedure the Terms and the Privacy Policy
 * cite (C53). Notices filed here are recorded and worked in the admin (API:
 * modules/legal-requests).
 */
export default function DmcaPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <section className="bg-brand-900 dark:bg-brand-950 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-14">
          <p className="text-gold-400 text-xs font-black uppercase tracking-[0.15em] mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">Copyright and DMCA Policy</h1>
          <p className="text-white/60 mt-3 text-sm">Last updated: October 8, 2026</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10 space-y-8">
        <article className="legal-prose rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-10">
          <p>
            Companies Center respects the rights of copyright owners and expects the people who use it to do
            the same. We respond to notices of claimed copyright infringement under the Digital Millennium
            Copyright Act (17 U.S.C. 512). If you believe something on Companies Center, such as a post, photo,
            video, service listing or profile, infringes your copyright, you can ask us to remove it.
          </p>

          <h2>Sending a notice</h2>
          <p>Your notice must include:</p>
          <ol>
            <li>your physical or electronic signature;</li>
            <li>a description of the copyrighted work you say is infringed;</li>
            <li>
              a description of the material you say is infringing, and where it is on Companies Center (a link
              to each item is best);
            </li>
            <li>your name, postal address, telephone number and email address;</li>
            <li>
              a statement that you have a good-faith belief that the use of the material is not authorised by
              the copyright owner, its agent, or the law; and
            </li>
            <li>
              a statement that the information in your notice is accurate and, under penalty of perjury, that
              you are the copyright owner or authorised to act on the owner&apos;s behalf.
            </li>
          </ol>
          <p>
            The quickest way is the form below: each part has its own field. You can also send a notice to our
            designated agent:
          </p>
          <AgentDetails />

          <h2>What happens next</h2>
          <p>
            We review every notice. If it is complete, we remove the material or disable access to it, and tell
            the person who posted it. We may give them a copy of your notice, including your name and contact
            details, so they can respond. A notice that is missing a required part may not be acted on; we will
            tell you what is missing.
          </p>

          <h2>Counter-notices</h2>
          <p>
            If we removed something you posted and you believe it was removed by mistake or misidentified, you
            can send a counter-notice. It must include:
          </p>
          <ol>
            <li>your physical or electronic signature;</li>
            <li>a description of the material that was removed, and where it was before it was removed;</li>
            <li>
              a statement, under penalty of perjury, that you have a good-faith belief that the material was
              removed as a result of mistake or misidentification;
            </li>
            <li>your name, postal address and telephone number; and</li>
            <li>
              a statement that you consent to the jurisdiction of the Federal District Court for the judicial
              district in which your address is located (or, if your address is outside the United States, any
              judicial district in which Companies Center may be found), and that you will accept service of
              process from the person who sent the notice, or their agent.
            </li>
          </ol>
          <p>
            We send a copy of your counter-notice to the person who sent the notice. Unless they tell us,
            within 10 working days, that they have filed a court action to stop the infringement, we restore
            the material between 10 and 14 working days after we receive your counter-notice.
          </p>

          <h2>Repeat infringers</h2>
          <p>
            We close the account of anyone who, in appropriate circumstances, is the subject of three upheld
            copyright notices. We may also close an account sooner, or remove material, without a notice when
            the infringement is clear.
          </p>

          <h2>False claims</h2>
          <p>
            Anyone who knowingly and materially misrepresents that material is infringing, or that it was
            removed by mistake, may be liable for damages, including costs and attorneys&apos; fees (17 U.S.C.
            512(f)). Before sending a notice, consider whether the use may be fair use or otherwise permitted.
            If you are unsure, you may want to talk to a lawyer.
          </p>

          <h2>Other concerns</h2>
          <p>
            This procedure is for copyright only. For trademark or other concerns about content, please{" "}
            <Link href="/contact">contact us</Link>. For your personal information, see{" "}
            <Link href="/privacy-request">Privacy requests</Link>.
          </p>
        </article>

        <section
          aria-labelledby="dmca-forms"
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8"
        >
          <h2 id="dmca-forms" className="mb-5 text-xl font-black text-gray-900 dark:text-white">
            Send a notice or counter-notice
          </h2>
          <CopyrightForms />
        </section>
      </div>
    </main>
  );
}
