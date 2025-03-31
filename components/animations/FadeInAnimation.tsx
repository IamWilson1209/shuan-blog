'use client';

import { motion } from 'motion/react';

const FadeInAnimation = ({ children }: { children: React.ReactNode }) => {
  const variants = {
    hidden: { opacity: 0, translateY: 30 },
    visible: { opacity: 1, translateY: 0 },
  };
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView={'visible'}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};
export default FadeInAnimation;
