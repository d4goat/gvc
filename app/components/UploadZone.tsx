"use client";

import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, ShieldCheck } from "lucide-react";

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="max-w-3xl mx-auto mt-8"
    >
      <div
        {...getRootProps()}
        className={`bg-surface-container-lowest border-2 border-dashed rounded-xl p-12 md:p-20 flex flex-col items-center justify-center gap-6 cursor-pointer group transition-colors ${isDragActive
          ? "border-primary bg-secondary-container"
          : "border-outline-variant hover:bg-secondary-container"
          }`}
        aria-label="Upload document area"
      >
        <input {...getInputProps()} aria-label="File upload input" />
        <div className="bg-secondary-container p-4 text-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <Upload size={32} />
        </div>
        <div className="text-center">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
            Tarik & Lepas Dokumen
          </h2>
          <p className="font-body-md text-on-surface-variant">
            atau klik untuk memilih file PDF atau Gambar (JPG/PNG)
          </p>
        </div>
        <div
          className="bg-primary text-on-primary h-[56px] px-10 rounded-lg font-label-lg text-label-lg shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center"
        >
          Pilih Dokumen Sekarang
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant">
        <ShieldCheck size={20} className="text-secondary" />
        <p className="font-label-lg text-label-lg">
          Data Anda aman dan tidak disimpan secara permanen
        </p>
      </div>
    </motion.div>
  );
}
