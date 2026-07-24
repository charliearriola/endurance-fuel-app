import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 font-semibold tracking-tight"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="h-4 w-4" fill="currentColor" />
        </span>
        <span>
          Endurance <span className="text-primary">Fuel</span> System
        </span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
