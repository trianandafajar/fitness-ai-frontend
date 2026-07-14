"use client";

import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthVisual from "@/components/auth/AuthVisual";
import BackLink from "@/components/auth/BackLink";
import Field from "@/components/ui/Field";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import Logo from "@/components/auth/Logo";

export default function ForgotPasswordPage() {
    const [sent, setSent] = useState(false);
    const [identifier, setIdentifier] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // TODO: call API to send reset link
        setSent(true);
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
                                Enter your registered email or phone number, and we'll send a link to create a new
                                password.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <Field
                                    id="identifier"
                                    label="Email or Phone No."
                                    type="text"
                                    placeholder="nama@email.com"
                                    autoComplete="username"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                                <ButtonPrimary type="submit">Send Reset Link</ButtonPrimary>
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
                                Cek email/SMS di{" "}
                                <span className="font-semibold text-ink">{identifier || "your account"}</span>,
                                the reset link is valid for 30 minutes.
                            </p>
                            <ButtonSecondary type="button" onClick={() => setSent(false)}>
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
