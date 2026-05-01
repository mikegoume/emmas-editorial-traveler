"use client";
import { motion } from "motion/react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: Props) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0, 0, 0.2, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
