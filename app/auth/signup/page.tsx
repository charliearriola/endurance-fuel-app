import Link from "next/link";
import { MailCheck } from "lucide-react";
import { signup } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string; checkEmail?: string };
}) {
  if (searchParams.checkEmail) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent you a confirmation link. Click it to activate your account
          and start your onboarding.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Start free. Upgrade whenever you&apos;re ready.
      </p>

      <form action={signup} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full name</Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            className="h-11"
          />
        </div>

        {searchParams.error && (
          <p className="text-sm text-destructive">{searchParams.error}</p>
        )}

        <Button type="submit" size="lg" className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
