import { Footer } from "@/components/footer";
import PageLayout from "@/components/page-layout";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <PageLayout>
      <div className="bg-card rounded-xl shadow-xl p-6 sm:p-10 border border-border mb-2">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            📜 Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: February 4, 2026
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-foreground/90 mb-6">
            Welcome to Beebites! These Terms govern your use of our platform. By
            accessing or using Beebites, you agree to these Terms.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-foreground/90">
              You must be 18+ or have parental consent to use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Service Scope
            </h2>
            <p className="text-foreground/90">
              Beebites enables online ordering of food for delivery between
              10:00 PM and 5:00 AM. Service availability depends on partner
              restaurant participation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Account Responsibilities
            </h2>
            <p className="text-foreground/90">
              You are responsible for maintaining a secure account. You agree
              not to misuse the platform or disrupt operations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Placing Orders
            </h2>
            <p className="text-foreground/90">
              Orders accepted on the platform are subject to restaurant
              confirmation and delivery feasibility.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Payment
            </h2>
            <p className="text-foreground/90">
              All payments are online — UPI, credit or debit cards, etc. Payment
              authorization must be valid and complete at the time of order.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Cancellation & Refunds
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>
                If an order is cancelled by you before preparation, standard
                cancellation charges may apply.
              </li>
              <li>
                If we cancel the order, you'll receive a refund. Refunds are
                processed within 3-4 business days to the original payment
                method.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-foreground/90 mb-3">
              Beebites isn't responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>Loss/damages beyond the cost of the order</li>
              <li>
                Issues caused by restaurants, delivery partners, or external
                systems
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Intellectual Property
            </h2>
            <p className="text-foreground/90">
              All content on Beebites (logos, text, graphics) is owned by us or
              our licensors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              9. Governing Law
            </h2>
            <p className="text-foreground/90">
              These Terms are governed by laws applicable to Assam, India.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              10. Changes
            </h2>
            <p className="text-foreground/90">
              We may modify or update these Terms. We'll notify you of
              significant changes.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Questions about these Terms? Contact us at{" "}
            <a
              href="mailto:support@beebites.com"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              support@beebites.com
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
}
