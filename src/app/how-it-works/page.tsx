"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { FileText, PlayCircle, Zap, BarChart } from "lucide-react";

function StepCard({
  icon: Icon,
  title,
  description,
  color = "primary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group relative bg-base-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 hover:border-primary/30"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-base-content mb-2">{title}</h3>
          <p className="text-base-content/70 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-base-content mb-6">
                How <span className="text-primary">Fovea</span> Works
              </h1>
              <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-8">
                Fovea guides you through a seamless focus training experience, from uploading your content to reviewing your personalized analytics.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 px-6 bg-base-200">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <StepCard
              icon={FileText}
              color="blue"
              title="Upload Your Content"
              description="Choose a PDF document or video file to begin your focus training session."
            />
            <StepCard
              icon={PlayCircle}
              color="green"
              title="Begin Your Study Session"
              description="Start reading your document or watching your video as you normally would."
            />
            <StepCard
              icon={Zap}
              color="purple"
              title="Experience Real-Time Focus Assistance"
              description="Our app provides live, adaptive changes to help maintain your concentration and boost comprehension as you engage with the content."
            />
            <StepCard
              icon={BarChart}
              color="orange"
              title="Review Your Focus Performance"
              description="After your session, access detailed analytics showing your focus patterns and receive personalized recommendations to improve your concentration skills."
            />
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80"></div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Ready to <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Train Your Focus?</span>
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Start your first session and discover how focused you really are.
            </motion.p>
            <motion.button
              onClick={() => router.push("/session")}
              className="group relative inline-flex items-center gap-3 bg-white text-primary font-bold text-lg px-10 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start a Session
            </motion.button>
          </div>
        </section>
      </main>
    </div>
  );
}