"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth";
import AuthLayout from "@/components/auth/AuthLayout";
import Field from "@/components/ui/Field";
import { ButtonPrimary } from "@/components/ui/Button";
import { Divider, SocialRow } from "@/components/auth/SocialAuth";
import { Eye, EyeOff } from "lucide-react";
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(identifier, password);
            router.push("/onboarding");
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                const data = err.response.data;
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
        <AuthLayout>
            <div className="mb-2 flex justify-center">
                <Player
                    src="https://lottie.host/790bfc47-7ec9-4c3f-a39c-1eb369b4e21a/U4sLnngJOC.json"
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
                />
                <Field
                    id="password"
                    label="Confirm password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat password"
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

                <ButtonPrimary type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Log in"}
                </ButtonPrimary>
            </form>

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