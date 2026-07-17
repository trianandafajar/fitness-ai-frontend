"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth";
import AuthLayout from "@/components/auth/AuthLayout";
import Field from "@/components/ui/Field";
import { ButtonPrimary } from "@/components/ui/Button";
import Logo from "@/components/auth/Logo";

function PasswordStrengthHint({ password }: { password: string }) {
    const checks = [
        { label: "At least 8 characters", pass: password.length >= 8 },
        { label: "Has uppercase letter", pass: /[A-Z]/.test(password) },
        { label: "Has a number", pass: /[0-9]/.test(password) },
    ];

    return (
        <ul className="mb-4.5 -mt-2 flex flex-col gap-1">
            {checks.map((c) => (
                <li
                    key={c.label}
                    className={`flex items-center gap-1.5 text-[12.5px] ${c.pass ? "text-orange-deep" : "text-ink-faint"
                    }`}
                >
                    <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.pass ? "bg-orange" : "bg-line"
                        }`}
                    />
                    {c.label}
                </li>
            ))}
        </ul>
    );
}

function ResetPasswordForm() {
    const router = useRouter();
    const { resetPassword } = useAuth();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordValid = password.length >= 8;
    const canSubmit = passwordValid && passwordsMatch;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit || !token || !email) return;
        setError("");
        setLoading(true);
        try {
            await resetPassword(token, email, password, confirmPassword);
            setDone(true);
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                const data = err.response.data;
                if (data.message) {
                    setError(data.message);
                } else {
                    setError("Failed to reset password. The link may have expired.");
                }
            } else {
                setError("Connection error. Please check your network.");
            }
        } finally {
            setLoading(false);
        }
    }

    if (!token || !email) {
        return (
            <div className="py-5">
                <h1 className="mb-2 font-display text-[26px] font-bold leading-tight tracking-tight sm:text-[28px]">
                    Invalid link
                </h1>
                <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                    The reset link is incomplete. Request a new link from the
                    forgot password page.
                </p>
                <Link href="/forgot-password">
                    <ButtonPrimary type="button">Request New Link</ButtonPrimary>
                </Link>
            </div>
        );
    }

    if (done) {
        return (
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
                    Password changed
                </h1>
                <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                    Your new password is active. Log in again with your new password.
                </p>
                <ButtonPrimary type="button" onClick={() => router.push("/login")}>
                    Go to Login
                </ButtonPrimary>
            </div>
        );
    }

    return (
        <>
            <h1 className="mb-2 font-display text-[26px] font-bold leading-tight tracking-tight sm:text-[28px]">
                Create new password
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                Make sure your new password is different from your old one, and easy to remember only for you.
            </p>

            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="mb-4 rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
                        {error}
                    </div>
                )}

                <Field
                    id="password"
                    label="New password"
                    type="password"
                    placeholder="Minimum of 8 characters"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <PasswordStrengthHint password={password} />

                <Field
                    id="confirmPassword"
                    label="Confirm new password"
                    type="password"
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="-mt-3 mb-4.5 text-[12.5px] font-medium text-orange-deep">
                        Passwords don&apos;t match, please check again.
                    </p>
                )}

                <ButtonPrimary
                    type="submit"
                    disabled={!canSubmit || loading}
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save New Password"}
                </ButtonPrimary>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <AuthLayout>
            <div className="mb-10">
                <Logo />
            </div>
            <Suspense fallback={null}>
                <ResetPasswordForm />
            </Suspense>
        </AuthLayout>
    );
}
