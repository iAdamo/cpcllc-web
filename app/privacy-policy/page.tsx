import { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | CompaniesCenter",
  description:
    "How Companies Center collects, uses, shares, and protects your information across our marketplace, mobile app, and Store.",
};

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="CompaniesCenter LLC — Privacy Policy"
      effectiveDate="September 4, 2026"
    >
      <p className="mb-4 text-gray-800">
        This Privacy Policy explains, in plain language, how{" "}
        <strong>Companies Center</strong> (&apos;Companies Center&apos;,
        &apos;we&apos;, &apos;us&apos;, or &apos;our&apos;) collects, uses,
        shares, and protects information when you use our website, mobile
        applications, and related services (together, the{" "}
        <strong>&apos;Platform&apos;</strong>). It covers both people looking to
        hire help (<strong>Clients</strong>) and the businesses and
        professionals who offer services (<strong>Service Providers</strong>).
      </p>
      <p className="mb-4 text-gray-800">
        We have tried to make this document readable rather than lawyerly. Where
        a section uses a specific term (like &apos;precise location&apos; or
        &apos;processor&apos;), we explain what it means the first time it
        appears. By accessing or using the Platform, you agree to this Privacy
        Policy. If you do not agree, please do not use the Platform.
      </p>

      <hr className="my-8" />

      {/* Short version */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The short version</h2>
        <p className="text-gray-800 mb-3">
          This summary is for convenience only — the full sections below control.
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
          <li>
            We collect the information you give us (like your name, contact
            details, and content you post) and information collected
            automatically when you use the Platform (like device and usage
            data).
          </li>
          <li>
            With your permission, we use your <strong>location</strong> to show
            providers near you and improve search and map results. You can turn
            this off in your device settings at any time.
          </li>
          <li>
            We use your information to run the marketplace: create accounts,
            power search and messaging, process bookings and purchases, keep the
            Platform safe, and support you.
          </li>
          <li>
            We <strong>do not sell</strong> your personal information, and we{" "}
            <strong>do not</strong> track you across other companies&apos; apps
            or websites for advertising.
          </li>
          <li>
            Some information is shared with other users as part of normal use
            (for example, a provider&apos;s public profile and reviews), and with
            trusted vendors who help us operate the Platform.
          </li>
          <li>
            You have choices and rights over your information, including the
            ability to access, correct, or delete it, and to delete your
            account.
          </li>
        </ul>
      </section>

      <hr className="my-8" />

      {/* Section 1 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Who we are</h2>
        <p className="text-gray-800 mb-3">
          Companies Center is a company based in Florida, United States. For the
          purpose of data protection laws, Companies Center is the party
          responsible for the personal information described in this Policy (in
          some laws this is called the &apos;controller&apos;).
        </p>
        <div className="text-gray-800 mb-4">
          <p className="mb-2">
            <strong>Business Address:</strong>
          </p>
          <p>30190 US Highway 19N #1064</p>
          <p>Clearwater, Florida 33761</p>
          <p>United States</p>
        </div>
        <p className="text-gray-800 mb-3">Companies Center operates:</p>
        <ol className="list-decimal list-inside mb-4 text-gray-800 space-y-2">
          <li>
            A <strong>marketplace platform</strong> that connects Service
            Providers with Clients; and
          </li>
          <li>
            A <strong>Store</strong> where users may purchase digital and
            business services such as website development, maintenance, and
            related technical services, including marketing services delivered by
            third-party partner companies.
          </li>
        </ol>
        <p className="text-gray-800">
          <strong>Important:</strong> Companies Center does not provide home or
          local services (such as plumbing or cleaning) directly and is generally{" "}
          <strong>not a party to agreements</strong> between Clients and Service
          Providers, unless expressly stated for a specific Store offering. This
          matters for privacy because much of the information on the Platform is
          created and controlled by users about their own dealings with each
          other.
        </p>
      </section>

      <hr className="my-8" />

      {/* Section 2 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Scope and how this applies</h2>
        <p className="text-gray-800 mb-3">
          This Privacy Policy applies to all users of the Platform worldwide,
          across our website and mobile apps. It applies whether you are signed
          in or browsing publicly.
        </p>
        <p className="text-gray-800">
          If local privacy laws in your region require additional disclosures or
          give you additional rights, we will honor those requirements for
          applicable users. See <strong>Section 12</strong> for region-specific
          rights (including California and the EEA/UK).
        </p>
      </section>

      <hr className="my-8" />

      {/* Section 3 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Information we collect</h2>
        <p className="text-gray-800 mb-6">
          We collect information in three ways: information you provide directly,
          information collected automatically as you use the Platform, and
          information from a limited set of third parties. The table below is a
          summary; the subsections that follow explain each item.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Examples</th>
                <th>Why we collect it</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Account &amp; contact</td>
                <td>Name, email, phone number, password (stored encrypted)</td>
                <td>Create and secure your account; contact you</td>
              </tr>
              <tr>
                <td>Profile &amp; business</td>
                <td>
                  Role (Client/Provider), business details, service categories,
                  descriptions, service area, availability, photos
                </td>
                <td>Build your profile and power discovery and matching</td>
              </tr>
              <tr>
                <td>Marketplace activity</td>
                <td>
                  Requests, offers, bookings, appointments, transactions on the
                  Platform
                </td>
                <td>Operate the marketplace and your history</td>
              </tr>
              <tr>
                <td>Communications</td>
                <td>In-app messages, support chats, reviews, ratings, reports</td>
                <td>Enable messaging, support, and trust features</td>
              </tr>
              <tr>
                <td>User content</td>
                <td>Photos, videos, posts, listings, documents you upload</td>
                <td>Show your content where you choose to share it</td>
              </tr>
              <tr>
                <td>Device &amp; usage</td>
                <td>
                  Device type, OS, app version, language, IP address, log data,
                  crash diagnostics, interactions
                </td>
                <td>Run, secure, debug, and improve the Platform</td>
              </tr>
              <tr>
                <td>Identifiers</td>
                <td>Account ID, device identifiers, push notification token</td>
                <td>Recognize your account and deliver notifications</td>
              </tr>
              <tr>
                <td>Location</td>
                <td>Precise and/or approximate location (with permission)</td>
                <td>Show nearby providers; improve search and maps</td>
              </tr>
              <tr>
                <td>Payments</td>
                <td>
                  Transaction status, amount, currency, limited payment metadata
                  (e.g., last four digits)
                </td>
                <td>Process purchases and memberships</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mb-3 mt-8">
          3.1 Information you provide
        </h3>
        <p className="mb-3 text-gray-800">
          This is information you actively give us, for example when you create
          an account, complete your profile, post a listing, send a message, or
          contact support:
        </p>
        <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
          <li>Name, email address, and phone number</li>
          <li>Account type and role (Client, Service Provider, or other)</li>
          <li>
            Profile and business information: service categories, descriptions,
            service area, availability, and pricing you choose to display
          </li>
          <li>
            Requests, offers, bookings, appointments, and transaction-related
            details within the Platform
          </li>
          <li>Messages and communications through in-app chat or support</li>
          <li>Reviews, ratings, recommendations, reports, and feedback</li>
          <li>
            Content you upload (photos, videos, posts, listings, documents)
          </li>
          <li>Support tickets, disputes, and inquiries you send us</li>
        </ul>
        <p className="text-gray-800 mb-6">
          Please only provide information you are comfortable sharing, and do not
          include sensitive information (such as government identifiers or
          financial account numbers) in free-text fields, chat, or public areas
          unless a specific feature asks for it.
        </p>

        <hr className="my-4" />

        <h3 className="text-xl font-semibold mb-3">
          3.2 Information collected automatically
        </h3>
        <p className="mb-3 text-gray-800">
          When you use the Platform, some information is collected automatically
          by our systems and the technologies we rely on to deliver the service:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
          <li>
            Device and app information: device type, operating system, app
            version, and language settings
          </li>
          <li>
            Network and log data: IP address, general connection information,
            server logs, and error/crash diagnostics
          </li>
          <li>
            Usage and interaction data: searches, taps, screens or pages viewed,
            and features used
          </li>
          <li>Approximate location derived from your IP address</li>
          <li>
            Identifiers, including your account ID and a device
            &apos;push token&apos; used to deliver notifications
          </li>
        </ul>
        <p className="text-gray-800 mb-6">
          We use this information to keep the Platform running, secure it against
          abuse, diagnose problems, and understand how features are used so we
          can improve them. We do <strong>not</strong> use it to build
          advertising profiles about you across other companies&apos; services.
        </p>

        <hr className="my-4" />

        <h3 className="text-xl font-semibold mb-3">
          3.3 Location data (optional, with permission)
        </h3>
        <p className="mb-3 text-gray-800">
          A marketplace for local services works best when it knows roughly where
          you are. With your permission, we may collect{" "}
          <strong>precise location</strong> (a specific point from your device&apos;s
          GPS) and/or <strong>approximate location</strong> (a general area) to:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
          <li>Show nearby providers and improve map and search results</li>
          <li>Improve relevance and recommendations</li>
          <li>Support security, fraud prevention, and misuse detection</li>
        </ul>
        <p className="text-gray-800 mb-6">
          You are always in control. You can grant or deny location access when
          prompted, and change it at any time in your device settings. If you
          turn location off, you can still use the Platform, but some
          features — like &apos;providers near me&apos; and the map — may be
          limited or ask you to enter a location manually.
        </p>

        <hr className="my-4" />

        <h3 className="text-xl font-semibold mb-3">
          3.4 Camera, microphone, and photos
        </h3>
        <p className="mb-3 text-gray-800">
          Some features let you add media. When you use them, the app asks your
          permission to access the relevant part of your device:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
          <li>
            <strong>Camera</strong> — to take photos and videos for your profile,
            service listings, reviews, and posts.
          </li>
          <li>
            <strong>Microphone</strong> — to record audio for videos you add to
            your profile and posts.
          </li>
          <li>
            <strong>Photo library</strong> — to let you choose existing images to
            upload.
          </li>
        </ul>
        <p className="text-gray-800 mb-6">
          These permissions are only used for the features described. You can
          decline them, and change them later in your device settings, though the
          related feature will not work without them.
        </p>

        <hr className="my-4" />

        <h3 className="text-xl font-semibold mb-3">3.5 Payments and purchases</h3>
        <p className="mb-3 text-gray-800">
          When you purchase a membership or Store services, your payment is
          handled by a third-party <strong>payment processor</strong> (a
          specialized company that securely handles card and payment data), and,
          for digital purchases made inside a mobile app, by the app store&apos;s
          billing system:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
          <li>
            Card and bank payments are processed by providers such as Stripe or
            Paystack, depending on your region and the option shown at checkout.
          </li>
          <li>
            Digital purchases made within our iOS or Android apps (such as an
            in-app membership) are processed through{" "}
            <strong>Apple In-App Purchase</strong> or{" "}
            <strong>Google Play Billing</strong>, in line with each app store&apos;s
            rules.
          </li>
        </ul>
        <p className="mb-3 text-gray-800">
          From these processors we typically receive only limited transaction
          information, such as:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
          <li>Payment status (successful or failed), date, and time</li>
          <li>Amount, currency, and invoice or receipt details</li>
          <li>
            Limited payment metadata (for example, the last four digits of a card
            or a payment token), depending on the processor
          </li>
        </ul>
        <p className="text-gray-800">
          We do <strong>not</strong> intentionally store full payment card
          numbers on our servers. Each processor handles your payment details
          under its own privacy practices and security standards.
        </p>

        <hr className="my-4" />

        <h3 className="text-xl font-semibold mb-3">
          3.6 Cookies and similar technologies
        </h3>
        <p className="mb-3 text-gray-800">
          On our website, we may use cookies and similar technologies (small
          files or identifiers stored by your browser) for:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
          <li>Keeping you signed in and remembering preferences</li>
          <li>Security and fraud prevention</li>
          <li>Core site functionality</li>
          <li>Analytics and performance measurement of our own services</li>
        </ul>
        <p className="mb-3 text-gray-800">
          We do <strong>not</strong> use cookies or similar technologies to track
          you across third-party websites or apps for targeted advertising. You
          can control cookies through your browser settings, though some features
          may not work properly if you block them.
        </p>

        <hr className="my-4" />

        <h3 className="text-xl font-semibold mb-3">
          3.7 Information from third parties
        </h3>
        <p className="text-gray-800">
          In limited cases we may receive information from third parties, such as
          a payment processor confirming a transaction, an app store confirming a
          purchase or subscription status, or another user who refers you or
          tags you in a review or recommendation. We combine this only as needed
          to operate the Platform and the features you use.
        </p>
      </section>

      <hr className="my-8" />

      {/* Section 4 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. How we use your information</h2>
        <p className="mb-4 text-gray-800">We use information to:</p>
        <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
          <li>Provide, operate, maintain, and improve the Platform and Store</li>
          <li>Create and manage user accounts and profiles</li>
          <li>
            Enable search, discovery, matching, maps, messaging, bookings, and
            reviews
          </li>
          <li>Facilitate purchases, memberships, and access to services</li>
          <li>Send notifications and service messages (see Section 8)</li>
          <li>Provide customer support and respond to inquiries and disputes</li>
          <li>
            Maintain trust and safety: verify accounts, prevent fraud and abuse,
            and enforce our terms
          </li>
          <li>Conduct analytics, debugging, and product improvement</li>
          <li>Comply with legal obligations and respond to lawful requests</li>
        </ul>
        <p className="text-gray-800">
          <strong>
            We do not use personal information to track you across apps or
            websites owned by other companies for advertising purposes.
          </strong>{" "}
          Where the law requires a &apos;legal basis&apos; for using your
          information (for example in the EEA/UK), see Section 12.3.
        </p>
      </section>

      <hr className="my-8" />

      {/* Section 5 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. AI and automated features</h2>
        <p className="mb-4 text-gray-800">
          The Platform may include AI-enabled features, such as an assistant,
          recommendations, or automated responses. To generate a response, these
          features may send the input you provide (for example, a question you
          type) to a third-party AI service provider that processes it on our
          behalf.
        </p>
        <p className="mb-3 text-gray-800">You understand and agree that:</p>
        <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
          <li>
            AI outputs may be inaccurate, incomplete, or inappropriate, and
            should not be relied on as professional advice
          </li>
          <li>
            You should use your own judgment before acting on AI-generated
            outputs
          </li>
          <li>
            We may process inputs to provide the feature, protect the Platform,
            and improve performance
          </li>
          <li>
            You should not enter sensitive personal information into AI features
          </li>
        </ul>
      </section>

      <hr className="my-8" />

      {/* Section 6 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. How we share information</h2>
        <p className="mb-4 text-gray-800">
          We do <strong>not</strong> sell your personal information. We share
          information only as described below.
        </p>

        <h3 className="text-xl font-semibold mb-3">6.1 With other users</h3>
        <p className="mb-3 text-gray-800">
          Because this is a marketplace, some information is visible to other
          users as part of normal use, including:
        </p>
        <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
          <li>
            Provider profiles, service listings, and public profile elements
          </li>
          <li>Reviews, ratings, recommendations, and public posts</li>
          <li>Information you choose to share in a conversation or a request</li>
        </ul>
        <p className="text-gray-800 mb-6">
          What is visible depends on your role, your settings, and how you use the
          Platform. Content you post in public areas can be seen and, in some
          cases, copied or re-shared by others.
        </p>

        <h3 className="text-xl font-semibold mb-3">
          6.2 Vendors and service providers (sub-processors)
        </h3>
        <p className="mb-3 text-gray-800">
          We share information with trusted companies that help us run the
          Platform. These vendors may only use the information to provide services
          to us and must follow contractual and security safeguards. They fall
          into these categories:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
          <li>
            <strong>Hosting and infrastructure</strong> — cloud hosting, storage,
            and content delivery
          </li>
          <li>
            <strong>Maps and location</strong> — mapping and geocoding services
            (for example, Google Maps Platform) to display maps and find nearby
            providers
          </li>
          <li>
            <strong>Notifications</strong> — push notification delivery through
            Apple Push Notification service and Google/Firebase Cloud Messaging,
            and email delivery providers
          </li>
          <li>
            <strong>Payments</strong> — payment processors and app store billing
            (see Section 3.5)
          </li>
          <li>
            <strong>AI services</strong> — the third-party AI provider that powers
            our AI features (see Section 5)
          </li>
          <li>
            <strong>Security and analytics</strong> — tools that help us detect
            abuse and measure and improve performance
          </li>
        </ul>
        <p className="text-gray-800 mb-6">
          You can request the current list of key sub-processors using the
          contact details in Section 17.
        </p>

        <h3 className="text-xl font-semibold mb-3">
          6.3 Marketing partner companies (Store purchases)
        </h3>
        <p className="mb-3 text-gray-800">
          If you purchase marketing or business services through our Store, we may
          share relevant information with the marketing partner company to fulfill
          the service. This may include:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
          <li>Name and contact details</li>
          <li>Business information</li>
          <li>Campaign requirements</li>
          <li>Necessary platform access details</li>
        </ul>
        <p className="text-gray-800 mb-6">
          In many cases the marketing partner acts as an independent business
          responsible for its own service delivery and may process your
          information under its own privacy practices. Where required, we will
          provide additional notices during checkout or within the service flow.
        </p>

        <h3 className="text-xl font-semibold mb-3">
          6.4 Legal, safety, and security
        </h3>
        <p className="mb-3 text-gray-800">
          We may share information if we believe it is reasonably necessary to:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
          <li>Comply with applicable laws, regulations, or legal process</li>
          <li>Respond to lawful requests from public authorities</li>
          <li>
            Protect the rights, safety, and security of users, the public, or the
            Platform
          </li>
          <li>
            Investigate fraud, abuse, security incidents, or violations of our
            terms
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">6.5 Business transfers</h3>
        <p className="text-gray-800 mb-6">
          If Companies Center is involved in a merger, acquisition,
          reorganization, financing, or sale of assets, personal information may
          be transferred as part of that transaction. We will require the
          recipient to honor this Privacy Policy or provide notice of any changes.
        </p>

        <h3 className="text-xl font-semibold mb-3">
          6.6 We do not sell your personal information
        </h3>
        <p className="text-gray-800">
          We do not sell your personal information for money, and we do not share
          it for cross-context behavioral advertising. If this ever changes, we
          will update this Policy and provide any opt-out the law requires.
        </p>
      </section>

      <hr className="my-8" />

      {/* Section 7 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          7. Notifications and communications
        </h2>
        <p className="mb-3 text-gray-800">
          We may send you different types of messages, and you control most of
          them:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
          <li>
            <strong>Service and transactional messages</strong> (for example,
            security alerts, booking updates, and important policy changes). These
            are part of the service and are generally not optional while you have
            an account.
          </li>
          <li>
            <strong>Push notifications</strong> — you can turn these off in your
            device settings or within the app.
          </li>
          <li>
            <strong>Optional updates</strong> — you can opt out of non-essential
            messages using the controls provided or by contacting us.
          </li>
        </ul>
      </section>

      <hr className="my-8" />

      {/* Section 8 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          8. Your content, public areas, and license
        </h2>
        <p className="text-gray-800 mb-4">
          You retain ownership of the content you upload to the Platform.
        </p>
        <p className="text-gray-800 mb-4">
          By uploading content, you grant Companies Center a non-exclusive,
          worldwide, royalty-free, sublicensable license to host, store,
          reproduce, display, and distribute that content as necessary to
          operate, improve, secure, and promote the Platform, including moderation
          and enforcement.
        </p>
        <p className="text-gray-800">
          Do not post content you consider private in public areas, and do not
          post other people&apos;s personal information without their consent.
        </p>
      </section>

      <hr className="my-8" />

      {/* Section 9 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">9. Data security</h2>
        <p className="mb-3 text-gray-800">
          We use reasonable administrative, technical, and organizational
          safeguards designed to protect personal information — for example,
          encryption of passwords, access controls, and transport encryption
          (HTTPS) for data in transit. However, no method of transmission or
          storage is completely secure, and we cannot guarantee absolute
          security.
        </p>
        <p className="text-gray-800">
          You play an important role too: keep your login credentials
          confidential, use a strong password, and contact us promptly if you
          believe your account has been compromised.
        </p>
      </section>

      <hr className="my-8" />

      {/* Section 10 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">10. Data retention</h2>
        <p className="mb-3 text-gray-800">
          We keep personal information only for as long as reasonably necessary
          for the purposes described in this Policy, which generally means:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
          <li>
            <strong>Account information</strong> — while your account is active,
            and for a limited period afterward
          </li>
          <li>
            <strong>Marketplace records</strong> (bookings, transactions,
            reviews) — as needed to provide history, resolve disputes, and meet
            legal, tax, and accounting obligations
          </li>
          <li>
            <strong>Support and safety records</strong> — as needed to handle
            disputes and prevent abuse
          </li>
          <li>
            <strong>Logs and diagnostics</strong> — for a shorter period, unless
            needed for security or legal reasons
          </li>
        </ul>
        <p className="text-gray-800">
          When information is no longer needed, we delete it or de-identify it.
          Some information may remain in secure backups for a limited period after
          deletion before it is overwritten.
        </p>
      </section>

      <hr className="my-8" />

      {/* Section 11 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          11. Your privacy rights and choices
        </h2>
        <p className="mb-4 text-gray-800">
          Depending on where you live, you may have some or all of the following
          rights. We provide the core choices below to everyone.
        </p>

        <h3 className="text-xl font-semibold mb-3">11.1 Choices for everyone</h3>
        <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
          <li>
            <strong>Access and update</strong> — view and edit much of your
            profile information directly in the app
          </li>
          <li>
            <strong>Deactivate your account</strong> — a reversible pause. Your
            profile is hidden and you are signed out; sign back in anytime to
            restore it
          </li>
          <li>
            <strong>Delete your account</strong> — request permanent deletion in
            the mobile app under Settings, or on the web at{" "}
            <a
              href="/settings/account-control/deletion"
              className="text-blue-600 hover:underline"
            >
              companiescenter.com/settings/account-control/deletion
            </a>
            . For your security, deletion asks you to confirm your password.
            Deletion is scheduled with a <strong>30-day grace period</strong> —
            during those 30 days you can cancel by signing back in. After the
            grace period, a scheduled process permanently deletes or anonymizes
            your personal information (for example, your name, email, phone,
            profile photo, and login credentials), subject to the retention
            exceptions in Section 10. Content you shared publicly or with other
            users (such as reviews) may remain in de-identified form
          </li>
          <li>
            <strong>Location and permissions</strong> — control location, camera,
            microphone, photos, and notifications in your device settings
          </li>
          <li>
            <strong>Communications</strong> — opt out of non-essential messages
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">
          11.2 United States — California residents (CCPA/CPRA)
        </h3>
        <p className="mb-3 text-gray-800">
          If you are a California resident, you may have the right to know the
          categories and specific pieces of personal information we collect,
          request access to or deletion of your personal information, correct
          inaccurate information, and not be discriminated against for exercising
          your rights. Because we do not sell your personal information or share
          it for cross-context behavioral advertising, no opt-out of
          &apos;sale&apos; or &apos;sharing&apos; is required, but you may still
          contact us with any request.
        </p>

        <h3 className="text-xl font-semibold mb-3">
          11.3 EEA, UK, and similar regions (GDPR)
        </h3>
        <p className="mb-3 text-gray-800">
          If you are in the European Economic Area, the United Kingdom, or a
          region with similar laws, you may have the right to access, correct,
          delete, restrict, or object to certain processing, and to data
          portability. You can also withdraw consent where processing is based on
          consent (such as location), and lodge a complaint with your local data
          protection authority.
        </p>
        <p className="mb-3 text-gray-800">
          Where required, we rely on the following legal bases to process your
          information:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
          <li>
            <strong>Performance of a contract</strong> — to provide the Platform
            and the services you request
          </li>
          <li>
            <strong>Legitimate interests</strong> — to secure, improve, and
            operate the Platform, balanced against your rights
          </li>
          <li>
            <strong>Consent</strong> — for optional features such as precise
            location and certain communications
          </li>
          <li>
            <strong>Legal obligation</strong> — to comply with applicable laws
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">
          11.4 How to exercise your rights
        </h3>
        <p className="mb-3 text-gray-800">
          To make a request, use the in-app controls or contact us with the
          details in Section 17. We may need to verify your identity before acting
          on a request, and we may decline requests where an exception applies
          (for example, to keep records the law requires us to retain). We aim to
          respond to verified requests within a reasonable time, typically within{" "}
          <strong>30 days</strong>, unless a longer period is permitted by law or
          the request is complex. You may use an authorized agent where the law
          allows.
        </p>
      </section>

      <hr className="my-8" />

      {/* Section 12 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">12. Children&apos;s privacy</h2>
        <p className="text-gray-800">
          The Platform is <strong>not intended for children under 13</strong>, or{" "}
          <strong>under 16 where local law requires</strong>. We do not knowingly
          collect personal information from children. If you believe a child has
          provided us personal information, contact us and we will take steps to
          delete it.
        </p>
      </section>

      <hr className="my-8" />

      {/* Section 13 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          13. International data transfers
        </h2>
        <p className="text-gray-800">
          We are based in the United States, and your information may be
          processed and stored in the United States or other countries where we
          or our vendors operate. These countries may have data protection laws
          that differ from those in your country. Where required by law, we
          implement appropriate safeguards (such as standard contractual clauses)
          to protect international transfers of your information.
        </p>
      </section>

      <hr className="my-8" />

      {/* Section 14 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          14. Third-party links and services
        </h2>
        <p className="text-gray-800">
          The Platform may contain links to, or integrations with, third-party
          services (such as maps, payment processors, or a provider&apos;s own
          website). Their privacy practices are governed by their own policies,
          and we are not responsible for them. We encourage you to review the
          privacy policy of any third party before providing your information.
        </p>
      </section>

      <hr className="my-8" />

      {/* Section 15 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">15. Changes to this policy</h2>
        <p className="mb-3 text-gray-800">
          We may update this Privacy Policy from time to time. When we make
          material changes, we will update the &apos;Effective Date&apos; above
          and provide notice through the Platform or other appropriate means. Your
          continued use of the Platform after an update means you accept the
          revised Policy.
        </p>
      </section>

      <hr className="my-8" />

      {/* Section 16 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">16. Contact us</h2>
        <p className="mb-3 text-gray-800">
          If you have questions about this Privacy Policy or want to exercise your
          rights, contact us:
        </p>
        <div className="text-gray-800 space-y-2">
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@companiescenter.com">
              support@companiescenter.com
            </a>
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            <a href="tel:+18138971727">+1 (813) 897-1727</a>
          </p>
          <p>
            <strong>Support:</strong>{" "}
            <a href="/contact">companiescenter.com/contact</a>
          </p>
          <p>
            <strong>Address:</strong>
          </p>
          <p>30190 US Highway 19N #1064</p>
          <p>Clearwater, Florida 33761</p>
          <p>United States</p>
        </div>
      </section>
    </LegalLayout>
  );
}
