"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthVisual from "@/components/auth/AuthVisual";
import Logo from "@/components/auth/Logo";
import Field from "@/components/ui/Field";
import { ButtonPrimary } from "@/components/ui/Button";
import { Divider, SocialRow } from "@/components/auth/SocialAuth";

export default function RegisterPage() {
    const router = useRouter();
    const [agreed, setAgreed] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!agreed) return;
        // TODO: wire up to auth logic, then send the person into onboarding
        router.push("/onboarding");
    }

    return (
        <AuthLayout
            formSide={
                <>
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
                        <Field id="name" label="Full name" type="text" placeholder="Your name" autoComplete="name" />
                        <Field
                            id="identifier"
                            label="Email or Phone No."
                            type="text"
                            placeholder="name@email.com"
                            autoComplete="username"
                        />
                        <Field
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Minimal 8 karakter"
                            autoComplete="new-password"
                        />
                        <Field
                            id="confirmPassword"
                            label="Confirm password"
                            type="password"
                            placeholder="Repeat password"
                            autoComplete="new-password"
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
                                of FitTrack AI.
                            </label>
                        </div>

                        <ButtonPrimary type="submit" disabled={!agreed} className="disabled:cursor-not-allowed disabled:opacity-50">
                            Create Account
                        </ButtonPrimary>
                    </form>

                    <Divider text="or sign up with" />
                    <SocialRow />

                    <p className="text-center text-sm text-ink-soft">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-orange-deep hover:underline">
                            Log in
                        </Link>
                    </p>
                </>
            }
            visualSide={
                <AuthVisual
                    tag="✦ Free to start"
                    heading="Like having a personal trainer & nutritionist in your pocket."
                    sub="Fill in your profile once, and the AI instantly creates workout plans and meal plans tailored to your habits."
                    stats={[
                        { label: "Onboarding", value: "~3 min" },
                        { label: "AI Plan", value: "Ready instantly" },
                    ]}
                />
            }
        />
    );
}
