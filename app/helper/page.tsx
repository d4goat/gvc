'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, HelpCircle, ArrowLeft, Trash2 } from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'
import { useLenis } from '../hooks/useLenis'
interface Message {
  role: 'user' | 'assistant'
  content: string
}

const FAQ_LIST = [
  {
    question: "Apa itu Pakra?",
    answer: "Pakra adalah alat bantu berbasis kecerdasan buatan (AI) untuk menyederhanakan bahasa dokumen birokrasi, hukum, dan surat resmi pemerintah yang rumit ke dalam bahasa sehari-hari yang mudah dipahami."
  },
  {
    question: "Bagaimana cara kerja penyederhanaan?",
    answer: "Cukup masuk ke halaman Beranda, lalu unggah file foto (JPG/PNG) atau PDF dokumen Anda. AI akan menganalisis tulisan di dalamnya secara instan dan memberikan ringkasan mengenai: Tentang Apa Dokumen Tersebut, Langkah Selanjutnya, dan Poin-Poin Penting."
  },
  {
    question: "Apakah berkas saya aman?",
    answer: "Ya, keamanan Anda adalah prioritas utama kami. Berkas dokumen yang Anda unggah hanya diproses sementara di memori server untuk dianalisis oleh AI, dan segera dihapus secara otomatis tanpa disimpan secara permanen."
  },
  {
    question: "Bagaimana jika terjadi error 500?",
    answer: "Error 500 biasanya disebabkan oleh ukuran file terlalu besar (di atas 5MB) atau API Key Gemini belum dikonfigurasi. Pastikan juga file yang Anda unggah berupa file PDF, JPG, atau PNG dengan tulisan yang terbaca jelas."
  },
  {
    question: "Apakah ada fitur pembaca suara?",
    answer: "Tentu! Setelah dokumen selesai dianalisis, akan muncul tombol mengapung berwarna biru berlogo speaker di pojok kanan bawah bertuliskan 'Dengarkan Penjelasan'. Klik tombol tersebut untuk mendengar asisten suara membacakannya."
  }
]

const QUICK_PROMPTS = [
  "Bagaimana cara mengunggah dokumen?",
  "Apakah dokumen saya aman di sini?",
  "Berkas apa saja yang didukung?",
  "Mengapa muncul error 500 saat unggah?"
]

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  // Scroll to bottom on new messages
  useEffect(() => {
    const container = chatContainerRef.current

    if(!container) return
    container.scrollTo({top: container.scrollHeight, behavior: 'smooth'})
  }, [messages, isLoading])

  useEffect(() => {
    const container = chatContainerRef.current
    if(!container)return

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation()
    }

    container.addEventListener('wheel', handleWheel, { passive: true })
    return () => container.removeEventListener('wheel', handleWheel)
  })


  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return

    const userMsg: Message = { role: 'user', content: textToSend }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!response.ok) {
        throw new Error('Gagal menghubungi asisten')
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.text }])
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Maaf, sepertinya ada gangguan koneksi. Harap coba lagi beberapa saat lagi.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
      <main className="pt-24 flex-1 bg-background min-h-screen pb-12">
        <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8">
          
          {/* Back Button */}
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 shadow-md p-3 rounded-md bg-white text-primary hover:bg-primary hover:text-white font-label-lg text-label-lg transition-colors duration-300 cursor-pointer"
            >
              <ArrowLeft size={16} />
              Kembali ke Beranda
            </Link>
          </div>

          <div className="text-center md:text-left mb-8">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">
              Pusat Bantuan & Layanan Tanya Jawab
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
              Kami siap membantu Anda memahami cara menggunakan Pakra. Silakan cari jawaban di FAQ atau mulailah obrolan langsung dengan asisten AI kami di bawah ini.
            </p>
          </div>

          {/* Two Columns Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            
            {/* Left Column: FAQ Accordion */}
            <section className="lg:col-span-4 flex flex-col gap-4">
              <h2 className="font-headline-md text-headline-md text-primary mb-2 flex items-center gap-2">
                <HelpCircle size={24} />
                Pertanyaan Populer
              </h2>
                  <Accordion
                    type='single'
                    collapsible
                    className="flex flex-col gap-4"
                  >
                {FAQ_LIST.map((faq, index) => (
                    <AccordionItem key={index} className='p-2.5 border hover:border-black transition-colors duration-300 ease-in-out rounded-md' value={faq.question}>
                        <AccordionTrigger className='hover:no-underline font-semibold text-lg'>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>            
                </section>

            {/* Right Column: AI Chat Panel */}
            <section className="lg:col-span-8 flex flex-col h-[600px] bg-surface-container-lowest border border-surface-container rounded-xl shadow-sm overflow-hidden">
              
              {/* Chat Header */}
              <div className="p-4 bg-surface-container-low border-b border-surface-container flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
                    <Bot size={22} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                      Asisten Pakra
                    </h3>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                      Aktif & Siap Membantu
                    </p>
                  </div>
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                    title="Bersihkan obrolan"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {/* Chat Messages */}
              <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto  flex flex-col gap-4 bg-surface-container-lowest">
                {messages.length === 0 ? (
                  /* Welcome Screen when Empty */
                  <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto py-8">
                    <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary flex items-center justify-center mb-6">
                      <Bot size={36} />
                    </div>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-2">
                      Halo! Saya Asisten Pakra
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                      Saya dapat membantu menjelaskan langkah pengunggahan dokumen, pemecahan masalah error, atau privasi data Anda. Apa yang ingin Anda tanyakan?
                    </p>
                    
                    {/* Quick Prompts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      {QUICK_PROMPTS.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => handleSend(prompt)}
                          className="p-3 text-left bg-surface-container hover:bg-secondary-container rounded-xl border border-surface-container hover:border-outline transition-all text-on-surface-variant hover:text-on-secondary-container cursor-pointer text-xs md:text-sm"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* History Messages rendering */
                  <div className="flex flex-col gap-4">
                    <AnimatePresence initial={false}>
                      {messages.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex gap-3 max-w-[85%] ${
                            msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                          }`}
                        >
                          <div
                            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                              msg.role === 'user'
                                ? 'bg-secondary text-on-secondary'
                                : 'bg-secondary-container text-secondary'
                            }`}
                          >
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                          </div>
                          <div
                            className={`p-4 rounded-2xl font-body-md text-body-md leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-primary text-on-primary rounded-tr-none'
                                : 'bg-surface-container rounded-tl-none text-on-surface'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {/* Thinking Indicator */}
                    {isLoading && (
                      <div className="flex gap-3 self-start max-w-[85%]">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-xs">
                          <Bot size={16} className="text-secondary" />
                        </div>
                        <div className="p-4 bg-surface-container rounded-2xl rounded-tl-none flex items-center gap-1.5 min-h-[50px]">
                          <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend(input)
                }}
                className="p-4 bg-surface-container-low border-t border-surface-container flex gap-3 shrink-0"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pertanyaan Anda di sini..."
                  disabled={isLoading}
                  className="flex-1 bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-4 py-2 font-body-md text-body-md focus:outline-none focus:border-primary text-on-surface disabled:opacity-50 h-11"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-primary text-on-primary w-11 h-11 rounded-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer shrink-0"
                  aria-label="Kirim pesan"
                >
                  <Send size={18} />
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
  )
}

export default Page