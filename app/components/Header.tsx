import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {motion} from 'framer-motion'
import { CURVE_EASE } from "../libs/utils";
import Link from "next/link";

export default function Header({appState}: {appState: string}) {
  const [active, setActive] = useState<string>("beranda")
  const router = useRouter()
  const pathname = usePathname()
  const navItem = [
    { title: 'beranda', link: '#' },
    { title: 'tentang kami', link: '#tentang-kami' },
    { title: 'panduan', link: '#panduan' },
  ]

  useEffect(() => {
    // Derive the real DOM id from the link (e.g. '#tentang-kami' → 'tentang-kami')
    const getIdFromLink = (link: string) =>
      link === '#' ? 'beranda' : link.replace('#', '')

    const pickActive = () => {
      const scrollBottom = window.scrollY + window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const midpoint = window.innerHeight * 0.45 // 45% down the viewport

      // If user is near the very bottom, always activate last section
      if (docHeight - scrollBottom < 80) {
        const lastId = getIdFromLink(navItem[navItem.length - 1].link)
        if (document.getElementById(lastId)) {
          setActive(navItem[navItem.length - 1].title)
        }
        return
      }

      // Walk sections in reverse; the first one whose top is above the midpoint wins
      let found: string | null = null
      for (let i = navItem.length - 1; i >= 0; i--) {
        const id = getIdFromLink(navItem[i].link)
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= midpoint) {
            found = navItem[i].title
            break
          }
        }
      }

      if (found) setActive(found)
    }

    const timerId = setTimeout(() => {
      // Run once immediately after mount
      pickActive()
      window.addEventListener('scroll', pickActive, { passive: true })
    }, 150)

    return () => {
      clearTimeout(timerId)
      window.removeEventListener('scroll', pickActive)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const dispatchHomeEvent = () => {
    window.dispatchEvent(new CustomEvent('pahamburo:navigate-home'));
  };

  useEffect(() => {
    if(appState !== 'idle'){
      setActive('')
    }
  }, [appState])

  return (
    <header className="bg-surface border-b border-surface-container fixed top-0 w-full z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max-width mx-auto">
        <div 
          onClick={() => {
            if (pathname !== "/") {
              router.push("/");
            } else {
              dispatchHomeEvent();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="text-headline-md font-headline-md font-bold text-primary cursor-pointer"
        >
          Pakra
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-3">
            {navItem.map((item, index) => 
            <li key={index}>
              <a
              className={`font-bold capitalize hover:text-primary relative transition-all duration-300 ${item.title === active ? 'text-primary' : ''}`}
              href={item.link}
              onClick={(e) => {
                setActive(item.title);
                if (pathname !== "/") {
                  router.push(item.link === '#' ? '/' : `/${item.link}`);
                } else {
                  e.preventDefault();
                  
                  if (item.link === '#') {
                    dispatchHomeEvent();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    // Dispatch dulu, lalu langsung scroll tanpa nunggu
                    dispatchHomeEvent();
                    // Pakai requestAnimationFrame untuk tunggu satu render cycle
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => {
                        document.querySelector(item.link)?.scrollIntoView({ behavior: 'smooth' });
                      });
                    });
                  }
                }
              }}
              >
                {item.title}
                {active === item.title &&
                <motion.span 
                  layoutId="active-link"
                  transition={{duration: 0.3, ease: CURVE_EASE}}
                className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-primary`}/>
                }
              </a>
            </li>
            )}
            </ul>
        </nav>
        <div className="flex items-center gap-4">
          <Link href={'/helper'} className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-lg text-label-lg hover:opacity-80 transition-all duration-150">
            Bantuan
          </Link>
        </div>
      </div>
    </header>
  );
}
