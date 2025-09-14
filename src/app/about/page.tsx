"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { 
  Fish, 
  Smartphone, 
  Brain, 
  GraduationCap, 
  Heart, 
  Briefcase, 
  Eye, 
  Zap, 
  EyeIcon, 
  Search, 
  Flame, 
  RotateCcw 
} from "lucide-react";

/* -------------------------- Animated Counter ------------------------- */
function AnimatedCounter({ 
  end, 
  duration = 2, 
  suffix = "", 
  prefix = "" 
}: { 
  end: number; 
  duration?: number; 
  suffix?: string; 
  prefix?: string; 
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  return (
    <span ref={ref} className="font-bold text-primary">
      {prefix}{count}{suffix}
    </span>
  );
}

/* -------------------------- Stat Card ------------------------- */
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = "primary" 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: React.ComponentType<{ className?: string }>; 
  color?: string; 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group relative overflow-hidden bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300"
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-${color}-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-base-content">{title}</h3>
        </div>
        
        <div className={`text-3xl font-bold text-${color}-600 mb-2`}>
          {value}
        </div>
        
        <p className="text-base-content/70 text-sm">{subtitle}</p>
      </div>
    </motion.div>
  );
}

/* -------------------------- Timeline Item ------------------------- */
function TimelineItem({ 
  year, 
  generation, 
  attentionSpan, 
  description, 
  severity = "normal" 
}: { 
  year: string; 
  generation: string; 
  attentionSpan: string; 
  description: string; 
  severity?: "good" | "warning" | "critical"; 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const severityClasses = {
    good: "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg",
    warning: "bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 shadow-lg", 
    critical: "bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 shadow-lg",
    normal: "bg-base-100 border border-base-300 hover:shadow-md"
  };

  const dotColors = {
    good: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500", 
    normal: "bg-base-300"
  };

  const textColors = {
    good: "text-green-900",
    warning: "text-yellow-900",
    critical: "text-red-900",
    normal: "text-primary"
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative flex items-center gap-6 p-6 rounded-xl transition-all duration-300 ${
        severityClasses[severity]
      }`}
    >
      {/* Timeline dot */}
      <div className={`w-4 h-4 rounded-full ${
        dotColors[severity]
      } flex-shrink-0`}></div>
      
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-2xl font-bold text-gray-900">{year}</span>
          <span className="text-lg font-semibold text-gray-900">{generation}</span>
          <span className={`text-xl font-bold ${
            textColors[severity]
          }`}>
            {attentionSpan}
          </span>
        </div>
        <p className="text-gray-800">{description}</p>
      </div>
    </motion.div>
  );
}

/* -------------------------- Metric Card ------------------------- */
function MetricCard({ 
  title, 
  description, 
  icon: Icon, 
  color = "blue" 
}: { 
  title: string; 
  description: string; 
  icon: React.ComponentType<{ className?: string }>; 
  color?: string; 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    red: "from-red-500 to-red-600"
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group relative bg-base-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 hover:border-primary/30"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center flex-shrink-0`}>
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

/* -------------------------- Main Page ------------------------- */
export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-base-content mb-6">
                The <span className="text-primary">Focus</span> Crisis
              </h1>
              <p className="text-xl text-base-content/70 max-w-3xl mx-auto mb-8">
                Human attention spans are shrinking faster than ever. We're building tools to understand, measure, and improve focus in our digital age.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Attention Span Decline */}
        <section className="py-16 px-6 bg-base-200">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-base-content mb-4">
                The Shrinking Attention Span
              </h2>
              <p className="text-lg text-base-content/70">
                From <b>12</b> seconds to <b>8</b> seconds in just 23 years
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="space-y-4">
              <TimelineItem
                year="2000"
                generation="Millennials"
                attentionSpan="12s"
                description="Average attention span at the turn of the millennium"
                severity="good"
              />
              <TimelineItem
                year="2023"
                generation="Gen Z"
                attentionSpan="8.25s"
                description="Shorter than a goldfish (9s) - the digital native generation"
                severity="warning"
              />
              <TimelineItem
                year="Present"
                generation="Gen Alpha"
                attentionSpan="<8s"
                description="Born into social media, even shorter attention spans"
                severity="critical"
              />
            </div>
          </div>
        </section>

        {/* Key Statistics */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-base-content mb-4">
                The Numbers Don't Lie
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Gen Z Focus"
                value="8.25s"
                subtitle="Shorter than a goldfish (9s)"
                icon={Fish}
                color="red"
              />
              <StatCard
                title="Daily Screen Time"
                value="7.5h"
                subtitle="Average for teens on electronic devices"
                icon={Smartphone}
                color="blue"
              />
              <StatCard
                title="ADHD Impact"
                value="6.1M"
                subtitle="Children diagnosed with ADHD in the US"
                icon={Brain}
                color="purple"
              />
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="py-16 px-6 bg-base-200">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-base-content mb-4">
                Why Focus Matters
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-base-content mb-3">Education</h3>
                <p className="text-base-content/70">
                  Shorter attention spans directly affect learning retention. Early identification helps educators design more engaging content.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-base-content mb-3">Mental Health</h3>
                <p className="text-base-content/70">
                  Lower focus integrity increases risk of anxiety, depression, and ADHD. Early warning systems can provide timely intervention.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-base-content mb-3">Workplace</h3>
                <p className="text-base-content/70">
                  Shorter attention increases errors and reduces productivity. Optimizing tasks and environments leads to better performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative py-20 px-6 overflow-hidden">
          {/* Dynamic Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {/* Floating Circles */}
            <motion.div
              className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-32 right-20 w-16 h-16 bg-white/15 rounded-full"
              animate={{
                y: [0, 15, 0],
                x: [0, -15, 0],
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div
              className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/20 rounded-full"
              animate={{
                y: [0, -25, 0],
                x: [0, 20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            <motion.div
              className="absolute bottom-32 right-1/3 w-14 h-14 bg-white/12 rounded-full"
              animate={{
                y: [0, 18, 0],
                x: [0, -12, 0],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            {/* Floating Dots Pattern */}
            <div className="absolute inset-0 opacity-20">
              {[
                { left: 10, top: 20, delay: 0, duration: 3 },
                { left: 85, top: 15, delay: 0.5, duration: 4 },
                { left: 25, top: 60, delay: 1, duration: 3.5 },
                { left: 70, top: 45, delay: 1.5, duration: 4.5 },
                { left: 15, top: 80, delay: 2, duration: 3.2 },
                { left: 90, top: 75, delay: 0.8, duration: 4.2 },
                { left: 45, top: 25, delay: 1.2, duration: 3.8 },
                { left: 60, top: 85, delay: 1.8, duration: 4.8 },
                { left: 35, top: 40, delay: 0.3, duration: 3.3 },
                { left: 80, top: 30, delay: 1.3, duration: 4.3 },
                { left: 20, top: 50, delay: 0.7, duration: 3.7 },
                { left: 75, top: 65, delay: 1.7, duration: 4.7 },
                { left: 50, top: 10, delay: 0.2, duration: 3.2 },
                { left: 30, top: 90, delay: 1.4, duration: 4.4 },
                { left: 65, top: 35, delay: 0.9, duration: 3.9 },
                { left: 40, top: 70, delay: 1.6, duration: 4.6 },
                { left: 55, top: 55, delay: 0.4, duration: 3.4 },
                { left: 85, top: 25, delay: 1.1, duration: 4.1 },
                { left: 25, top: 35, delay: 0.6, duration: 3.6 },
                { left: 70, top: 80, delay: 1.9, duration: 4.9 }
              ].map((dot, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${dot.left}%`,
                    top: `${dot.top}%`,
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: dot.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: dot.delay,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Animated Title */}
              <motion.h2 
                className="text-4xl md:text-6xl font-bold text-white mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Ready to{" "}
                <motion.span
                  className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  Understand
                </motion.span>{" "}
                Your Focus?
              </motion.h2>
              
              {/* Animated Subtitle */}
              <motion.p 
                className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Join thousands of users who are already{" "}
                <span className="font-semibold text-yellow-300">measuring</span> and{" "}
                <span className="font-semibold text-orange-300">improving</span> their attention spans
              </motion.p>
              
              {/* Enhanced CTA Button */}
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
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
                
                <span className="hover:cursor-pointer">Start Measuring Focus</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.div>
              </motion.button>
              
              {/* Trust Indicators */}
              <motion.div 
                className="mt-8 flex flex-wrap justify-center items-center gap-6 text-white/70"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Privacy-First</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Research-Backed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>User-Focused</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}