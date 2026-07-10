import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface TourSpotlightProps {
  targetSelector: string | undefined;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 8;

export function TourSpotlight({ targetSelector }: TourSpotlightProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    if (!targetSelector) {
      setRect(null);
      return;
    }

    function measure() {
      const el = document.querySelector(`[data-tour="${targetSelector}"]`);
      if (!el) {
        setRect(null);
        return;
      }
      const box = el.getBoundingClientRect();
      setRect({
        top: box.top - PADDING,
        left: box.left - PADDING,
        width: box.width + PADDING * 2,
        height: box.height + PADDING * 2,
      });
    }

    measure();
    const raf = requestAnimationFrame(measure);

    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [targetSelector]);

  if (!rect) return null;

  return (
    <motion.div
      initial={false}
      animate={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
      className="pointer-events-none fixed z-40 rounded-lg"
      style={{ boxShadow: "0 0 0 3px var(--accent), 0 0 0 8px rgba(14, 165, 168, 0.2)" }}
    />
  );
}
