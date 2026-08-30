import type { Variants } from "framer-motion";

// Shared entrance animation for admin panel cards/tiles. `visible` accepts an
// index (via the `custom` prop) so a list of siblings can cascade in one
// after another instead of all popping in at once.
export const fadeUpStagger: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay: index * 0.07 },
  }),
};

// Same motion, no index — for a single card that doesn't need staggering
// against siblings.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};
