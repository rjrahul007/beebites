import { Footer } from "@/components/footer";
import PageLayout from "@/components/page-layout";
import { Mail, MessageCircle, HelpCircle, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function ContactSupport() {
  return (
    <PageLayout>
      <div className="bg-card rounded-xl shadow-xl p-6 sm:p-10 border border-border mb-2">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            📞 Contact & Help Support
          </h1>
          <p className="text-foreground/90 text-lg">
            We're here to help! If you have questions, concerns, or need
            assistance with your order, use one of the following:
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Customer Support
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="mailto:support@beebites.com"
              className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent transition-all group"
            >
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">
                  support@beebites.com
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-accent/50">
              <div className="p-3 bg-primary/10 rounded-lg">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Live Chat
                </h3>
                <p className="text-sm text-muted-foreground">
                  Available on the Beebites app/website
                </p>
              </div>
            </div>

            <a
              href="/help"
              className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent transition-all group sm:col-span-2"
            >
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Help Center
                </h3>
                <p className="text-sm text-muted-foreground">
                  FAQs & guides at beebites.com/help
                </p>
              </div>
            </a>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Support Topics
          </h2>
          <p className="text-foreground/90 mb-3">You can contact us for:</p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>Order issues (delays, wrong items, missing food)</li>
            <li>Payment problems or refund status</li>
            <li>Account questions</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Order Assistance
          </h2>
          <div className="p-5 bg-muted rounded-lg border border-border">
            <p className="text-foreground/90">
              If your food delivery is in progress, use the{" "}
              <span className="font-semibold text-primary">"Track Order"</span>{" "}
              feature in the app for real-time updates.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Feedback
          </h2>
          <div className="flex items-start gap-4 p-5 rounded-lg border border-secondary/30 bg-secondary/5">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <MessageSquare className="h-6 w-6 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">
                We love hearing from you!
              </h3>
              <p className="text-foreground/90 mb-2">
                Send feedback anytime at:
              </p>
              <a
                href="mailto:feedback@beebites.com"
                className="text-secondary hover:text-secondary/80 font-medium transition-colors"
              >
                feedback@beebites.com
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </PageLayout>
  );
}
