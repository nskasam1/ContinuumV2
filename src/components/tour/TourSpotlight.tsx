import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import type { TourRect } from "./types";

interface TourSpotlightProps {
  rect: TourRect | null;
}

export function TourSpotlight({ rect }: TourSpotlightProps) {
  const reduceMotion = usePrefersReducedMotion();

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
