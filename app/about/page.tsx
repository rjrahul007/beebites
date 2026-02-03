import { Footer } from "@/components/footer";
import PageLayout from "@/components/page-layout";
import { Moon, Users, Utensils, Clock } from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
  return (
    <PageLayout>
      <div className="bg-card rounded-xl shadow-xl p-6 sm:p-10 border border-border mb-2">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            About Beebites
          </h1>
          <p className="text-foreground/90 text-lg">
            Late-night cravings deserve great food
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Our Story
            </h2>
            <p className="text-foreground/90 mb-4">
              Beebites was born from a simple realization: the best cravings
              strike when most restaurants are closed. Whether you're a night
              owl working late, a student pulling an all-nighter, or simply
              someone with midnight munchies, finding quality food between 10 PM
              and 5 AM used to be nearly impossible.
            </p>
            <p className="text-foreground/90 mb-4">
              We set out to change that. Beebites is Nagaland's premier
              late-night food delivery service, connecting hungry night owls
              with the best local restaurants that keep their kitchens open when
              others close their doors.
            </p>
            <p className="text-foreground/90">
              Since our launch, we've delivered thousands of late-night meals,
              creating a community of satisfied customers who no longer have to
              compromise on quality just because it's past midnight.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              What Makes Us Different
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Moon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Late-Night Specialists
                  </h3>
                </div>
                <p className="text-foreground/80 text-sm">
                  We exclusively serve the late-night crowd (10 PM - 5 AM),
                  ensuring our full focus on quality service when you need it
                  most.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Utensils className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Curated Partners
                  </h3>
                </div>
                <p className="text-foreground/80 text-sm">
                  We partner only with restaurants that maintain high quality
                  standards, even during late-night hours.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Fast Delivery
                  </h3>
                </div>
                <p className="text-foreground/80 text-sm">
                  Our dedicated late-night delivery fleet ensures your food
                  arrives hot and fresh, typically within 30-45 minutes.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Local Focus</h3>
                </div>
                <p className="text-foreground/80 text-sm">
                  Proudly serving Nagaland, we support local restaurants and
                  create opportunities for late-night employment.
                </p>
              </div>
            </div>
          </section>

          {/* <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Our Mission
            </h2>
            <div className="p-6 rounded-lg border border-primary/30 bg-primary/5">
              <p className="text-foreground/90 text-lg font-medium mb-2">
                To make quality food accessible 24/7, ensuring no craving goes
                unsatisfied, no matter the hour.
              </p>
              <p className="text-foreground/80">
                We believe everyone deserves access to delicious, hot meals -
                whether it's 2 PM or 2 AM.
              </p>
            </div>
          </section> */}

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Our Values
            </h2>
            <ul className="space-y-3 text-foreground/90">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong className="text-foreground">Quality First:</strong> We
                  never compromise on food quality or service standards
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong className="text-foreground">Reliability:</strong> You
                  can count on us to be there when hunger strikes
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong className="text-foreground">Community:</strong>{" "}
                  Supporting local businesses and creating jobs in our community
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong className="text-foreground">Innovation:</strong>{" "}
                  Continuously improving to serve you better
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Join the Beebites Family
            </h2>
            <p className="text-foreground/90 mb-4">
              Whether you're a customer with late-night cravings, a restaurant
              looking to extend your hours, or a delivery partner seeking
              flexible work, we'd love to have you with us.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Get in Touch
              </Link>
              {/* <Link
                href="/partner"
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
              >
                Partner With Us
              </Link> */}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
}
