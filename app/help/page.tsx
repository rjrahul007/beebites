import { Footer } from "@/components/footer";
import PageLayout from "@/components/page-layout";
import {
  Search,
  ShoppingBag,
  CreditCard,
  MapPin,
  Users,
  HeadphonesIcon,
  FileText,
} from "lucide-react";
import Link from "next/link";

const helpTopics = [
  {
    icon: ShoppingBag,
    title: "Placing Orders",
    description: "Learn how to browse menus and place orders",
    articles: [
      "How to place your first order",
      "Understanding restaurant availability",
      "Adding items to your cart",
      "Applying promo codes and discounts",
      "Order customization options",
    ],
  },
  {
    icon: CreditCard,
    title: "Payments & Billing",
    description: "Payment methods, refunds, and billing questions",
    articles: [
      "Accepted payment methods",
      "How to add/update payment methods",
      "Understanding your bill",
      "Refund process and timeline",
      "Payment security and safety",
    ],
  },
  {
    icon: MapPin,
    title: "Delivery & Tracking",
    description: "Track your order and manage delivery",
    articles: [
      "How to track your order",
      "Expected delivery times",
      "Adding delivery instructions",
      "What to do if delivery is delayed",
      "Managing multiple addresses",
    ],
  },
  {
    icon: Users,
    title: "Account Management",
    description: "Manage your profile and preferences",
    articles: [
      "Creating a Beebites account",
      "Resetting your password",
      "Updating profile information",
      "Managing saved addresses",
      "Deleting your account",
    ],
  },
  {
    icon: HeadphonesIcon,
    title: "Customer Support",
    description: "Get help with issues and complaints",
    articles: [
      "How to contact support",
      "Reporting order issues",
      "Filing a complaint",
      "Getting a refund",
      "Support hours and response times",
    ],
  },
  {
    icon: FileText,
    title: "Policies & Terms",
    description: "Important information and guidelines",
    articles: [
      "Terms of Service",
      "Privacy Policy",
      "Cancellation policy",
      "Refund policy",
      "Community guidelines",
    ],
  },
];

const quickGuides = [
  {
    title: "🚀 Getting Started with Beebites",
    steps: [
      "Download the Beebites app or visit our website",
      "Create your account with email or phone number",
      "Add your delivery address",
      "Browse restaurants and menus",
      "Place your first order!",
    ],
  },
  {
    title: "📍 How to Track Your Order",
    steps: [
      "Open the Beebites app",
      "Go to 'My Orders' or click on your active order",
      "View real-time tracking on the map",
      "See preparation and delivery status",
      "Contact delivery partner if needed",
    ],
  },
  {
    title: "💳 How to Get a Refund",
    steps: [
      "Go to 'My Orders' in the app",
      "Select the order you want a refund for",
      "Click 'Report Issue' or 'Request Refund'",
      "Choose the reason for refund",
      "Submit with any additional details",
      "Refund processed in 3-4 business days",
    ],
  },
];

export default function HelpCenter() {
  return (
    <PageLayout containerClassName="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-card rounded-xl shadow-xl p-6 sm:p-10 border border-border mb-2">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            📚 Help Center
          </h1>
          <p className="text-foreground/90 text-lg mb-6">
            Find answers, guides, and support for all things Beebites
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Help Topics Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Browse by Topic
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {helpTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <div
                  key={index}
                  className="p-5 rounded-lg border border-border bg-muted/30 hover:bg-accent/50 hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {topic.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {topic.description}
                  </p>
                  <ul className="space-y-1.5">
                    {topic.articles.slice(0, 3).map((article, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-pointer"
                      >
                        • {article}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-primary mt-3 font-medium">
                    View all articles →
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Guides */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Quick Start Guides
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quickGuides.map((guide, index) => (
              <div
                key={index}
                className="p-5 rounded-lg border border-border bg-muted/20"
              >
                <h3 className="font-semibold text-foreground mb-4">
                  {guide.title}
                </h3>
                <ol className="space-y-2">
                  {guide.steps.map((step, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-foreground/80 flex gap-2"
                    >
                      <span className="text-primary font-semibold">
                        {idx + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Articles */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Popular Articles
          </h2>
          <div className="space-y-3">
            {[
              "What are Beebites delivery hours?",
              "How do I cancel or modify my order?",
              "Why was my order cancelled?",
              "How long does a refund take?",
              "Can I schedule an order for later?",
              "How do I contact my delivery partner?",
            ].map((article, index) => (
              <Link
                key={index}
                href="#"
                className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/30 transition-all"
              >
                <p className="text-foreground hover:text-primary transition-colors">
                  {article}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section>
          <div className="p-6 rounded-lg border border-primary/30 bg-primary/5">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Still Need Help?
            </h2>
            <p className="text-foreground/80 mb-4">
              Can't find what you're looking for? Our support team is here to
              help!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/faq"
                className="px-6 py-2.5 bg-muted text-foreground rounded-lg font-medium hover:bg-accent transition-colors border border-border"
              >
                View FAQs
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </PageLayout>
  );
}
