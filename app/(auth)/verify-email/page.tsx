"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth";
import AuthLayout from "@/components/auth/AuthLayout";
import { ButtonPrimary } from "@/components/ui/Button";
import Logo from "@/components/auth/Logo";

function formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function VerifyEmailForm() {
    const router = useRouter();
    const { verifyEmail, resendVerification, getVerificationStatus } = useAuth();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [done, setDone] = useState(false);
    const [info, setInfo] = useState("");
    const [error, setError] = useState("");
    const [expiresIn, setExpiresIn] = useState<number | null>(null);
    const [resendAfter, setResendAfter] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const submittedRef = useRef<string>("");

    useEffect(() => {
        if (!email) return;
        getVerificationStatus(email)
            .then((res) => {
                setExpiresIn(res.expires_in ?? null);
                setResendAfter(res.resend_after ?? 0);
            })
            .catch(() => {});
    }, [email, getVerificationStatus]);

    useEffect(() => {
        const id = setInterval(() => {
            setResendAfter((s) => (s > 0 ? s - 1 : 0));
            setExpiresIn((s) => (s != null && s > 0 ? s - 1 : s));
        }, 1000);
        return () => clearInterval(id);
    }, []);

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault();
            if (code.length !== 6) return;
            setError("");
            setLoading(true);
            try {
                await verifyEmail(email, code);
                setDone(true);
            } catch (err) {
                if (isAxiosError(err) && err.response) {
                    const data = err.response.data;
                    if (data.errors?.code) {
                        setError(data.errors.code[0]);
                    } else if (data.message) {
                        setError(data.message);
                    } else {
                        setError("Verification failed. Please check your code.");
                    }
                } else {
                    setError("Connection error. Please check your network.");
                }
            } finally {
                setLoading(false);
            }
        },
        [code, email, verifyEmail],
    );

    useEffect(() => {
        if (code.length !== 6) {
            submittedRef.current = "";
            return;
        }
        if (!loading && !done && code !== submittedRef.current) {
            submittedRef.current = code;
            void handleSubmit();
        }
    }, [code, loading, done, handleSubmit]);

    function setDigit(index: number, value: string) {
        const next = code.split("");
        next[index] = value.slice(-1);
        setCode(next.join(""));
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;
        e.preventDefault();
        setCode(pasted);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }

    async function handleResend() {
        if (!email) return;
        setError("");
        setResending(true);
        try {
            await resendVerification(email);
            setInfo("A new verification code has been sent to your email.");
            setResendAfter(60);
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                const data = err.response.data;
                if (err.response.status === 429 && typeof data.retry_after === "number") {
                    setResendAfter(data.retry_after);
                }
                setError(data.message ?? "Unable to resend the code. Please try again.");
            } else {
                setError("Connection error. Please check your network.");
            }
        } finally {
            setResending(false);
        }
    }

    if (!email) {
        return (
            <div className="py-5">
                <h1 className="mb-2 font-display text-[26px] font-bold leading-tight tracking-tight sm:text-[28px]">
                    Invalid link
                </h1>
                <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                    No email was provided. Please log in to request a verification code.
                </p>
                <Link href="/login">
                    <ButtonPrimary type="button">Go to Login</ButtonPrimary>
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
                    Email verified
                </h1>
                <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                    Your email has been verified. Log in to continue.
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
                Verify your email
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                We sent a 6-digit verification code to{" "}
                <span className="font-semibold text-ink">{email}</span>. Enter the code below.
            </p>

            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="mb-4 rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
                        {error}
                    </div>
                )}
                {info && (
                    <div className="mb-4 rounded-[10px] border border-orange/30 bg-orange/5 px-4 py-3 text-[13px] font-medium text-orange-deep">
                        {info}
                    </div>
                )}

                <label className="mb-1.75 block whitespace-nowrap text-[13px] font-semibold text-ink">
                    Verification code
                </label>
                <div className="mb-5.5 flex justify-between gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <input
                            key={i}
                            ref={(el) => {
                                inputRefs.current[i] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            autoComplete={i === 0 ? "one-time-code" : "off"}
                            autoFocus={i === 0}
                            value={code[i] ?? ""}
                            onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, ""))}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            onPaste={handlePaste}
                            className="h-12 w-full rounded-[12px] border-[1.5px] border-line bg-surface text-center font-sans text-xl font-semibold text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-orange focus:bg-white"
                        />
                    ))}
                </div>

                {expiresIn != null && (
                    <p className="-mt-3 mb-5.5 text-center text-[12.5px] font-medium text-ink-soft">
                        {expiresIn > 0 ? (
                            <>
                                Code expires in{" "}
                                <span className="font-semibold text-orange-deep">
                                    {formatTime(expiresIn)}
                                </span>
                            </>
                        ) : (
                            "Code has expired. Request a new one below."
                        )}
                    </p>
                )}

                <ButtonPrimary
                    type="submit"
                    disabled={code.length !== 6 || loading}
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </ButtonPrimary>
            </form>

            <div className="mt-6 text-center">
                <p className="mb-2 text-sm text-ink-soft">Didn&apos;t receive the code?</p>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendAfter > 0 || resending}
                    className="text-sm font-semibold text-orange-deep hover:underline disabled:cursor-not-allowed disabled:text-ink-faint disabled:no-underline"
                >
                    {resending
                        ? "Sending..."
                        : resendAfter > 0
                          ? `Resend in ${formatTime(resendAfter)}`
                          : "Resend verification code"}
                </button>
            </div>
        </>
    );
}

export default function VerifyEmailPage() {
    return (
        <AuthLayout>
            <div className="mb-10">
                <Logo />
            </div>
            <Suspense fallback={null}>
                <VerifyEmailForm />
            </Suspense>
        </AuthLayout>
    );
}
