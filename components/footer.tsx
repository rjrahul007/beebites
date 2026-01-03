import {
  Moon,
  Instagram,
  Twitter,
  Facebook,
  PhoneCallIcon,
  Mail,
  MapPinnedIcon,
} from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={"/images/logo/beebites_logo_transparentbg.png"}
                alt="beebites-logo"
                width={200}
                height={200}
                className="-mx-8 -mb-8 -mt-20"
              />
              {/* <span className="text-2xl font-bold text-gradient-gold">
                BeeBites
              </span> */}
            </div>
            <p className="text-muted-foreground max-w-sm">
              Your go-to destination for late-night cravings. Fresh, fast, and
              always delicious. Open 10 PM - 5 AM.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Menu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="hover:text-primary">
                <PhoneCallIcon className="w-4 h-4 inline mr-2" /> +91 98765
                43210
              </li>
              <li className="hover:text-primary">
                <Mail className="w-4 h-4 inline mr-2" /> info@beebites.in
              </li>
              <li className="hover:text-primary">
                <MapPinnedIcon className="w-4 h-4 inline mr-2" /> Dimapur,
                Nagaland
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>
            © {new Date().getFullYear()} BeeBites. All rights reserved. Made
            with for night bees.
          </p>
        </div>
      </div>
    </footer>
  );
}
