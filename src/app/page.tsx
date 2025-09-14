"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

/* -------------------------- Regular fade section ------------------------- */
function FadeSection({
  children,
  snap = true,
}: {
  children: React.ReactNode;
  snap?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    amount: 0.6,
    margin: "0px 0px -10% 0px",
  });

  const variants = {
    hidden: { opacity: 0, y: 100, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.section
      ref={ref}
      data-snap
      className={`${snap ? "snap-start snap-always" : ""
        } relative flex min-h-[100dvh] w-full items-center justify-center bg-base-100`}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ scrollSnapStop: "always" }}
    >
      {children}
    </motion.section>
  );
}

/* ------------------------------- Step Card UI ------------------------------ */
function StepCard({
  no,
  title,
  subtitle,
  iconFile,
  iconPosition,
}: {
  no: number;
  title: string;
  subtitle: string;
  iconFile: string;
  iconPosition?: string;
}) {
  return (
    <FadeSection>
      <div className="w-full max-w-5xl px-6">
        <div className="relative mx-auto grid h-[70vh] grid-cols-[96px_1fr] md:grid-cols-[140px_1fr] items-center gap-8 rounded-3xl border-4 border-accent bg-base-100 px-8 overflow-hidden">
          {/* Step number */}
          <div className="text-[72px] md:text-[110px] font-semibold text-base-content/70 tabular-nums select-none text-center">
            {no}
          </div>

          {/* Right column */}
          <div className="relative flex w-full items-center">
            <div className="z-10 flex-1 pr-28 md:pr-40 lg:pr-52 text-center md:text-left">
              <div className="text-4xl md:text-5xl font-bold mb-4 text-base-content">
                {title}
              </div>
              <p className="text-lg md:text-xl text-base-content/70">{subtitle}</p>
            </div>

            {/* Big icon with custom position */}
            <div
              className={`pointer-events-none absolute inset-y-0 flex items-center justify-center ${iconPosition || "right-24 md:right-36 lg:right-48"
                }`}
            >
              <img
                src={`/${iconFile}`}
                alt={title}
                className="w-28 h-28 md:w-40 md:h-40 lg:w-56 lg:h-56 invert brightness-200"
              />
            </div>
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
    <div className="min-h-screen bg-base-100 scroll-smooth">
      <NavBar />

      <main className="scroll-pt-[64px]">
        {/* HERO */}
        <FadeSection>
          <div className="hero w-full bg-base-100">
            <div className="hero-content text-center max-w-4xl">
              <div>
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

        {/* STEPS */}
        <StepCard
          no={1}
          title="Upload"
          subtitle="Add your PDF or video"
          iconFile="upload.svg"
          iconPosition="right-16 md:right-28 lg:right-40"
        />
        <StepCard
          no={2}
          title="Study"
          subtitle="Read or watch as usual"
          iconFile="study.svg"
          iconPosition="right-10 md:right-22 lg:right-34"
        />
        <StepCard
          no={3}
          title="Stay Focused"
          subtitle="Get real-time assistance"
          iconFile="focus.svg"
          iconPosition="right-4 md:right-16 lg:right-28"
        />
        <StepCard
          no={4}
          title="Improve"
          subtitle="See insights and recommendations"
          iconFile="improve.svg"
          iconPosition="right-0 md:right-4 lg:right-22"
        />

        {/* FOOTER */}
        <footer className="snap-end bg-base-200 py-10 text-center">
          <p className="text-sm text-base-content/60">
            © 2024 Fovea — All rights reserved
          </p>
        </footer>
      </main>
    </div>
  );
}