import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-card rounded-xl shadow-xl p-6 sm:p-10 border border-border">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              📄 Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: February 4, 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-foreground/90 mb-6">
              Beebites ("we", "us", "our") respects your privacy and is
              committed to protecting your personal information. This Privacy
              Policy explains how we collect, use, store, and share your
              information when you use our website and services.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Information We Collect
              </h2>
              <p className="text-foreground/90 mb-3">
                We collect information you provide directly, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90 mb-4">
                <li>Name, email address, phone number, delivery address</li>
                <li>
                  Payment details (such as UPI transaction IDs, masked card info
                  via payment gateways)
                </li>
                <li>
                  Communication you send to us (feedback, support messages)
                </li>
              </ul>
              <p className="text-foreground/90 mb-3">
                We also automatically collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>
                  Device & usage data (like IP, browser, app interactions)
                </li>
                <li>Location data (when needed to fulfill delivery)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-foreground/90 mb-3">Your data is used to:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90 mb-4">
                <li>Process and deliver food orders</li>
                <li>Communicate updates (order status, delivery issues)</li>
                <li>Improve and personalize our service</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="text-foreground font-medium">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Payments
              </h2>
              <p className="text-foreground/90">
                We use third-party payment processors to securely handle online
                payments (UPI, credit/debit card). Beebites never directly
                stores full card numbers; this is managed by compliant payment
                gateways.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Data Sharing
              </h2>
              <p className="text-foreground/90 mb-3">
                We may share information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>Delivery partners and restaurants to complete orders</li>
                <li>
                  Service providers (for analytics, customer support, etc.)
                </li>
                <li>Law enforcement if required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Your Rights
              </h2>
              <p className="text-foreground/90 mb-3">You can request:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>Access to your data</li>
                <li>Correction of incorrect details</li>
                <li>Deletion of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Cookies & Tracking
              </h2>
              <p className="text-foreground/90">
                We use cookies and similar tools to enhance your experience and
                for analytics.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Changes
              </h2>
              <p className="text-foreground/90">
                We may update this policy — we'll notify you when there's a
                material change.
              </p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              For questions about this Privacy Policy, please contact us at{" "}
              <a
                href="mailto:support@beebites.com"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                support@beebites.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
