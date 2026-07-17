"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/lib/app-config";
import AuthLayout from "@/components/auth/AuthLayout";
import Logo from "@/components/auth/Logo";
import Field from "@/components/ui/Field";
import { ButtonPrimary } from "@/components/ui/Button";
// import { Divider, SocialRow } from "@/components/auth/SocialAuth";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!agreed) return;
        setError("");
        setLoading(true);
        try {
            await register(name, email, password, confirmPassword);
            router.push("/login");
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                const data = err.response.data;
                if (data.errors) {
                    const firstError = Object.values(data.errors).flat();
                    setError(firstError[0] as string);
                } else if (data.message) {
                    setError(data.message);
                } else {
                    setError("Registration failed. Please try again.");
                }
            } else {
                setError("Connection error. Please check your network.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout>
            <div className="mb-10">
                <Logo />
            </div>

            <h1 className="mb-2 font-display text-[26px] font-bold leading-tight tracking-tight sm:text-[28px]">
                Start your fitness journey
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                One account to store all your body data and progress, safe and personal.
            </p>

            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="mb-4 rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
                        {error}
                    </div>
                )}

                <Field
                    id="name"
                    label="Full name"
                    type="text"
                    placeholder="Your name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Field
                    id="identifier"
                    label="Email "
                    type="text"
                    placeholder="name@email.com"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Field
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Minimum of 8 characters"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Field
                    id="confirmPassword"
                    label="Confirm password"
                    type="password"
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <div className="mb-5.5 flex items-start gap-2.25">
                    <input
                        type="checkbox"
                        id="tos"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.75 h-3.75 w-3.75 shrink-0 accent-orange"
                    />
                    <label htmlFor="tos" className="text-[13.5px] leading-relaxed text-ink-soft">
                        I agree with{" "}
                        <Link href="/terms" className="font-semibold text-orange-deep hover:underline">
                            Terms &amp; Conditions
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="font-semibold text-orange-deep hover:underline">
                            Privacy Policy
                        </Link>{" "}
                        of {APP_NAME}.
                    </label>
                </div>

                <ButtonPrimary type="submit" disabled={!agreed || loading} className="disabled:cursor-not-allowed disabled:opacity-50">
                    {loading ? "Creating account..." : "Create Account"}
                </ButtonPrimary>
            </form>
{/* 
            <Divider text="or sign up with" />
            <SocialRow /> */}

            <p className="text-center text-sm text-ink-soft pt-6">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-orange-deep hover:underline">
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
}
