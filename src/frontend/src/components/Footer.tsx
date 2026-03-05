import { Link } from "@tanstack/react-router";
import { Heart, Zap } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <Link
              to="/"
              className="flex items-center gap-2 font-display text-lg font-bold"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <span>
                Drop<span className="text-primary">Ship</span> Store
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your one-stop destination for premium products delivered fast.
              Quality without compromise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/" as const, label: "Home" },
                { to: "/products" as const, label: "All Products" },
                { to: "/contact" as const, label: "Contact Us" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Free shipping on orders over ₹999
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  30-day return policy
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {currentYear} DropShip Store. All rights reserved.
          </p>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            Built with <Heart className="h-3 w-3 fill-current text-primary" />{" "}
            using <span className="font-semibold">caffeine.ai</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
