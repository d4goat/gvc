"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadZone from "@/components/UploadZone";
import LoadingSpinner from "@/components/LoadingSpinner";
import ExplanationCard, { ExplanationData } from "@/components/ExplanationCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ZoomIn,
  Download,
  Volume2,
  VolumeX,
  Headphones,
  FileText
} from "lucide-react";
import { useLenis } from "@/hooks/useLenis";

type AppState = "idle" | "loading" | "result";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [explanationData, setExplanationData] = useState<ExplanationData | null>(
    null
  );

  useLenis()

  const resetState = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFileUrl("");
    setFileType("");
    setAppState("idle");
    setExplanationData(null);
    setFileName("");
  }, [fileUrl]);

  useEffect(() => {
    window.addEventListener('pahamburo:navigate-home', resetState);

    return () => {
      window.removeEventListener('pahamburo:navigate-home', resetState);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [resetState]);

  const handleToggleSpeech = () => {
    if (!explanationData) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `
      Tentang apa dokumen ini: ${explanationData.title}.
      Apa yang harus dilakukan: ${explanationData.whatToDo}.
      Poin penting yang perlu diperhatikan: ${explanationData.importantPoints.join(". ")}.
    `;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "id-ID";
    utterance.rate = 0.8
    utterance.pitch = 0.9
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleUpload = async (file: File) => {
    setFileName(file.name);
    setFileType(file.type);

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    const url = URL.createObjectURL(file);
    setFileUrl(url);

    setAppState("loading");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/simplify", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to simplify document");
      }

      const data = await res.json();
      setExplanationData(data);
      setAppState("result");
    } catch (error) {
      console.error(error);
      // Fallback in case of error
      setExplanationData({
        title: "Dokumen Simulasi (Terjadi Kesalahan Jaringan/API)",
        whatToDo:
          "Anda perlu membawa dokumen ini ke Kantor Kelurahan atau Notaris. Jangan lupa bawa KTP asli.",
        importantPoints: [
          "Ada batas waktu 30 hari untuk melapor.",
          "Pastikan ejaan nama di surat sama persis dengan yang ada di KTP Anda.",
        ],
      });
      setAppState("result");
    }
  };

  return (
    <>
      <Header />
      <main className="pt-24 flex-1">
        <AnimatePresence mode="wait">
          {appState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-20"
            >
              {/* Hero Section */}
              <section id="beranda" className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-section-padding text-center">
                <div className="max-w-3xl mx-auto">
                  <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-6">
                    Pahami Dokumen Anda dengan Mudah
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">
                    Kami hadir untuk membantu Anda memahami istilah hukum dan
                    birokrasi yang sulit dalam surat atau dokumen resmi Anda.
                    Aman, cepat, dan terpercaya.
                  </p>
                </div>

                <UploadZone onUpload={handleUpload} />
              </section>

              {/* Visual Metaphor Section */}
              <section id="tentang-kami" className="bg-surface-container-low py-section-padding">
                <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-2 gap-gutter items-center">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-primary mb-6">
                      Penjelasan yang Jelas dan Sederhana
                    </h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                      Kami menerjemahkan bahasa birokrasi yang rumit menjadi
                      kalimat yang mudah dimengerti. Bayangkan seperti memiliki
                      asisten pribadi yang selalu siap sedia membantu Anda
                      membaca surat dari kantor pemerintah.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg border border-surface-container-high">
                        <CheckCircle2 size={24} className="shrink-0" />
                        <div>
                          <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                            Tanpa Istilah Rumit
                          </h3>
                          <p className="text-on-surface-variant">
                            Penjelasan menggunakan bahasa sehari-hari yang sopan.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg border border-surface-container-high">
                        <CheckCircle2 size={24} className="shrink-0" />
                        <div>
                          <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                            Langkah Selanjutnya
                          </h3>
                          <p className="text-on-surface-variant">
                            Kami memberitahu Anda apa yang harus dilakukan
                            setelah membaca dokumen.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative rounded-xl overflow-hidden shadow-lg mt-8 md:mt-0">
                    <img
                      alt="Senior citizen using technology"
                      className="w-full h-[400px] object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDplT8liTGt6S7nMUtn6Myzi10BJFIwHGKbdlr3fOPnYfldxThmmlH_T46YVfp8tGxHGU4xPBldWJPmV5P50y6T7_mZ6kb2TWZ5OJZfyyp9c3VwLao_JslDjLnCEqT76Y75vZJRz5srPs9WaS82sbWNvqz5DDUbfqsNnOFbaHKTxDW6M85UjRMF4M8Xw6yxi-4L9Xm8VebKgk2PGRFzZJmkVXRHgbFKBTqSpyDmEQAynRKGmgZ3qqnWF3mNBhFLVXx1xiTalQ2Y4Uwk"
                    />
                    <div className="absolute inset-0 bg-primary/10"></div>
                  </div>
                </div>
              </section>

              {/* Process Stepper */}
              <section id="panduan" className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-section-padding text-center">
                <h2 className="font-headline-md text-headline-md text-primary mb-12">
                  Hanya dengan 3 Langkah Mudah
                </h2>
                <div className="grid md:grid-cols-3 gap-gutter">
                  <div className="p-8 bg-surface-container-lowest border border-surface-container rounded-xl flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline-md flex items-center justify-center mb-6">
                      1
                    </div>
                    <h3 className="font-headline-md text-headline-md mb-4 text-on-surface">
                      Unggah Foto
                    </h3>
                    <p className="font-body-md text-on-surface-variant">
                      Ambil foto dokumen Anda atau pilih file yang sudah ada.
                    </p>
                  </div>
                  <div className="p-8 bg-surface-container-lowest border border-surface-container rounded-xl flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline-md flex items-center justify-center mb-6">
                      2
                    </div>
                    <h3 className="font-headline-md text-headline-md mb-4 text-on-surface">
                      Tunggu Sebentar
                    </h3>
                    <p className="font-body-md text-on-surface-variant">
                      Sistem kami akan menganalisis isi dokumen tersebut untuk
                      Anda.
                    </p>
                  </div>
                  <div className="p-8 bg-surface-container-lowest border border-surface-container rounded-xl flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline-md flex items-center justify-center mb-6">
                      3
                    </div>
                    <h3 className="font-headline-md text-headline-md mb-4 text-on-surface">
                      Baca Penjelasan
                    </h3>
                    <p className="font-body-md text-on-surface-variant">
                      Dapatkan ringkasan poin-poin penting dalam bahasa yang
                      mudah.
                    </p>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {appState === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSpinner />
            </motion.div>
          )}

          {appState === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col md:flex-row gap-gutter"
            >
              {/* Left Side: Document Preview */}
              <section className="w-full md:w-5/12">
                <div className="bg-surface-container-lowest border border-surface-container rounded-xl overflow-hidden shadow-sm sticky top-[100px]">
                  <div className="p-4 bg-surface-container-low border-b border-surface-container flex justify-between items-center">
                    <h3 className="font-label-lg text-label-lg text-on-surface">
                      Pratinjau Dokumen
                    </h3>
                    <div className="flex gap-2">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-surface-container rounded transition-colors flex items-center justify-center"
                        title="Perbesar dokumen"
                      >
                        <ZoomIn size={20} className="text-on-surface-variant" />
                      </a>
                      <a
                        href={fileUrl}
                        download={fileName}
                        className="p-1.5 hover:bg-surface-container rounded transition-colors flex items-center justify-center"
                        title="Unduh dokumen"
                      >
                        <Download size={20} className="text-on-surface-variant" />
                      </a>
                    </div>
                  </div>
                  <div className="aspect-[1/1.4] bg-surface-container-high relative flex items-center justify-center overflow-hidden">
                    {fileType.startsWith("image/") ? (
                      <img
                        alt="Document Preview"
                        className="w-full h-full object-contain p-2 bg-white"
                        src={fileUrl}
                      />
                    ) : fileType === "application/pdf" ? (
                      <iframe
                        src={fileUrl}
                        className="w-full h-full border-none"
                        title="Document PDF Preview"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-surface-container-high p-8">
                        <FileText size={64} className="text-secondary" />
                        <span className="font-label-lg text-on-surface-variant text-center max-w-xs truncate">
                          {fileName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Right Side: Simplified Explanation */}
              <section className="w-full md:w-7/12 flex flex-col gap-6">
                <ExplanationCard
                  data={explanationData}
                  fileName={fileName}
                  onReset={resetState}
                />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-10 right-10 flex flex-col items-end gap-4 z-50">
        {appState === "result" && (
          <button
            onClick={handleToggleSpeech}
            className="flex items-center gap-3 bg-primary text-on-primary px-8 h-[64px] rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
            <span className="font-label-lg text-label-lg font-bold">
              {isSpeaking ? "Hentikan Penjelasan" : "Dengarkan Penjelasan"}
            </span>
          </button>
        )}
        <Link href="/helper" className="flex items-center justify-center bg-secondary text-primary w-[56px] h-[56px] rounded-full shadow-lg hover:bg-primary-container hover:text-secondary transition-all cursor-pointer" title="Buka Halaman Bantuan">
          <Headphones size={24} />
        </Link>
      </div>
    </>
  );
}
