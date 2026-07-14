"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthVisual from "@/components/auth/AuthVisual";
import Field from "@/components/ui/Field";
import { ButtonPrimary } from "@/components/ui/Button";

function PasswordStrengthHint({ password }: { password: string }) {
    const checks = [
        { label: "Minimal 8 karakter", pass: password.length >= 8 },
        { label: "Ada huruf besar", pass: /[A-Z]/.test(password) },
        { label: "Ada angka", pass: /[0-9]/.test(password) },
    ];

    return (
        <ul className="mb-[18px] -mt-2 flex flex-col gap-1">
            {checks.map((c) => (
                <li
                    key={c.label}
                    className={`flex items-center gap-1.5 text-[12.5px] ${c.pass ? "text-orange-deep" : "text-ink-faint"
                        }`}
                >
                    <span
                        className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${c.pass ? "bg-orange" : "bg-line"
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
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [done, setDone] = useState(false);

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordValid = password.length >= 8;
    const canSubmit = passwordValid && passwordsMatch;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;
        // TODO: call API to set new password using `token`
        setDone(true);
    }

    if (!token) {
        return (
            <div className="py-5">
                <h1 className="mb-2 font-display text-[26px] font-bold leading-tight tracking-tight sm:text-[28px]">
                    Link tidak valid
                </h1>
                <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                    Link reset password sudah kedaluwarsa atau tidak lengkap. Minta link baru lewat
                    halaman lupa password.
                </p>
                <Link href="/forgot-password">
                    <ButtonPrimary type="button">Minta Link Baru</ButtonPrimary>
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
                    Password berhasil diubah
                </h1>
                <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                    Password baru kamu sudah aktif. Yuk masuk lagi pakai password itu.
                </p>
                <ButtonPrimary type="button" onClick={() => router.push("/login")}>
                    Ke Halaman Login
                </ButtonPrimary>
            </div>
        );
    }

    return (
        <>
            <h1 className="mb-2 font-display text-[26px] font-bold leading-tight tracking-tight sm:text-[28px]">
                Buat password baru
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                Pastikan password baru kamu beda dari yang lama, dan gampang diinget cuma sama kamu.
            </p>

            <form onSubmit={handleSubmit}>
                <Field
                    id="password"
                    label="Password baru"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordStrengthHint password={password} />

                <Field
                    id="confirmPassword"
                    label="Konfirmasi password baru"
                    type="password"
                    placeholder="Ulangi password baru"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="-mt-3 mb-[18px] text-[12.5px] font-medium text-orange-deep">
                        Password belum sama, coba cek lagi.
                    </p>
                )}

                <ButtonPrimary
                    type="submit"
                    disabled={!canSubmit}
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Simpan Password Baru
                </ButtonPrimary>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <AuthLayout
            formSide={
                <Suspense fallback={null}>
                    <ResetPasswordForm />
                </Suspense>
            }
            visualSide={
                <AuthVisual
                    tag="🔒 Aman & terenkripsi"
                    heading="Satu langkah lagi buat balik ke progres kamu."
                    sub="Password baru langsung aktif setelah disimpan — kamu bisa langsung masuk lagi."
                />
            }
        />
    );
}
