import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CompaniesCenter",
  description: "Read our Privacy Policy to understand how we handle your data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white px-4 py-8 md:mt-20 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">PRIVACY POLICY</h1>
        <p className="text-gray-600 mb-8">
          <strong>Effective Date:</strong> February 5, 2026
        </p>

        <p className="mb-4 text-gray-800">
          Welcome to <strong>Companies Center</strong> (&apos;Companies
          Center&apos;, &apos;we&apos;, &apos;us&apos;, or &apos;our&apos;).
          This Privacy Policy explains how we collect, use, share, and protect
          information when you use our website, mobile application, and related
          services (collectively, the <strong>&apos;Platform&apos;</strong>).
        </p>

        <p className="mb-4 text-gray-800">
          By accessing or using the Platform, you agree to this Privacy Policy.
        </p>

        <hr className="my-8" />

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. WHO WE ARE</h2>
          <p className="text-gray-800 mb-3">
            Companies Center is a company based in Florida, United States.
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
              related technical services, including marketing services delivered
              by third-party partner companies.
            </li>
          </ol>

          <p className="text-gray-800">
            <strong>Important:</strong> Companies Center does not provide home
            or local services (such as plumbing or cleaning) directly and is
            generally <strong>not a party to agreements</strong> between Clients
            and Service Providers, unless expressly stated for a specific Store
            offering.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. SCOPE</h2>
          <p className="text-gray-800">
            This Privacy Policy applies to users worldwide. If local privacy
            laws require additional disclosures or rights, we will comply as
            required for applicable users.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. INFORMATION WE COLLECT</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            3.1 Information You Provide
          </h3>
          <p className="mb-3 text-gray-800">
            We may collect information you provide, including:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
            <li>Name, email address, phone number</li>
            <li>Account type and role (Client, Service Provider, or other)</li>
            <li>
              Profile information, business details, service categories,
              descriptions, service area, availability
            </li>
            <li>
              Job requests, offers, bookings, and transaction-related details
              within the Platform
            </li>
            <li>
              Messages and communications through in-app chat or support
              channels
            </li>
            <li>Reviews, ratings, reports, and feedback</li>
            <li>
              Content you upload (photos, videos, reels, text, listings,
              documents)
            </li>
            <li>
              Communications with us (support tickets, disputes, inquiries)
            </li>
          </ul>

          <hr className="my-4" />

          <h3 className="text-xl font-semibold mb-3">
            3.2 Information Collected Automatically
          </h3>
          <p className="mb-3 text-gray-800">We may automatically collect:</p>
          <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
            <li>
              Device type, operating system, app version, and language settings
            </li>
            <li>IP address, browser type, log data, and crash diagnostics</li>
            <li>
              Usage and interaction data (searches, clicks, pages viewed,
              features used)
            </li>
            <li>Approximate location derived from IP address</li>
          </ul>

          <hr className="my-4" />

          <h3 className="text-xl font-semibold mb-3">
            3.3 Location Data (Optional, With Permission)
          </h3>
          <p className="mb-3 text-gray-800">
            If you grant permission, we may collect precise and/or approximate
            location data to:
          </p>
          <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
            <li>Display nearby providers and improve map and search results</li>
            <li>Improve relevance and recommendations</li>
            <li>Support security, fraud prevention, and misuse detection</li>
          </ul>
          <p className="text-gray-800 mb-6">
            You can disable location access at any time through your device
            settings. Some features may not function properly without location
            access.
          </p>

          <hr className="my-4" />

          <h3 className="text-xl font-semibold mb-3">
            3.4 Payments and Purchases
          </h3>
          <p className="mb-3 text-gray-800">
            If you purchase a membership or Store services, payments are
            processed by third-party payment processors (such as Chase or other
            providers available at checkout).
          </p>
          <p className="mb-3 text-gray-800">
            We typically receive limited transaction information, such as:
          </p>
          <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
            <li>Payment status (successful or failed), date, and time</li>
            <li>Amount, currency, and invoice or receipt details</li>
            <li>
              Limited payment metadata (for example, the last four digits of a
              card or a payment token), depending on the processor
            </li>
          </ul>
          <p className="text-gray-800">
            We do <strong>not</strong> intentionally store full payment card
            numbers on our servers.
          </p>

          <hr className="my-4" />

          <h3 className="text-xl font-semibold mb-3">
            3.5 Cookies and Similar Technologies
          </h3>
          <p className="mb-3 text-gray-800">
            On our website, we may use cookies and similar technologies for:
          </p>
          <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
            <li>Security and fraud prevention</li>
            <li>Site functionality</li>
            <li>Analytics and performance measurement</li>
            <li>Limited marketing attribution related to our own services</li>
          </ul>
          <p className="mb-3 text-gray-800">
            We do <strong>not</strong> use cookies or similar technologies to
            track users across third-party websites or applications for targeted
            advertising.
          </p>
          <p className="text-gray-800">
            You can control cookies through your browser settings, but some
            features may not function properly.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. HOW WE USE INFORMATION</h2>
          <p className="mb-4 text-gray-800">We use information to:</p>
          <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
            <li>Provide, operate, and improve the Platform and Store</li>
            <li>Create and manage user accounts and profiles</li>
            <li>Enable search, discovery, matching, and communications</li>
            <li>Facilitate purchases, memberships, and access to services</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>
              Send operational messages (such as security alerts, policy
              updates, and service notices)
            </li>
            <li>
              Monitor, enforce, and maintain Platform integrity, including fraud
              prevention and abuse detection
            </li>
            <li>Conduct analytics, debugging, and product improvement</li>
            <li>
              Comply with legal obligations and respond to lawful requests
            </li>
          </ul>
          <p className="text-gray-800">
            <strong>
              We do not use personal information to track users across apps or
              websites owned by other companies for advertising purposes.
            </strong>
          </p>
        </section>

        <hr className="my-8" />

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            5. AI AND AUTOMATED FEATURES
          </h2>
          <p className="mb-4 text-gray-800">
            The Platform may include AI-enabled features such as assistance
            tools, recommendations, or automated responses.
          </p>
          <p className="mb-3 text-gray-800">You understand and agree that:</p>
          <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
            <li>AI outputs may be inaccurate, incomplete, or inappropriate</li>
            <li>
              You should use your own judgment before relying on AI-generated
              outputs
            </li>
            <li>
              We may process user inputs to provide features, protect the
              Platform, and improve performance
            </li>
          </ul>
        </section>

        <hr className="my-8" />

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            6. HOW WE SHARE INFORMATION
          </h2>
          <p className="mb-4 text-gray-800">
            We do <strong>not</strong> sell personal information.
          </p>
          <p className="mb-6 text-gray-800">
            We may share information as follows:
          </p>

          <h3 className="text-xl font-semibold mb-3">
            6.1 Sharing With Other Users
          </h3>
          <p className="mb-3 text-gray-800">
            Certain information is visible to other users as part of normal
            Platform use, including:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
            <li>
              Provider profiles, service listings, and public profile elements
            </li>
            <li>Reviews, ratings, and feedback</li>
            <li>Content you post in public areas</li>
          </ul>
          <p className="text-gray-800 mb-6">
            Visibility depends on your account settings and how you use the
            Platform.
          </p>

          <h3 className="text-xl font-semibold mb-3">
            6.2 Vendors and Service Providers
          </h3>
          <p className="mb-3 text-gray-800">
            We may share information with trusted vendors who help operate the
            Platform (such as hosting providers, analytics services, messaging
            services, customer support tools, and security providers).
          </p>
          <p className="text-gray-800 mb-6">
            These vendors may only use information to provide services to us and
            are required to follow contractual safeguards.
          </p>

          <h3 className="text-xl font-semibold mb-3">
            6.3 Marketing Partner Companies (Store Purchases)
          </h3>
          <p className="mb-3 text-gray-800">
            If you purchase marketing or business services through our Store, we
            may share relevant information with the marketing partner company to
            fulfill the service. This may include:
          </p>
          <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
            <li>Name and contact details</li>
            <li>Business information</li>
            <li>Campaign requirements</li>
            <li>Necessary platform access details</li>
          </ul>
          <p className="text-gray-800 mb-6">
            In many cases, the marketing partner acts as an independent business
            responsible for its own service delivery and may process your
            information under its own privacy practices. Where required, we will
            provide additional notices during checkout or within the service
            flow.
          </p>

          <h3 className="text-xl font-semibold mb-3">
            6.4 Legal, Safety, and Security
          </h3>
          <p className="mb-3 text-gray-800">
            We may share information if necessary to:
          </p>
          <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
            <li>
              Comply with applicable laws, regulations, or legal processes
            </li>
            <li>Respond to lawful requests from authorities</li>
            <li>
              Protect the rights, safety, and security of users, the Platform,
              or the public
            </li>
            <li>
              Investigate fraud, abuse, security incidents, or policy violations
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">6.5 Business Transfers</h3>
          <p className="text-gray-800">
            If Companies Center is involved in a merger, acquisition,
            reorganization, or sale of assets, personal information may be
            transferred as part of that transaction.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            7. USER CONTENT, PUBLIC AREAS, AND LICENSE
          </h2>
          <p className="text-gray-800 mb-4">
            You retain ownership of content you upload to the Platform.
          </p>
          <p className="text-gray-800 mb-4">
            By uploading content, you grant Companies Center a non-exclusive,
            worldwide, royalty-free, sublicensable license to host, store,
            reproduce, display, and distribute that content as necessary to
            operate, improve, secure, and promote the Platform, including
            moderation and enforcement.
          </p>
          <p className="text-gray-800">
            Do not post content you consider private in public areas.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section 8 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. DATA SECURITY</h2>
          <p className="mb-3 text-gray-800">
            We use reasonable administrative, technical, and organizational
            safeguards designed to protect personal information. However, no
            system is completely secure. You are responsible for keeping your
            login credentials confidential.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section 9 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. DATA RETENTION</h2>
          <p className="mb-3 text-gray-800">
            We retain personal information for as long as reasonably necessary
            to:
          </p>
          <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
            <li>Provide and maintain the Platform and services</li>
            <li>Ensure security and prevent abuse</li>
            <li>Resolve disputes and enforce agreements</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p className="text-gray-800">
            Retention periods vary depending on the type of data and purpose.
            Some information may remain in backups for a limited period after
            deletion.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section 10 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            10. YOUR RIGHTS AND CHOICES
          </h2>
          <p className="mb-4 text-gray-800">
            Depending on where you live, you may have the right to:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
            <li>Access and obtain a copy of certain personal information</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>
              Request deletion of personal information (subject to legal
              exceptions)
            </li>
            <li>Withdraw consent where processing is based on consent</li>
            <li>Opt out of certain communications</li>
          </ul>

          <p className="mb-3 text-gray-800">
            To exercise your rights, contact us using the details below. We may
            verify your identity before processing requests.
          </p>
          <p className="text-gray-800">
            We aim to respond to verified requests within a reasonable
            timeframe, typically within <strong>30 days</strong>, unless a
            longer period is required by law or due to request complexity.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section 11 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            11. CHILDREN&apos;S PRIVACY
          </h2>
          <p className="text-gray-800">
            The Platform is{" "}
            <strong>not intended for children under the age of 13</strong>, or{" "}
            <strong>under 16 where local law requires</strong>.
          </p>
          <p className="text-gray-800 mt-3">
            We do not knowingly collect personal information from children. If
            we become aware that we have collected such information, we will
            delete it.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section 12 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            12. INTERNATIONAL DATA TRANSFERS
          </h2>
          <p className="mb-3 text-gray-800">
            Your information may be processed and stored in countries outside
            your country of residence. Where required by applicable law, we
            implement appropriate safeguards to protect international data
            transfers.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section 13 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            13. THIRD-PARTY LINKS AND SERVICES
          </h2>
          <p className="text-gray-800">
            The Platform may contain links to or integrations with third-party
            services. Their privacy practices are governed by their own privacy
            policies, and we are not responsible for their practices.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section 14 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">14. CONTACT US</h2>
          <div className="text-gray-800 space-y-2">
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:companiescentereu@gmail.com"
                className="text-blue-600 hover:underline"
              >
                companiescentereu@gmail.com
              </a>
            </p>
            <p>
              <strong>Address:</strong>
            </p>
            <p>30190 US Highway 19N #1064</p>
            <p>Clearwater, Florida 33761</p>
            <p>United States</p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href="https://companiescenter.com"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://companiescenter.com
              </a>
            </p>
          </div>
        </section>

        <hr className="my-8" />

        {/* Section 15 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            15. UPDATES TO THIS POLICY
          </h2>
          <p className="mb-3 text-gray-800">
            We may update this Privacy Policy from time to time. If changes are
            material, we will provide notice through the Platform or other
            appropriate means.
          </p>
          <p className="text-gray-800">
            Continued use of the Platform after updates means you accept the
            revised Privacy Policy.
          </p>
        </section>
      </div>
    </div>
  );
}
