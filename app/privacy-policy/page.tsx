import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CompaniesCenter",
  description: "Read our Privacy Policy to understand how we handle your data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">PRIVACY POLICY</h1>
        <p className="text-gray-600 mb-8">
          <strong>Last Updated:</strong> January 25, 2026
        </p>

        <p className="mb-6 text-gray-800">
          Welcome to <strong>CompaniesCenter</strong> (&quot;we&quot;,
          &quot;our&quot;, or &quot;us&quot;). This Privacy Policy explains how
          we collect, use, disclose, and protect your information when you use
          our mobile application, website, and related services (collectively,
          the <strong>&quot;Platform&quot;</strong>).
        </p>

        <p className="mb-8 text-gray-800">
          By accessing or using <strong>CompaniesCenter</strong>, you agree to
          the practices described in this Privacy Policy.
        </p>

        <hr className="my-8" />

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. ABOUT THE PLATFORM</h2>
          <p className="text-gray-800">
            <strong>CompaniesCenter</strong> is a digital marketplace that
            connects individuals and businesses (&quot;Service Providers&quot;)
            with customers (&quot;Clients&quot;) seeking local services. We do
            not directly provide services listed on the Platform.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. INFORMATION WE COLLECT</h2>
          <p className="mb-4 text-gray-800">
            We collect information in the following categories:
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            2.1 Information You Provide Directly
          </h3>
          <p className="mb-3 text-gray-800">
            When you create an account or use the Platform, you may provide:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Profile photo</li>
            <li>Account type (Client or Service Provider)</li>
            <li>Business or service information (for providers)</li>
            <li>Job requests, offers, and service descriptions</li>
            <li>Messages sent through in-app chat</li>
            <li>Images, videos, reels, and other content you upload</li>
            <li>Reviews, ratings, and feedback</li>
            <li>Support requests and communications</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            2.2 Automatically Collected Information
          </h3>
          <p className="mb-3 text-gray-800">
            When you use the Platform, we automatically collect certain
            information, including:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
            <li>Device type, manufacturer, and operating system</li>
            <li>App version and usage activity</li>
            <li>IP address</li>
            <li>Log files and crash diagnostics</li>
            <li>Approximate location derived from IP</li>
            <li>Unique device or app identifiers</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            2.3 Location Information
          </h3>
          <p className="text-gray-800">
            With your permission, we may collect{" "}
            <strong>precise or approximate location data</strong> to:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
            <li>Show nearby service providers or clients</li>
            <li>Improve search relevance</li>
            <li>Prevent fraud and abuse</li>
            <li>Enhance platform functionality</li>
          </ul>
          <p className="text-gray-800 mb-6">
            You can disable location access through your device settings. Some
            features may not function properly if location access is disabled.
          </p>

          <h3 className="text-xl font-semibold mb-3">
            2.4 User-Generated Content
          </h3>
          <p className="text-gray-800">
            Any content you submit to the Platform (including text, images,
            videos, or messages) may be visible to other users depending on how
            the Platform is used.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            3. HOW WE USE YOUR INFORMATION
          </h2>
          <p className="mb-3 text-gray-800">We use collected information to:</p>
          <ul className="list-disc list-inside text-gray-800 space-y-2">
            <li>Create and manage user accounts</li>
            <li>Operate and maintain the Platform</li>
            <li>Match clients with service providers</li>
            <li>Enable communication between users</li>
            <li>Display location-based and relevant content</li>
            <li>Moderate content and enforce platform rules</li>
            <li>Detect and prevent fraud, spam, and abuse</li>
            <li>Improve features, performance, and user experience</li>
            <li>Send service-related notifications</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            4. LEGAL BASIS FOR PROCESSING (WHERE APPLICABLE)
          </h2>
          <p className="mb-3 text-gray-800">
            We process personal data based on:
          </p>
          <ul className="list-disc list-inside text-gray-800 space-y-2">
            <li>Your consent</li>
            <li>Performance of a contract (providing platform services)</li>
            <li>Legitimate business interests</li>
            <li>Compliance with legal obligations</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            5. CONTENT OWNERSHIP & LICENSE
          </h2>
          <p className="text-gray-800 mb-4">
            You retain ownership of content you upload to the Platform.
          </p>
          <p className="text-gray-800">
            By uploading content, you grant <strong>CompaniesCenter</strong> a{" "}
            <strong>
              non-exclusive, worldwide, royalty-free, transferable license
            </strong>{" "}
            to use, store, display, reproduce, and distribute such content
            solely for the purpose of operating, improving, and promoting the
            Platform.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            6. DATA SHARING & DISCLOSURE
          </h2>
          <p className="mb-4 text-gray-800">
            We do <strong>not sell personal data</strong>.
          </p>
          <p className="mb-3 text-gray-800">We may share information:</p>
          <ul className="list-disc list-inside text-gray-800 space-y-2">
            <li>With other users, as required for platform functionality</li>
            <li>
              With third-party service providers assisting with hosting,
              analytics, messaging, or customer support
            </li>
            <li>When required by law, court order, or legal process</li>
            <li>
              To protect the rights, safety, and security of users and the
              Platform
            </li>
            <li>In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. THIRD-PARTY SERVICES</h2>
          <p className="text-gray-800">
            The Platform may integrate third-party services (such as analytics,
            cloud storage, or messaging tools). These services operate under
            their own privacy policies, and we are not responsible for their
            practices.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. DATA SECURITY</h2>
          <p className="mb-3 text-gray-800">
            We implement reasonable technical and organizational safeguards to
            protect personal data, including:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
            <li>Secure storage systems</li>
            <li>Access controls</li>
            <li>Encrypted communications where appropriate</li>
          </ul>
          <p className="text-gray-800">
            However, no system is completely secure, and we cannot guarantee
            absolute security.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. DATA RETENTION</h2>
          <p className="mb-3 text-gray-800">
            We retain personal data only for as long as necessary to:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
            <li>Provide the Platform</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce our agreements</li>
          </ul>
          <p className="text-gray-800">
            Inactive or deleted accounts may have data retained for a limited
            period as required by law or legitimate business needs.
          </p>
        </section>

        {/* Section 10 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            10. DATA DELETION & USER RIGHTS
          </h2>
          <p className="mb-4 text-gray-800">You have the right to:</p>
          <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your account and personal data</li>
            <li>Withdraw consent where applicable</li>
          </ul>
          <p className="mb-3 text-gray-800">
            To request account or data deletion, contact us at:
          </p>
          <p className="text-gray-800 mb-4">
            📧 <strong>companiexcentereu@gmail.com</strong>
          </p>
          <p className="text-gray-800">
            Requests are processed within a reasonable timeframe, subject to
            legal requirements.
          </p>
        </section>

        {/* Section 11 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            11. CHILDREN&apos;S PRIVACY
          </h2>
          <p className="text-gray-800">
            The Platform is{" "}
            <strong>not intended for children under the age of 13</strong>. We
            do not knowingly collect personal data from children. If such data
            is discovered, it will be deleted promptly.
          </p>
        </section>

        {/* Section 12 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            12. INTERNATIONAL DATA TRANSFERS
          </h2>
          <p className="text-gray-800">
            Your information may be processed and stored on servers located
            outside your country. By using the Platform, you consent to such
            transfers in accordance with this Privacy Policy.
          </p>
        </section>

        {/* Section 13 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            13. CHANGES TO THIS POLICY
          </h2>
          <p className="mb-3 text-gray-800">
            We may update this Privacy Policy from time to time. Material
            changes will be communicated through the Platform or other
            appropriate means.
          </p>
          <p className="text-gray-800">
            Continued use of the Platform after updates constitutes acceptance
            of the revised policy.
          </p>
        </section>

        {/* Section 14 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">14. CONTACT INFORMATION</h2>
          <p className="mb-3 text-gray-800">
            If you have questions or concerns about this Privacy Policy, contact
            us at:
          </p>
          <div className="text-gray-800 space-y-2">
            <p>
              📧 <strong>Email:</strong> companiexcentereu@gmail.com
            </p>
            <p>
              🌐 <strong>Website:</strong> www.companiescenter.com
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
