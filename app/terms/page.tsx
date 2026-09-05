import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
    title: "Terms & Conditions",
};

const sections: { heading: string; body: string[] }[] = [
    {
        heading: "1. Acceptance of Terms",
        body: [
            "By creating an account or using the FitnessAI service, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use the service.",
        ],
    },
    {
        heading: "2. Description of Service",
        body: [
            "FitnessAI provides personalized fitness planning, workout and meal tracking, and progress insights. The service is intended for general fitness guidance and does not replace professional medical advice.",
        ],
    },
    {
        heading: "3. Account Responsibilities",
        body: [
            "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to provide accurate information and to keep your profile up to date.",
        ],
    },
    {
        heading: "4. Acceptable Use",
        body: [
            "You agree not to misuse the service, including attempts to disrupt the platform, access other users' accounts, or use the service for any unlawful purpose.",
        ],
    },
    {
        heading: "5. Health Disclaimer",
        body: [
            "The service provides fitness guidance based on the information you provide. Consult a qualified professional before beginning any exercise or nutrition program, especially if you have a medical condition.",
        ],
    },
    {
        heading: "6. Privacy",
        body: [
            "Your privacy matters to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.",
        ],
    },
    {
        heading: "7. Changes to the Service",
        body: [
            "We may update, modify, or discontinue features of the service at any time. We may also revise these Terms & Conditions; continued use of the service after changes take effect constitutes acceptance of the updated terms.",
        ],
    },
    {
        heading: "8. Termination",
        body: [
            "We may suspend or terminate your access to the service if you violate these Terms & Conditions or if required by law. You may stop using the service at any time.",
        ],
    },
    {
        heading: "9. Contact",
        body: [
            "If you have questions about these Terms & Conditions, please contact our support team.",
        ],
    },
];

export default function TermsPage() {
    return (
        <LegalPage title="Terms & Conditions" updated="August 2026">
            {sections.map((section) => (
                <section key={section.heading} className="rounded-2xl border border-line bg-card p-5">
                    <h2 className="mb-2.5 font-display text-base font-bold text-ink">{section.heading}</h2>
                    {section.body.map((paragraph) => (
                        <p key={paragraph} className="text-sm leading-relaxed text-ink-soft">
                            {paragraph}
                        </p>
                    ))}
                </section>
            ))}
        </LegalPage>
    );
}
