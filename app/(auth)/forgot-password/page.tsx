"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthVisual from "@/components/auth/AuthVisual";
import BackLink from "@/components/auth/BackLink";
import Field from "@/components/ui/Field";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import Logo from "@/components/auth/Logo";

export default function ForgotPasswordPage() {
    const { forgotPassword } = useAuth();
    const [sent, setSent] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await forgotPassword(identifier);
            setSent(true);
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                const data = err.response.data;
                if (data.message) {
                    setError(data.message);
                } else {
                    setError("Failed to send reset link. Try again.");
                }
            } else {
                setError("Connection error. Please check your network.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        setSent(false);
        setError("");
        // Re-trigger submit on next form submission
    }

    return (
        <AuthLayout
            formSide={
                <>
                    <div className="mb-10">
                        <Logo />
                    </div>

                    <BackLink href="/login">Back to login</BackLink>

                    {!sent ? (
                        <>
                            <h1 className="mb-2 font-display text-[26px] font-bold leading-tight tracking-tight sm:text-[28px]">
                                Reset your password
                            </h1>
                            <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                                Enter your registered email, and we&apos;ll send a link to create a new
                                password.
                            </p>

                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="mb-4 rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
                                        {error}
                                    </div>
                                )}

                                <Field
                                    id="identifier"
                                    label="Email "
                                    type="text"
                                    placeholder="name@email.com"
                                    autoComplete="username"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                />
                                <ButtonPrimary type="submit" disabled={loading}>
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </ButtonPrimary>
                            </form>
                        </>
                    ) : (
                        <div className="py-5 text-center">
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-tint">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M4 12l5 5L20 6"
                                        stroke="#FF5A1F"
                                        strokeWidth="2.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h1 className="mb-2 font-display text-[26px] font-bold leading-tight tracking-tight sm:text-[28px]">
                                Link sent
                            </h1>
                            <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                                Check your email at{" "}
                                <span className="font-semibold text-ink">{identifier}</span>,
                                the reset link is valid for 30 minutes.
                            </p>
                            <ButtonSecondary type="button" onClick={handleResend}>
                                Resend link
                            </ButtonSecondary>
                        </div>
                    )}
                </>
            }
            visualSide={
                <AuthVisual
                    tag="Secure & encrypted"
                    heading="Your data stays yours."
                    sub="All body data and health history are stored securely — you control who can see it."
                />
            }
        />
    );
}
