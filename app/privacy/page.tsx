import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
    title: "Privacy Policy",
};

const sections: { heading: string; body: string[] }[] = [
    {
        heading: "1. Information We Collect",
        body: [
            "We collect information you provide directly, such as your name, email address, and profile details like date of birth, gender, height, weight, fitness goals, dietary preferences, and medical conditions you choose to share.",
            "We also collect data you generate while using the service, including workout schedules, meal logs, weight logs, and check-in history.",
        ],
    },
    {
        heading: "2. How We Use Your Information",
        body: [
            "We use your information to personalize your fitness plan, track your progress, improve the service, and provide customer support.",
            "Your profile and activity data are used to generate AI-driven recommendations tailored to your goals.",
        ],
    },
    {
        heading: "3. Sharing of Information",
        body: [
            "We do not sell your personal information. We only share your data with trusted service providers who help us operate the platform, and only to the extent necessary to provide the service.",
        ],
    },
    {
        heading: "4. Data Security",
        body: [
            "We take reasonable measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is completely secure.",
        ],
    },
    {
        heading: "5. Data Retention",
        body: [
            "We retain your personal information for as long as your account is active or as needed to provide the service. You may request deletion of your data at any time.",
        ],
    },
    {
        heading: "6. Your Rights",
        body: [
            "You may access, update, or correct your personal information through your account settings. You may also request access to, correction of, or deletion of your personal data by contacting us.",
        ],
    },
    {
        heading: "7. Cookies",
        body: [
            "We use cookies and similar technologies to keep you signed in and to remember your preferences. You can control cookies through your browser settings.",
        ],
    },
    {
        heading: "8. Changes to This Policy",
        body: [
            "We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the date on this page or through the service.",
        ],
    },
    {
        heading: "9. Contact",
        body: [
            "If you have questions about this Privacy Policy or how we handle your data, please contact our support team.",
        ],
    },
];

export default function PrivacyPage() {
    return (
        <LegalPage title="Privacy Policy" updated="August 2026">
            {sections.map((section) => (
                <section key={section.heading} className="rounded-2xl border border-line bg-white p-5">
                    <h2 className="mb-2.5 font-display text-base font-bold text-ink">{section.heading}</h2>
                    {section.body.map((paragraph) => (
                        <p key={paragraph} className="mb-3 text-sm leading-relaxed text-ink-soft last:mb-0">
                            {paragraph}
                        </p>
                    ))}
                </section>
            ))}
        </LegalPage>
    );
}
