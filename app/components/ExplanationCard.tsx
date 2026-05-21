import { motion } from "framer-motion";
import { CheckCircle2, Info, Upload } from "lucide-react";

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

export default function ExplanationCard({
  data,
  fileName = "Dokumen",
  onReset,
}: ExplanationCardProps) {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col gap-6"
    >
      <div className="flex flex-col gap-3 bg-surface-container py-4 px-margin-mobile md:px-margin-desktop -mx-margin-mobile md:-mx-margin-desktop mb-4">
        <div className="flex items-center justify-between gap-4">
        <span className="font-label-lg text-label-lg  flex items-center gap-2">
          <CheckCircle2 size={20} className="" />
          Analisis AI Selesai
        </span>
          <button
            onClick={onReset}
            className="hover:text-primary font-label-lg text-label-lg cursor-pointer flex gap-3 items-center bg-primary hover:bg-secondary-container text-white p-2 transition-colors duration-200 rounded-md"
          >
            Unggah Lain
            <Upload></Upload>
          </button>
        </div>
          <span className="font-label-lg text-label-lg text-on-surface-variant hidden md:inline">
            Dokumen: {fileName}
          </span>
      </div>

      <div className="bg-surface-container-lowest border border-surface-container p-8 rounded-xl shadow-sm">
        <header className="mb-8">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">
            Penjelasan Sederhana
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Kami telah merangkum dokumen Anda ke dalam bahasa yang lebih mudah
            dipahami.
          </p>
        </header>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex gap-6">
            <div className="shrink-0 w-12 h-12 bg-primary-container text-secondary flex items-center justify-center rounded-full font-headline-md text-headline-md font-bold">
              1
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                Tentang Apa Dokumen Ini?
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                {data.title}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6">
            <div className="shrink-0 w-12 h-12 bg-primary-container text-secondary flex items-center justify-center rounded-full font-headline-md text-headline-md font-bold">
              2
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                Apa yang Harus Dilakukan?
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                {data.whatToDo}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6">
            <div className="shrink-0 w-12 h-12 bg-primary-container text-secondary flex items-center justify-center rounded-full font-headline-md text-headline-md font-bold">
              3
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                Poin Penting
              </h2>
              <ul className="list-disc ml-5 font-body-lg text-body-lg text-on-surface-variant space-y-3 mt-4">
                {data.importantPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-surface-container rounded-xl border border-outline-variant/30 flex items-start gap-4">
          <Info size={32} className="shrink-0" />
          <div>
            <p className="font-label-lg text-label-lg mb-1 font-bold">
              Masih Bingung?
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Anda bisa menanyakan bagian yang kurang jelas kepada asisten
              digital kami di pojok kanan bawah.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
