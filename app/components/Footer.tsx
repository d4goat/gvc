import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low mt-16 border-t border-surface-container">
      <div className="flex flex-col md:flex-row justify-between items-center gap-gutter px-margin-mobile md:px-margin-desktop py-section-padding max-w-container-max-width mx-auto">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <div className="font-headline-md text-headline-md font-bold text-primary">
            Pakra
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs md:max-w-none text-center md:text-left">
            © 2026 Pakra - Membantu Senior Memahami Dokumen Negara
          </p>
        </div>
        <div className="flex flex-col justify-center gap-4 mt-4 md:mt-0">
          <a
            className="text-on-surface-variant font-label-lg text-label-lg hover:underline decoration-primary transition-opacity"
            href="#"
          >
            Kebijakan Privasi
          </a>
          <a
            className="text-on-surface-variant font-label-lg text-label-lg hover:underline decoration-primary transition-opacity"
            href="#"
          >
            Syarat & Ketentuan
          </a>
          <Link
            className="text-on-surface-variant font-label-lg text-label-lg hover:underline decoration-primary transition-opacity cursor-pointer"
            href="/helper"
          >
            Kontak Bantuan
          </Link>
        </div>
      </div>
    </footer>
  );
}
