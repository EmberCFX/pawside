"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { postAuthPath } from "@/lib/env";
import { createBrowserSupabase } from "@/lib/supabase/client";

export function AuthForm({
  mode,
  next = "/account",
}: {
  mode: "login" | "signup";
  next?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    const supabase = createBrowserSupabase();
    if (!supabase) {
      setError("Accounts aren’t connected yet. Email hello@pawside.co and we’ll set you up.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: signError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (signError) throw signError;
        if (data.session) {
          window.location.assign(postAuthPath(email, next));
          return;
        }
        setInfo("Check your email to confirm your account, then come back and sign in.");
      } else {
        const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
        if (signError) throw signError;
        window.location.assign(postAuthPath(email, next));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn’t work. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {mode === "signup" ? (
        <TextField
          label="Your name"
          name="name"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      ) : null}

      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        required
        minLength={8}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      {error ? (
        <p className="text-[0.875rem] text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="text-[0.875rem] text-navy-800" role="status">
          {info}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={busy} withArrow={!busy}>
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {mode === "signup" ? "Creating account" : "Signing in"}
          </>
        ) : mode === "signup" ? (
          "Create account"
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-[0.875rem] text-sand-600">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-navy-900">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-medium text-navy-900">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
