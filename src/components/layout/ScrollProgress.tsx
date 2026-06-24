'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Premium scroll progress bar — a thin gold gradient bar at the top of the viewport
 * that fills as the user scrolls down the page.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-gold via-yellow-400 to-gold pointer-events-none"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}
