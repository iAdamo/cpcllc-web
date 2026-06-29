import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Companies Center LLC",
  description:
    "Read our comprehensive Terms and Conditions to understand the rules and policies governing the use of our platform.",
  keywords: "terms, conditions, legal, policy",
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white px-4 lg:px-0 mt-16 lg:mt-20 py-8">
      <div className="max-w-4xl mx-auto px-4 py-8 md:mt-20 md:py-12">
        {/* Header */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            COMPANIESCENTER LLC — TERMS OF SERVICE
          </h1>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Effective Date:</strong> February 5, 2026
          </p>
          <p className="text-gray-600">
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
        </section>

        {/* Introduction */}
        <section className="mb-8 space-y-4">
          <p className="text-gray-800">
            These Terms of Service (&quot;Terms&quot;) govern your access to and
            use of the Companies Center website, mobile applications, and
            related services (collectively, the &quot;Platform&quot;).
          </p>
          <p className="text-gray-800">
            These Terms form a <strong>legally binding agreement</strong>{" "}
            between you and <strong>Companies Center</strong> (&quot;Companies
            Center,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
          </p>
          <p className="text-gray-800 font-bold">
            If you do not agree to these Terms, do not access or use the
            Platform.
          </p>
        </section>

        {/* Section 1 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            1. COMPANY INFORMATION
          </h2>
          <div className="space-y-2">
            <p className="text-gray-800 font-bold">Companies Center</p>
            <p className="text-gray-800">30190 US Highway 19N #1064</p>
            <p className="text-gray-800">Clearwater, Florida 33761</p>
            <p className="text-gray-800">United States</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-800">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:companiescentereu@gmail.com"
                className="text-blue-600 hover:underline"
              >
                companiescentereu@gmail.com
              </a>
            </p>
            <p className="text-gray-800">
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

        {/* Section 2 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">2. DEFINITIONS</h2>
          <ul className="pl-4 space-y-2">
            <li className="text-gray-800">
              <strong>&quot;Client&quot;:</strong> A user seeking services.
            </li>
            <li className="text-gray-800">
              <strong>&quot;Service Provider&quot;:</strong> An individual or
              business offering services through the Platform (including
              dayworkers).
            </li>
            <li className="text-gray-800">
              <strong>&quot;Store Services&quot;:</strong> Digital, technical,
              or business services sold through the Platform&apos;s Store.
            </li>
            <li className="text-gray-800">
              <strong>&quot;Partner&quot;:</strong> A third-party company that
              may fulfill certain Store Services (for example, marketing
              services).
            </li>
            <li className="text-gray-800">
              <strong>&quot;Content&quot;:</strong> Any text, images, videos,
              listings, messages, reviews, ratings, posts, or other materials
              submitted or displayed on the Platform.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            3. WHAT COMPANIES CENTER IS (AND IS NOT)
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                3.1 Marketplace Technology Platform Only
              </h3>
              <p className="text-gray-800 mb-2">
                Companies Center is a <strong>technology platform</strong> that
                facilitates discovery and communication between users.
              </p>
              <p className="text-gray-800 mb-2">
                We do <strong>not</strong>:
              </p>
              <ul className="pl-4 space-y-2">
                <li className="text-gray-800">
                  • Provide home or local services directly
                </li>
                <li className="text-gray-800">
                  • Supervise, direct, or control how services are performed
                </li>
                <li className="text-gray-800">
                  • Process payments between Clients and Service Providers for
                  local service jobs
                </li>
              </ul>
              <p className="text-gray-800 mt-2">
                Unless expressly stated otherwise,{" "}
                <strong>
                  Clients and Service Providers contract and transact
                  independently
                </strong>
                .
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                3.2 Not a Party to User Agreements
              </h3>
              <p className="text-gray-800">
                Companies Center is generally <strong>not a party</strong> to
                agreements between Clients and Service Providers and is not
                responsible for the performance, quality, safety, legality, or
                outcomes of services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                3.3 No Employment or Agency Relationship
              </h3>
              <p className="text-gray-800 mb-2">
                Service Providers (including dayworkers) are{" "}
                <strong>independent third parties</strong>, not employees,
                agents, partners, or representatives of Companies Center.
              </p>
              <p className="text-gray-800">
                Nothing in these Terms creates an employment, agency,
                partnership, or joint venture relationship.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                3.4 Store Services (Including Partner Fulfillment)
              </h3>
              <p className="text-gray-800 mb-2">
                Companies Center may sell Store Services that are fulfilled by:
              </p>
              <ul className="pl-4 space-y-1">
                <li className="text-gray-800">• Companies Center,</li>
                <li className="text-gray-800">
                  • independent contractors, and/or
                </li>
                <li className="text-gray-800">
                  • Partner companies (for example, marketing providers).
                </li>
              </ul>
              <p className="text-gray-800 mt-2">
                Where a Partner fulfills services, the Partner is responsible
                for service delivery, subject to any express written terms shown
                at checkout or in a service addendum.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">4. ELIGIBILITY</h2>
          <p className="text-gray-800">
            You must be at least <strong>18 years old</strong> (or the age of
            legal majority in your jurisdiction) to use the Platform.
          </p>
          <p className="text-gray-800">
            By using the Platform, you represent and warrant that you meet this
            requirement.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            5. ACCOUNT REGISTRATION AND SECURITY
          </h2>
          <p className="text-gray-800">You agree to:</p>
          <ul className="pl-4 space-y-2">
            <li className="text-gray-800">
              • Provide accurate and complete information
            </li>
            <li className="text-gray-800">
              • Keep your account information up to date
            </li>
            <li className="text-gray-800">
              • Safeguard your login credentials
            </li>
          </ul>
          <p className="text-gray-800">
            You are responsible for all activity under your account. Notify us
            promptly if you suspect unauthorized access.
          </p>
          <p className="text-gray-800">
            We may suspend or terminate accounts for fraud, misuse, or
            violations of these Terms.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            6. USER CONDUCT AND SAFETY RULES
          </h2>
          <p className="text-gray-800">
            You agree <strong>not</strong> to:
          </p>
          <ul className="pl-4 space-y-2">
            <li className="text-gray-800">• Violate any law or regulation</li>
            <li className="text-gray-800">
              • Harass, threaten, discriminate, stalk, or abuse others
            </li>
            <li className="text-gray-800">
              • Engage in violence, theft, fraud, or animal cruelty
            </li>
            <li className="text-gray-800">
              • Post false, misleading, or deceptive information
            </li>
            <li className="text-gray-800">
              • Manipulate reviews or impersonate others
            </li>
            <li className="text-gray-800">
              • Infringe intellectual property or privacy rights
            </li>
            <li className="text-gray-800">
              • Hack, scrape, reverse engineer, or disrupt the Platform
            </li>
            <li className="text-gray-800">
              • Transmit spam, malware, or harmful code
            </li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-gray-800 font-bold">Emergency Notice:</p>
            <p className="text-gray-800">
              If you are in immediate danger or a crime occurs, contact local
              emergency services. Companies Center is <strong>not</strong> an
              emergency service.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            7. LISTINGS, REVIEWS, AND RATINGS
          </h2>
          <ul className="pl-4 space-y-2">
            <li className="text-gray-800">
              • Reviews and ratings must reflect genuine experiences
            </li>
            <li className="text-gray-800">
              • We may remove Content that is fake, abusive, misleading, or
              policy-violating
            </li>
            <li className="text-gray-800">
              • We do not guarantee the accuracy, completeness, or reliability
              of listings or reviews
            </li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            8. VERIFICATION, LICENSES, AND INSURANCE (NO GUARANTEE)
          </h2>
          <p className="text-gray-800">
            Companies Center may offer optional verification features. However,
            we do <strong>not</strong> guarantee that any Service Provider:
          </p>
          <ul className="pl-4 space-y-2">
            <li className="text-gray-800">
              • Is licensed, insured, bonded, qualified, or safe
            </li>
            <li className="text-gray-800">• Has passed background checks</li>
            <li className="text-gray-800">
              • Will deliver professional or satisfactory results
            </li>
          </ul>
          <p className="text-gray-800">
            Clients are solely responsible for evaluating providers.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            9. ASSUMPTION OF RISK AND RELEASE
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                9.1 Assumption of Risk
              </h3>
              <p className="text-gray-800 mb-2">
                Using a marketplace involves inherent risks, including personal
                injury, property damage, theft, disputes, poor workmanship, and
                third-party incidents.
              </p>
              <p className="text-gray-800">
                You voluntarily assume <strong>all risks</strong> arising from
                interactions with other users and services performed by third
                parties.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-2">9.2 Release</h3>
              <p className="text-gray-800 mb-2">
                To the maximum extent permitted by law, you release Companies
                Center from claims arising out of or related to:
              </p>
              <ul className="pl-4 space-y-2">
                <li className="text-gray-800">
                  • Services performed or not performed by Service Providers
                </li>
                <li className="text-gray-800">
                  • Interactions between users (online or offline)
                </li>
                <li className="text-gray-800">
                  • Acts or omissions of Partners or other third parties
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 10 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            10. PAYMENTS, BILLING, AND STORE PURCHASES
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                10.1 Marketplace Payments
              </h3>
              <p className="text-gray-800">
                Companies Center does <strong>not</strong> process payments
                between Clients and Service Providers for local service jobs.
                Payment disputes are the responsibility of those parties.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                10.2 Store Payments
              </h3>
              <p className="text-gray-800">
                Store purchases are paid to Companies Center and processed
                through third-party payment processors. You agree to the
                processor&apos;s terms in addition to these Terms.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                10.3 Subscriptions and Memberships
              </h3>
              <p className="text-gray-800 mb-2">
                If you purchase a subscription:
              </p>
              <ul className="pl-4 space-y-2">
                <li className="text-gray-800">
                  • You authorize recurring charges until canceled
                </li>
                <li className="text-gray-800">
                  • Fees are generally non-refundable, except as required by law
                  or expressly stated
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-2">10.4 Taxes</h3>
              <p className="text-gray-800">
                You are responsible for applicable taxes unless otherwise
                required by law.
              </p>
            </div>
          </div>
        </section>

        {/* Section 11 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            11. STORE SERVICES: TECHNICAL VS. MARKETING FULFILLMENT
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                11.1 Technical Services
              </h3>
              <p className="text-gray-800">
                Technical services are governed by the scope, deliverables,
                timelines, and revision rules shown at checkout or in a written
                order.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                11.2 Marketing Services (Partner-Fulfilled)
              </h3>
              <p className="text-gray-800">
                Marketing services may be fulfilled by Partners. You
                acknowledge:
              </p>
              <ul className="pl-4 space-y-2">
                <li className="text-gray-800">
                  • Marketing results are not guaranteed
                </li>
                <li className="text-gray-800">
                  • Outcomes depend on multiple factors outside our control
                </li>
                <li className="text-gray-800">
                  • No promise of results is binding unless in a signed written
                  agreement
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 12 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            12. CANCELLATIONS AND REFUNDS
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                12.1 General Rule
              </h3>
              <p className="text-gray-800">
                All sales are final and non-refundable, except where required by
                law.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                12.2 Exceptional Cases
              </h3>
              <p className="text-gray-800 mb-2">
                We may, at our discretion, issue refunds or credits in limited
                cases (such as billing errors). Such decisions:
              </p>
              <ul className="pl-4 space-y-2">
                <li className="text-gray-800">• Are voluntary</li>
                <li className="text-gray-800">
                  • Do not establish future obligations
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 13 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">13. COMMUNICATIONS</h2>
          <p className="text-gray-800">
            You consent to receive communications electronically (email, in-app
            notifications). You are responsible for keeping contact details
            current.
          </p>
        </section>

        {/* Section 14 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            14. USER CONTENT AND LICENSE
          </h2>
          <p className="text-gray-800 mb-2">
            You retain ownership of your Content.
          </p>
          <p className="text-gray-800">
            By submitting Content, you grant Companies Center a worldwide,
            non-exclusive, royalty-free, sublicensable license to host, use,
            reproduce, display, and distribute Content to operate, secure, and
            improve the Platform.
          </p>
        </section>

        {/* Section 15 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            15. INTELLECTUAL PROPERTY
          </h2>
          <p className="text-gray-800">
            The Platform, software, branding, and trademarks are owned by
            Companies Center or its licensors. You may not use them without
            permission.
          </p>
        </section>

        {/* Section 16 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">16. TERMINATION</h2>
          <p className="text-gray-800">
            We may suspend or terminate access if you violate these Terms or
            create risk. You may stop using the Platform at any time.
          </p>
        </section>

        {/* Section 17 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            17. DISCLAIMER OF WARRANTIES
          </h2>
          <p className="text-gray-800">
            The Platform is provided <strong>&quot;AS IS&quot;</strong> and{" "}
            <strong>&quot;AS AVAILABLE.&quot;</strong> We disclaim all
            warranties to the maximum extent permitted by law.
          </p>
        </section>

        {/* Section 18 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            18. LIMITATION OF LIABILITY
          </h2>
          <p className="text-gray-800">
            To the maximum extent permitted by law:
          </p>

          <ul className="pl-4 space-y-2">
            <li className="text-gray-800">
              • We are not liable for indirect, incidental, consequential,
              special, or punitive damages
            </li>
            <li className="text-gray-800">
              • Our total liability will not exceed the greater of:
            </li>
            <li>
              <ul className="pl-8 space-y-1">
                <li className="text-gray-800">
                  - amounts you paid to Companies Center in the prior three (3)
                  months, or
                </li>
                <li className="text-gray-800">
                  - <strong>USD $100</strong>
                </li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Section 19 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">19. INDEMNIFICATION</h2>
          <p className="text-gray-800">
            You agree to indemnify and hold harmless Companies Center from
            claims arising from:
          </p>
          <ul className="pl-4 space-y-2">
            <li className="text-gray-800">• Your use of the Platform</li>
            <li className="text-gray-800">• Your Content</li>
            <li className="text-gray-800">
              • Your interactions with other users
            </li>
            <li className="text-gray-800">• Services you provide or receive</li>
            <li className="text-gray-800">
              • Your violation of law or these Terms
            </li>
          </ul>
        </section>

        {/* Section 20 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            20. DISPUTE RESOLUTION — ARBITRATION &amp; CLASS ACTION WAIVER
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                20.1 Informal Resolution
              </h3>
              <p className="text-gray-800">
                You agree to attempt informal resolution before initiating a
                claim.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                20.2 Binding Arbitration
              </h3>
              <p className="text-gray-800">
                Except where prohibited by law, disputes will be resolved by{" "}
                <strong>binding arbitration</strong>, not court, except:
              </p>
              <ul className="pl-4 space-y-2">
                <li className="text-gray-800">
                  • Eligible small-claims matters
                </li>
                <li className="text-gray-800">
                  • Injunctive relief for intellectual property misuse
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                20.3 Class Action Waiver
              </h3>
              <p className="text-gray-800">
                You waive the right to participate in class or representative
                actions.
              </p>
            </div>
          </div>
        </section>

        {/* Section 21 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">21. GOVERNING LAW</h2>
          <p className="text-gray-800">
            These Terms are governed by the laws of the{" "}
            <strong>State of Florida, USA</strong>, without regard to
            conflict-of-law principles. Where arbitration does not apply, venue
            will be Florida courts unless law requires otherwise.
          </p>
        </section>

        {/* Section 22 */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-black">
            22. CHANGES TO THESE TERMS
          </h2>
          <p className="text-gray-800">
            We may update these Terms from time to time. Continued use of the
            Platform means you accept the updated Terms.
          </p>
        </section>

        {/* Section 23 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">23. CONTACT</h2>
          <div className="space-y-2">
            <p className="text-gray-800">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:companiescentereu@gmail.com"
                className="text-blue-600 hover:underline"
              >
                companiescentereu@gmail.com
              </a>
            </p>
            <div>
              <p className="text-gray-800">
                <strong>Address:</strong>
              </p>
              <p className="text-gray-800">30190 US Highway 19N #1064</p>
              <p className="text-gray-800">Clearwater, Florida 33761</p>
              <p className="text-gray-800">United States</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
