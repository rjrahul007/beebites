import {
  Instagram,
  Twitter,
  Facebook,
  PhoneCall,
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0A0A0A] text-white overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at center, #F5A623 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Top divider with honeycomb accent */}
      <div className="relative flex items-center gap-4 px-8 pt-10 mb-10 max-w-7xl mx-auto">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F5A623]/40 to-transparent" />
        <span className="text-[#F5A623] text-xl select-none">✦</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F5A623]/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand — spans 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center">
              <Image
                src="/images/logo/beebites_logo_transparentbg.png"
                alt="BeeBites"
                width={160}
                height={48}
                // className="object-contain object-left"
              />
            </div>

            <p className="text-[#888] text-sm leading-relaxed max-w-xs font-light tracking-wide">
              Your go-to destination for late-night cravings. Fresh, fast, and
              always delicious. We're open when hunger strikes the hardest.
            </p>

            {/* Hours badge */}
            <div className="inline-flex items-center gap-3 bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-full px-5 py-2.5 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5A623] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5A623]" />
              </span>
              <span className="text-[#F5A623] text-xs font-semibold tracking-widest uppercase">
                Open 10 PM – 5 AM
              </span>
            </div>

            {/* Socials */}
            <div className="flex gap-3 mt-1">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Facebook, href: "#", label: "Facebook" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-[#F5A623]/15 hover:border-[#F5A623]/40 transition-all duration-200"
                >
                  <Icon className="w-4 h-4 text-[#666] group-hover:text-[#F5A623] transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Quick Links — 2 cols */}
          <div className="lg:col-span-2">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#F5A623] mb-5">
              Navigate
            </p>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "FAQs", href: "/faq" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms & Service", href: "/terms" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-sm text-[#777] hover:text-white transition-colors duration-150"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-[#F5A623] transition-all duration-200 origin-left" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — 4 cols */}
          <div className="lg:col-span-4">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#F5A623] mb-5">
              Get In Touch
            </p>
            <ul className="space-y-4">
              {[
                {
                  icon: PhoneCall,
                  label: "+91 98765 43210",
                  href: "tel:+919876543210",
                },
                {
                  icon: Mail,
                  label: "info@beebites.in",
                  href: "mailto:info@beebites.in",
                },
                {
                  icon: MapPin,
                  label: "Dimapur, Nagaland",
                  href: "#",
                },
              ].map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-center gap-3 text-sm text-[#777] hover:text-white transition-colors duration-150"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-md bg-white/5 border border-white/8 group-hover:bg-[#F5A623]/15 group-hover:border-[#F5A623]/30 transition-all duration-200 shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[#555] group-hover:text-[#F5A623] transition-colors duration-200" />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/8">
          <p className="text-[#444] text-xs tracking-wide">
            © {year} BeeBites. All rights reserved.
          </p>
          <p className="text-[#333] text-xs tracking-wide">
            Crafted with 🍯 for night bees.
          </p>
        </div>
      </div>
    </footer>
  );
}
