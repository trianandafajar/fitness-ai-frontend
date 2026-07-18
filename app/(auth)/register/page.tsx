"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/lib/app-config";
import AuthLayout from "@/components/auth/AuthLayout";
import Field from "@/components/ui/Field";
import { ButtonPrimary } from "@/components/ui/Button";
// import { Divider, SocialRow } from "@/components/auth/SocialAuth

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function getPasswordStrength(pw: string): { label: string; level: number; bar: string; text: string } | null {
        if (!pw) return null;
        const hasUpper = /[A-Z]/.test(pw);
        const hasLower = /[a-z]/.test(pw);
        const hasDigit = /\d/.test(pw);
        const hasSpecial = /[^A-Za-z0-9]/.test(pw);
        const types = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;

        if (pw.length < 6) return { label: "Weak", level: 1, bar: "bg-red-500", text: "text-red-500" };
        if (pw.length >= 8 && types >= 3) return { label: "Strong", level: 3, bar: "bg-green-500", text: "text-green-600" };
        return { label: "Medium", level: 2, bar: "bg-orange-500", text: "text-orange-600" };
    }

    const strength = getPasswordStrength(password);

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
            <h1 className="mb-1 text-center font-display text-[24px] font-bold leading-tight tracking-tight sm:text-[26px]">
                Sign Up
            </h1>
            <p className="mb-8 text-center text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                Create your account here
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
                    label="Email"
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum of 8 characters"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="flex items-center"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                />
                {strength && (
                    <div className="-mt-2.5 mb-4.5">
                        <div className="flex h-1 gap-1">
                            <div className={`h-full flex-1 rounded-full transition-colors ${strength.level >= 1 ? strength.bar : "bg-line"}`} />
                            <div className={`h-full flex-1 rounded-full transition-colors ${strength.level >= 2 ? strength.bar : "bg-line"}`} />
                            <div className={`h-full flex-1 rounded-full transition-colors ${strength.level >= 3 ? strength.bar : "bg-line"}`} />
                        </div>
                        <p className={`mt-1 text-[12px] font-medium ${strength.text}`}>
                            {strength.label}
                        </p>
                    </div>
                )}
                <Field
                    id="confirmPassword"
                    label="Confirm password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="flex items-center"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
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
                    {loading ? "Creating account..." : "Sign Up"}
                </ButtonPrimary>
            </form>
            {/* 
            <Divider text="or continue with" />
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