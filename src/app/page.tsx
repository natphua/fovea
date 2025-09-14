"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

/* -------------------------- Reusable fade section ------------------------- */
function FadeSection({
  children,
  snap = true,
}: {
  children: React.ReactNode;
  snap?: boolean;
}) {
  return (
    <motion.section
      data-snap
      className={`${snap ? "snap-start snap-always" : ""} relative flex min-h-[100dvh] w-full items-center justify-center bg-base-100`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ scrollSnapStop: "always" }}
    >
      {children}
    </motion.section>
  );
}

/* ------------------------------- Step Card UI ------------------------------ */
function StepCard({ no, title, subtitle }: { no: number; title: string; subtitle: string }) {
  return (
    <FadeSection>
      <div className="w-full max-w-5xl px-6">
        <div className="mx-auto grid h-[70vh] grid-cols-[96px_1fr] md:grid-cols-[140px_1fr] items-center gap-8 rounded-3xl border-4 border-accent bg-base-100 px-8">
          <div className="text-[72px] md:text-[110px] leading-none font-semibold text-base-content/70 tabular-nums select-none text-center">
            {no}
          </div>
          <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left">
            <div className="text-4xl md:text-5xl font-bold mb-4 text-base-content">{title}</div>
            <p className="text-lg md:text-xl text-base-content/70">{subtitle}</p>
          </div>
        </div>
      </div>
    </FadeSection>
  );
}

/* --------------------------------- Page ---------------------------------- */
export default function Landing() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />

      {/* BODY */}
      <main className="scroll-pt-[64px]">
        {/* HERO */}
        <FadeSection>
          <div className="hero w-full bg-base-100">
            <div className="hero-content text-center max-w-4xl">
              <div>
                <div className="flex justify-center mb-8">
                  <img src="/fovea.svg" alt="Fovea Logo" className="h-20 w-auto" />
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-base-content leading-tight mb-8">
                  Understand Your{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">Focus</span>
                    <span className="absolute left-0 right-0 bottom-1 h-1 bg-primary rounded-full" />
                  </span>
                  ,<br />
                  Improve Your{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">Learning</span>
                    <span className="absolute left-0 right-0 bottom-1 h-1 bg-primary rounded-full" />
                  </span>
                </h1>

                <div className="mt-8">
                  <button
                    onClick={() => router.push("/media-selection")}
                    className="btn btn-primary btn-lg px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Start a Session
                  </button>
                </div>

                <p className="mt-6 text-base-content/60">
                  Privacy-first • Research-backed • ADHD-friendly
                </p>
              </div>
            </div>
          </div>
        </FadeSection>

        {/* Features Intro */}
        <div className="bg-base-200 py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">How Fovea Works</h2>
              <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                Our advanced technology measures your focus patterns to help you optimize your learning sessions
              </p>
            </div>
          </div>
        </div>

        {/* STEPS */}
        <StepCard no={1} title="Upload" subtitle="Add your PDF or video" />
        <StepCard no={2} title="Study" subtitle="Read or watch as usual" />
        <StepCard no={3} title="Stay Focused" subtitle="Get real-time assistance" />
        <StepCard no={4} title="Improve" subtitle="See insights and recommendations" />

        {/* FINAL CTA */}
        <FadeSection snap={false}>
          <div className="w-full bg-primary py-24 px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-base-content">
                You’re all set!
              </h2>
              <p className="text-lg md:text-xl mb-8 text-base-content/70">
                Upload your material and discover how focused you really are.
              </p>
              <button
                onClick={() => router.push("/media-selection")}
                className="btn btn-primary btn-lg px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Start a Session
              </button>
            </div>
          </div>
        </FadeSection>

        {/* FOOTER */}
        <footer className="snap-end bg-base-200 py-10 text-center">
          <p className="text-sm text-base-content/60">© 2024 Fovea — All rights reserved</p>
        </footer>
      </main>
    </div>
  );
}