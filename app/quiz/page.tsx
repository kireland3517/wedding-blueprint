"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QUIZ_QUESTIONS } from "@/lib/quiz-questions";
import type { AxisVector } from "@/lib/types";

const TOTAL = QUIZ_QUESTIONS.length;

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<AxisVector>>({});
  const [direction, setDirection] = useState<1 | -1>(1);

  const question = QUIZ_QUESTIONS[step];

  function handleSelect(value: string) {
    const axis = question.axis;
    const parsed = axis === "formality" ? (parseInt(value) as 1 | 2 | 3 | 4 | 5) : value;
    const next = { ...answers, [axis]: parsed };
    setAnswers(next);

    if (step < TOTAL - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      // All answered — serialize and navigate
      const params = new URLSearchParams();
      Object.entries(next).forEach(([k, v]) => params.set(k, String(v)));
      router.push(`/blueprint?${params.toString()}`);
    }
  }

  function handleBack() {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  }

  const current = answers[question.axis];
  const progress = ((step) / TOTAL) * 100;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--background)" }}
    >
      {/* Progress bar */}
      <div
        className="h-px w-full"
        style={{ background: "var(--border)" }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, background: "var(--foreground)" }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5">
        <button
          onClick={handleBack}
          className="text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-50"
          style={{
            color: "var(--muted)",
            fontFamily: "Arial, sans-serif",
            visibility: step > 0 ? "visible" : "hidden",
          }}
        >
          ← Back
        </button>
        <span
          className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
        >
          {step + 1} / {TOTAL}
        </span>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="w-full max-w-lg"
          >
            {/* Question heading */}
            <h2
              className="text-3xl font-normal mb-3 text-center"
              style={{ fontFamily: "Georgia, serif", color: "var(--foreground)" }}
            >
              {question.heading}
            </h2>
            <p
              className="text-center mb-10 text-sm leading-relaxed"
              style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
            >
              {question.subheading}
            </p>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {question.options.map((opt) => {
                const isSelected = String(current) === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className="w-full text-left px-6 py-5 transition-all duration-150"
                    style={{
                      border: isSelected
                        ? "1.5px solid var(--foreground)"
                        : "1.5px solid var(--border)",
                      background: isSelected ? "var(--foreground)" : "transparent",
                      color: isSelected ? "var(--background)" : "var(--foreground)",
                    }}
                  >
                    <div
                      className="font-medium mb-1"
                      style={{ fontFamily: "Georgia, serif", fontSize: "1rem" }}
                    >
                      {opt.label}
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        fontFamily: "Arial, sans-serif",
                        color: isSelected ? "rgba(255,255,255,0.7)" : "var(--muted)",
                      }}
                    >
                      {opt.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
