"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner({ message = "Menganalisis dokumen..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-6 min-h-[50vh]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="w-16 h-16 border-4 border-surface-container-highest border-t-primary rounded-full"
        aria-label="Loading spinner"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          repeat: Infinity,
          duration: 2,
          repeatType: "reverse",
        }}
        className="font-headline-md text-headline-md text-primary"
      >
        {message}
      </motion.p>
      <p className="font-body-md text-on-surface-variant text-center max-w-md">
        Harap tunggu sebentar, AI kami sedang membaca dan menyederhanakan bahasa birokrasi dalam dokumen Anda.
      </p>
    </div>
  );
}
