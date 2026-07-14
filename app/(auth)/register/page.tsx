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
                        Mulai perjalanan fitness kamu
                    </h1>
                    <p className="mb-8 text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                        Satu akun buat nyimpen semua data tubuh dan progresmu, aman dan personal.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <Field id="name" label="Nama lengkap" type="text" placeholder="Nama kamu" autoComplete="name" />
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
                            placeholder="Minimal 8 karakter"
                            autoComplete="new-password"
                        />
                        <Field
                            id="confirmPassword"
                            label="Konfirmasi password"
                            type="password"
                            placeholder="Ulangi password"
                            autoComplete="new-password"
                        />

                        <div className="mb-[22px] flex items-start gap-[9px]">
                            <input
                                type="checkbox"
                                id="tos"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-[3px] h-[15px] w-[15px] flex-shrink-0 accent-orange"
                            />
                            <label htmlFor="tos" className="text-[13.5px] leading-relaxed text-ink-soft">
                                Saya setuju dengan{" "}
                                <Link href="/terms" className="font-semibold text-orange-deep hover:underline">
                                    Syarat &amp; Ketentuan
                                </Link>{" "}
                                dan{" "}
                                <Link href="/privacy" className="font-semibold text-orange-deep hover:underline">
                                    Kebijakan Privasi
                                </Link>{" "}
                                FitTrack AI.
                            </label>
                        </div>

                        <ButtonPrimary type="submit" disabled={!agreed} className="disabled:cursor-not-allowed disabled:opacity-50">
                            Buat Akun
                        </ButtonPrimary>
                    </form>

                    <Divider text="atau daftar dengan" />
                    <SocialRow />

                    <p className="text-center text-sm text-ink-soft">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="font-semibold text-orange-deep hover:underline">
                            Masuk
                        </Link>
                    </p>
                </>
            }
            visualSide={
                <AuthVisual
                    tag="✦ Gratis mulai"
                    heading="Seperti punya pelatih pribadi & ahli gizi di saku kamu."
                    sub="Isi profil sekali, AI langsung susun rencana latihan dan menu yang cocok buat kebiasaan kamu."
                    stats={[
                        { label: "Onboarding", value: "~3 menit" },
                        { label: "Rencana AI", value: "Langsung jadi" },
                    ]}
                />
            }
        />
    );
}
