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
                        Masuk ke akun kamu
                    </h1>
                    <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                        Lanjutkan progres fitness yang sudah kamu bangun bareng AI coach.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <Field
                            id="identifier"
                            label="Email atau No. HP"
                            type="text"
                            placeholder="nama@email.com"
                            autoComplete="username"
                        />
                        <Field
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Masukkan password"
                            autoComplete="current-password"
                        />

                        <div className="-mt-1.5 mb-[18px] flex items-center justify-between">
                            <label className="flex items-center gap-[7px] text-[13px] font-medium text-ink-soft">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-3.5 w-3.5 accent-orange"
                                />
                                Ingat saya
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-[13px] font-semibold text-orange-deep hover:underline"
                            >
                                Lupa password?
                            </Link>
                        </div>

                        <ButtonPrimary type="submit">Masuk</ButtonPrimary>
                    </form>

                    <Divider text="atau masuk dengan" />
                    <SocialRow />

                    <p className="text-center text-sm text-ink-soft">
                        Belum punya akun?{" "}
                        <Link href="/register" className="font-semibold text-orange-deep hover:underline">
                            Daftar sekarang
                        </Link>
                    </p>
                </>
            }
            visualSide={
                <AuthVisual
                    tag="● Live tracking"
                    heading="Personal AI coach yang belajar dari tubuh kamu."
                    sub="Setiap detak, langkah, dan porsi makan tercatat — jadi rekomendasi yang kamu dapat benar-benar personal."
                    stats={[
                        { label: "Heart Rate", value: "142 BPM" },
                        { label: "Streak berjalan", value: "12 hari" },
                        { label: "Weekly Score", value: "85/100" },
                    ]}
                />
            }
        />
    );
}
