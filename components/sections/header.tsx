"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

type HeaderProps = {
  isAuthenticated: boolean;
  onLogout: () => void | Promise<void>;
};

export function Header({ isAuthenticated, onLogout }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" fill="currentColor" />
          </span>
          <span>
            Endurance <span className="text-primary">Fuel</span> System
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <form action={onLogout}>
                <Button type="submit" variant="outline" size="sm">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Button asChild size="sm">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-foreground md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Dashboard
                </Link>
                <form action={onLogout}>
                  <Button type="submit" variant="outline" size="lg" className="mt-3 w-full">
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Login
                </Link>
                <Button asChild size="lg" className="mt-3 w-full">
                  <Link href="/auth/signup" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
