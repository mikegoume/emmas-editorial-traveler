"use client";
import { motion } from "motion/react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function StaggerGrid({ children, className }: Props) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        initial: {},
        animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
