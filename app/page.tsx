// app/get-started/page.tsx (atau path onboarding kamu)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import PageContainer from "@/components/ui/PageContainer";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((m) => m.Player),
  { ssr: false },
);

type Slide = {
  id: number;
  lottieSrc: string;
  title: string;
  highlight: string;
  description: string;
};

const slides: Slide[] = [
  {
    id: 1,
    lottieSrc: "/lottie/slide1.json",
    title: "Welcome",
    highlight: "Fitcare",
    description:
      "Track every workout and meal in one place, built around your body's real progress.",
  },
  {
    id: 2,
    lottieSrc: "/lottie/slide2.json",
    title: "Train with",
    highlight: "your coach",
    description:
      "Get a plan that adjusts to how you're actually doing, not a generic routine.",
  },
  {
    id: 3,
    lottieSrc: "/lottie/slide3.json",
    title: "See your",
    highlight: "progress",
    description:
      "Watch your strength, weight, and habits change over weeks, not just days.",
  },
];

export default function GetStartedPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;
  const current = slides[index];

  function handleNext() {
    if (isLast) {
      router.push("/login");
      return;
    }
    setIndex((i) => Math.min(i + 1, slides.length - 1));
  }

  return (
    <PageContainer className="min-h-0 h-dvh overflow-hidden">
      <section className="relative flex h-[58vh] shrink-0 items-center justify-center overflow-hidden rounded-br-[100px] bg-orange-100">
        <Player
          key={current.id}
          autoplay
          loop
          src={current.lottieSrc}
          style={{
            width: 320,
            height: 320,
          }}
        />
      </section>

      <div className="flex flex-1 flex-col justify-center px-6 pb-6 pt-2">
        {/* Dots */}
        <div className="mb-5 flex items-center justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-orange" : "w-2 bg-orange/25"
                }`}
            />
          ))}
        </div>

        <h1 className="mb-1.5 text-center font-display text-[24px] font-bold leading-tight tracking-tight sm:text-[26px]">
          {current.title} <span className="text-orange-deep">{current.highlight}</span>
        </h1>
        <p className="mb-6 text-center text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
          {current.description}
        </p>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleNext}
            aria-label={isLast ? "Get started" : "Next slide"}
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-orange text-white shadow-md transition hover:bg-orange-deep"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="text-[13px] font-semibold text-ink-soft">
            {isLast ? "Get Started" : "Next"}
          </span>
        </div>
      </div>
    </PageContainer>
  );
}