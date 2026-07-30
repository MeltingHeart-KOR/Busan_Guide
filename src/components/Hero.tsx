import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

const SEGMENTS = 48
const SKY_TOP = '#fdeaf4'
const SKY_BOTTOM = '#f7d6e7'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const MESSAGES = ['今日どこ行く？', '海雲台、行こう。', '地下鉄で30分！']
const TYPE_MS = 100
const DELETE_MS = 50
const PAUSE_MS = 2000

const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1672671187899-a10f547341f1?w=440&q=70&auto=format&fit=crop',
    caption: '甘川文化村',
    className: 'hidden md:block left-[4%] lg:left-[7%] top-[16%] w-[150px] lg:w-[180px] -rotate-6',
    delay: 0.5,
    bobDelay: 0,
  },
  {
    src: 'https://images.unsplash.com/photo-1610696326548-07109f442da6?w=440&q=70&auto=format&fit=crop',
    caption: '海東龍宮寺',
    className: 'hidden md:block right-[4%] lg:right-[7%] top-[13%] w-[150px] lg:w-[180px] rotate-5',
    delay: 0.65,
    bobDelay: 1.2,
  },
  {
    src: 'https://images.unsplash.com/photo-1700277842839-2ef54f815f47?w=440&q=70&auto=format&fit=crop',
    caption: '海雲台ビーチ',
    className: 'hidden lg:block right-[16%] top-[46%] w-[150px] -rotate-3',
    delay: 0.8,
    bobDelay: 2.4,
  },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function TypingMessages() {
  const [text, setText] = useState('')
  const [msgIndex, setMsgIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = MESSAGES[msgIndex]
    let timeout: number

    if (!deleting && text === current) {
      timeout = window.setTimeout(() => setDeleting(true), PAUSE_MS)
    } else if (deleting && text === '') {
      setDeleting(false)
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    } else {
      timeout = window.setTimeout(
        () => setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1)),
        deleting ? DELETE_MS : TYPE_MS,
      )
    }
    return () => clearTimeout(timeout)
  }, [text, deleting, msgIndex])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.1, ease: EASE_OUT }}
      className="absolute left-6 sm:left-[9%] bottom-[13%] z-10"
    >
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-[0_6px_20px_rgba(18,60,76,0.25)]">
        <span className="text-[13px] sm:text-[14px] font-bold text-ink whitespace-nowrap min-h-[1.5em] inline-block">
          {text}
        </span>
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-ink ml-1 align-middle"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const seaPathRef = useRef<SVGPathElement>(null)
  const crestPathRef = useRef<SVGPathElement>(null)
  const photoRef = useRef<SVGImageElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const svg = svgRef.current
    const seaPath = seaPathRef.current
    const crestPath = crestPathRef.current
    const photo = photoRef.current
    if (!section || !svg || !seaPath || !crestPath || !photo) return

    let width = 0
    let height = 0
    let baseY = 0
    let wavelength = 400
    let amplitude = 22
    const CYCLES = 1.8

    let phase = 0
    let targetPhase = 0
    let rafId = 0

    function layout() {
      const rect = section!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      baseY = height * 0.52
      // span CYCLES full sine periods across the full width
      wavelength = width / (CYCLES * 2 * Math.PI)
      amplitude = Math.max(20, Math.min(46, height * 0.05))
      svg!.setAttribute('viewBox', `0 0 ${width} ${height}`)
      // fit the full (uncropped) photo into just the band the wave ever reveals,
      // so "meet" scales it against the visible area instead of the whole section
      const visibleTop = baseY - amplitude
      photo!.setAttribute('y', String(visibleTop))
      photo!.setAttribute('height', String(height - visibleTop))
    }
    layout()

    function buildPoints(currentPhase: number) {
      const pts: [number, number][] = []
      for (let i = 0; i <= SEGMENTS; i++) {
        const x = (width / SEGMENTS) * i
        const y = baseY + Math.sin(x / wavelength + currentPhase) * amplitude
        pts.push([x, y])
      }
      return pts
    }

    function render() {
      const pts = buildPoints(phase)
      let seaD = `M0,${pts[0][1].toFixed(1)} `
      let crestD = `M0,${pts[0][1].toFixed(1)} `
      for (let i = 1; i < pts.length; i++) {
        seaD += `L${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} `
        crestD += `L${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} `
      }
      seaD += `L${width},${height} L0,${height} Z`
      seaPath!.setAttribute('d', seaD)
      crestPath!.setAttribute('d', crestD)
    }

    function tick() {
      phase = lerp(phase, targetPhase, 0.05)
      render()
      rafId = requestAnimationFrame(tick)
    }
    tick()

    function onMouseMove(e: MouseEvent | TouchEvent) {
      let clientX: number
      if ('touches' in e && e.touches[0]) {
        clientX = e.touches[0].clientX
      } else {
        clientX = (e as MouseEvent).clientX
      }
      const norm = (clientX / window.innerWidth) * 2 - 1 // -1..1
      targetPhase = norm * 1.6
    }

    // the section is sized in svh, so its box can settle after mount — track it
    const ro = new ResizeObserver(() => layout())
    ro.observe(section)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onMouseMove, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onMouseMove)
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full h-[100svh] min-h-[560px] overflow-hidden">
      {/* sky */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${SKY_TOP} 0%, ${SKY_BOTTOM} 100%)` }}
      />

      {/* sea: hero-gwangan.jpg clipped by the wave path, tinted teal + white crest line */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <clipPath id="hero-sea-clip">
            <path ref={seaPathRef} d="" />
          </clipPath>
          <linearGradient id="hero-sea-tint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(18,60,76,0.15)" />
            <stop offset="100%" stopColor="rgba(18,60,76,0.55)" />
          </linearGradient>
          <filter id="hero-sea-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>
        <g clipPath="url(#hero-sea-clip)">
          {/* blurred cover fill so the letterboxed edges of the full photo below never show bare tint */}
          <image
            href="/images/hero-gwangan.jpg"
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            filter="url(#hero-sea-blur)"
          />
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(18,60,76,0.35)" />
          {/* the full photo, uncropped — y/height are set in JS to the band the wave can reveal */}
          <image
            ref={photoRef}
            href="/images/hero-gwangan.jpg"
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
          <rect x="0" y="0" width="100%" height="100%" fill="url(#hero-sea-tint)" />
        </g>
        <path
          ref={crestPathRef}
          d=""
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(18,60,76,0.25))' }}
        />
      </svg>

      {/* floating attraction photo cards */}
      {PHOTOS.map((photo) => (
        <motion.div
          key={photo.caption}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: photo.delay, ease: EASE_OUT }}
          className={`absolute z-10 pointer-events-none ${photo.className}`}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: photo.bobDelay }}
            className="bg-white p-2 pb-1.5 rounded-md shadow-[0_10px_30px_rgba(18,60,76,0.25)]"
          >
            <img src={photo.src} alt={photo.caption} className="block w-full aspect-[4/3] object-cover rounded-sm" />
            <div className="text-center text-[10px] text-sub tracking-[0.08em] pt-1.5">{photo.caption}</div>
          </motion.div>
        </motion.div>
      ))}

      {/* copy overlay — sits in the sky band above the waterline (baseY = 52% of height) */}
      {/* height = sky band minus max wave amplitude, so the crest can never reach the copy */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none flex items-center justify-center px-5 pt-12"
        style={{ height: 'calc(52% - clamp(20px, 5svh, 46px))' }}
      >
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            className="inline-block bg-navy text-white text-[10px] font-bold px-[10px] py-[5px] rounded -rotate-3 mb-3"
          >
            GUIDE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: EASE_OUT }}
            className="font-instrument font-semibold leading-[1.15] tracking-tight text-ink m-0 mb-3"
            style={{ fontSize: 'clamp(28px, 6.5svh, 58px)' }}
          >
            波の音まで、
            <br />
            地下鉄で。
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: EASE_OUT }}
          >
            <p className="text-[13px] sm:text-[14.5px] text-sub leading-relaxed max-w-[420px] mx-auto m-0">
              海沿いの夜景から下町の市場まで。
              <br />
              釜山の見どころを、駅ごとにまとめた小さな旅ガイド。
            </p>
            <div className="hero-stat mt-3 text-[10px] tracking-[0.22em] text-navy font-bold">
              2 LINES&ensp;·&ensp;6 SPOTS&ensp;·&ensp;BUSAN
            </div>
          </motion.div>
        </div>
      </div>

      <TypingMessages />

      {/* scroll hint — sits over the dark sea, so it is white */}
      <a
        href="#main"
        className="hero-scroll-hint absolute bottom-6 left-1/2 z-10"
        aria-label="スクロールして続きを見る"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  )
}
