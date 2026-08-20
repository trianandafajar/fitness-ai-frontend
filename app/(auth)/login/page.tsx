"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth";
import { getProfileCompleted } from "@/lib/cookies";
import AuthLayout from "@/components/auth/AuthLayout";
import Field from "@/components/ui/Field";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import { Divider, SocialRow } from "@/components/auth/SocialAuth";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const Player = dynamic(
    () => import("@lottiefiles/react-lottie-player").then((m) => m.Player),
    { ssr: false },
);

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [busy, setBusy] = useState<"signin" | "admin" | "demo" | null>(null);
    const isBusy = busy !== null;
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setBusy("signin");
        try {
            const res = await login(identifier, password, rememberMe);
            router.push(redirectAfterLogin(res.user.is_admin));
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                const data = err.response.data;
                if (err.response.status === 429) {
                    setError("Too many login attempts. Please wait a minute and try again.");
                    return;
                }
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
            setBusy(null);
        }
    }

    function redirectAfterLogin(isAdmin: boolean): string {
        if (isAdmin) return "/admin";
        return getProfileCompleted() ? "/dashboard" : "/onboarding";
    }

    async function handleAdminLogin() {
        setError("");
        setBusy("admin");
        try {
            const res = await login("admin@fitness.ai", "password");
            router.push(redirectAfterLogin(res.user.is_admin));
        } catch (err) {
            setError("Admin login failed. Please check the admin account.");
        } finally {
            setBusy(null);
        }
    }

    async function handleDemoLogin() {
        setError("");
        setBusy("demo");
        try {
            const res = await login("demo@fitness.ai", "password");
            router.push(redirectAfterLogin(res.user.is_admin));
        } catch (err) {
            setError("Demo login failed. Please run the demo seeder first.");
        } finally {
            setBusy(null);
        }
    }

    return (
        <AuthLayout>
            <div className="mb-2 flex justify-center">
                <Player
                    src="/lottie/login.json"
                    loop
                    autoplay
                    style={{ width: "100%", height: "100%", display: "block" }}
                />
            </div>

            <h1 className="mb-1 text-center font-display text-[24px] font-bold leading-tight tracking-tight sm:text-[26px]">
                Sign In
            </h1>
            <p className="mb-8 text-center text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                Please enter email and password for login
            </p>

            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="mb-4 rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
                        {error}
                    </div>
                )}

                <Field
                    id="identifier"
                    label="Email"
                    type="text"
                    placeholder="name@email.com"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    disabled={isBusy}
                />
                <Field
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isBusy}
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isBusy}
                            className="flex items-center disabled:opacity-50"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                />

                <div className="-mt-1.5 mb-4.5 flex items-center justify-between">
                    <label className="flex items-center gap-1.75 text-[13px] font-medium text-ink-soft">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={isBusy}
                            className="h-3.5 w-3.5 accent-orange disabled:opacity-50"
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

                <ButtonPrimary type="submit" disabled={isBusy}>
                    {busy === "signin" ? "Signing in..." : "Log in"}
                </ButtonPrimary>
            </form>

            <div className="my-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-line" />
                <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">or</span>
                <div className="h-px flex-1 bg-line" />
            </div>

            <div className="flex gap-2">
                <ButtonSecondary type="button" disabled={isBusy} onClick={handleAdminLogin}>
                    {busy === "admin" ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Logging in...
                        </span>
                    ) : (
                        "Login as Admin"
                    )}
                </ButtonSecondary>

                <ButtonSecondary type="button" disabled={isBusy} onClick={handleDemoLogin}>
                    {busy === "demo" ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Logging in...
                        </span>
                    ) : (
                        "Login as Demo User"
                    )}
                </ButtonSecondary>
            </div>

            {/* <Divider text="or continue with" />
            <SocialRow /> */}

            <p className="text-center text-sm text-ink-soft pt-6">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-orange-deep hover:underline">
                    Sign up now
                </Link>
            </p>
        </AuthLayout>
    );
}