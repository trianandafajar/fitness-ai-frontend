"use client";

import Link from "next/link";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthVisual from "@/components/auth/AuthVisual";
import Logo from "@/components/auth/Logo";
import Field from "@/components/ui/Field";
import { ButtonPrimary } from "@/components/ui/Button";
import { Divider, SocialRow } from "@/components/auth/SocialAuth";

export default function LoginPage() {
    const [rememberMe, setRememberMe] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // TODO: wire up to auth logic
    }

    return (
        <AuthLayout
            formSide={
                <>
                    <div className="mb-10">
                        <Logo />
                    </div>

                    <h1 className="mb-2 font-display text-[26px] font-bold leading-tight tracking-tight sm:text-[28px]">
                        Log in to your account
                    </h1>
                    <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                        Continue the fitness progress you've built with your AI coach.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <Field
                            id="identifier"
                            label="Email or Phone No."
                            type="text"
                            placeholder="nama@email.com"
                            autoComplete="username"
                        />
                        <Field
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />

                        <div className="-mt-1.5 mb-4.5 flex items-center justify-between">
                            <label className="flex items-center gap-1.75 text-[13px] font-medium text-ink-soft">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-3.5 w-3.5 accent-orange"
                                />
                                Remember me
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-[13px] font-semibold text-orange-deep hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <ButtonPrimary type="submit">Log in</ButtonPrimary>
                    </form>

                    <Divider text="or log in with" />
                    <SocialRow />

                    <p className="text-center text-sm text-ink-soft">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-semibold text-orange-deep hover:underline">
                            Sign up now
                        </Link>
                    </p>
                </>
            }
            visualSide={
                <AuthVisual
                    tag="● Live tracking"
                    heading="A personal AI coach that learns from your body."
                    sub="Every heartbeat, step, and meal gets logged — so the recommendations you get are truly personal."
                    stats={[
                        { label: "Heart Rate", value: "142 BPM" },
                        { label: "Current Streak", value: "12 days" },
                        { label: "Weekly Score", value: "85/100" },
                    ]}
                />
            }
        />
    );
}
