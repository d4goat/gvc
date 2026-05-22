import { motion, type Variants } from "framer-motion";
import { CheckCircle2, Upload, FileText, Bookmark, CheckSquare, Lightbulb } from "lucide-react";

export interface ExplanationData {
  title: string;
  whatToDo: string;
  importantPoints: string[];
}

interface ExplanationCardProps {
  data: ExplanationData | null;
  fileName?: string;
  onReset: () => void;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const steps = [
  {
    num: 1,
    icon: FileText,
    label: "Tentang apa dokumen ini?",
    key: "title" as const,
  },
  {
    num: 2,
    icon: CheckSquare,
    label: "Apa yang harus dilakukan?",
    key: "whatToDo" as const,
  },
];

export default function ExplanationCard({
  data,
  fileName = "Dokumen",
  onReset,
}: ExplanationCardProps) {
  if (!data) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 w-full"
    >
      {/* Status Bar */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-lg bg-success-container border border-success-container-high"
      >
        <span className="flex items-center gap-2 text-label-md text-success font-medium">
          <CheckCircle2 size={17} strokeWidth={2.5} />
          Analisis AI selesai
        </span>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-label-sm px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary/85 transition-colors duration-150 cursor-pointer"
        >
          <Upload size={14} strokeWidth={2.5} />
          Unggah lain
        </button>
      </motion.div>

      {/* Main Card */}
      <motion.div
        variants={itemVariants}
        className="bg-surface-container-lowest border border-surface-container rounded-xl overflow-hidden shadow-sm"
      >
        {/* Header */}
        <div className="px-7 pt-7 pb-6 bg-primary-container/30 border-b border-surface-container">
          <p className="text-label-sm text-primary font-medium uppercase tracking-widest mb-2">
            Ringkasan Dokumen
          </p>
          <h1 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
            Penjelasan Sederhana
          </h1>
          <p className="text-body-sm text-on-surface-variant mt-1.5">
            Kami telah merangkum{" "}
            <span className="text-on-surface font-medium">{fileName}</span> ke
            dalam bahasa yang lebih mudah dipahami.
          </p>
        </div>

        {/* Steps */}
        <div className="px-7 py-6 flex flex-col">
          {steps.map(({ num, icon: Icon, label, key }, idx) => (
            <motion.div
              key={num}
              variants={itemVariants}
              className="flex gap-5 relative pb-6"
            >
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="absolute left-[16px] top-[36px] bottom-0 w-px bg-surface-container-high" />
              )}

              {/* Step number */}
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-label-sm font-bold z-10 ring-4 ring-primary-container/60">
                {num}
              </div>

              {/* Content */}
              <div className="flex-1 pt-0.5">
                <h2 className="flex items-center gap-2 font-title-md text-title-md text-on-surface mb-2">
                  <Icon size={16} className="text-primary/70 shrink-0" />
                  {label}
                </h2>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {data[key]}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Step 3: Important Points */}
          <motion.div variants={itemVariants} className="flex gap-5">
            <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-label-sm font-bold z-10 ring-4 ring-primary-container/60">
              3
            </div>
            <div className="flex-1 pt-0.5">
              <h2 className="flex items-center gap-2 font-title-md text-title-md text-on-surface mb-3">
                <Bookmark size={16} className="text-primary/70 shrink-0" />
                Poin penting
              </h2>
              <ul className="flex flex-col gap-2.5">
                {data.importantPoints.map((point, i) => (
                  <motion.li
                    key={i}
                    variants={itemVariants}
                    className="flex items-start gap-3 px-3.5 py-3 bg-surface-container rounded-lg border border-surface-container-high text-body-sm text-on-surface-variant leading-relaxed"
                  >
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                    {point}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Footer hint */}
        <motion.div
          variants={itemVariants}
          className="mx-7 mb-7 flex gap-3.5 items-start p-4 bg-tertiary-container/30 border border-tertiary-container rounded-xl"
        >
          <Lightbulb size={20} className="text-tertiary shrink-0 mt-0.5" />
          <div>
            <p className="text-label-md font-semibold text-on-surface mb-0.5">
              Masih bingung?
            </p>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Tanyakan bagian yang kurang jelas kepada asisten digital kami di
              pojok kanan bawah layar.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}