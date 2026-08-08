"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth";
import Field from "@/components/ui/Field";
import { ButtonPrimary } from "@/components/ui/Button";
import { Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        const data = err.response.data;
        if (data.verified === false && data.email) {
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
          return;
        }
        if (data.email) {
          setError(Array.isArray(data.email) ? data.email[0] : data.email);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else {
        setError("Connection error. Please check your network.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Sign in to manage exercises & foods
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
              {error}
            </div>
          )}

          <Field
            id="email"
            label="Email"
            type="email"
            placeholder="admin@fitness.ai"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Field
            id="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </ButtonPrimary>
        </form>
      </div>
    </div>
  );
}
