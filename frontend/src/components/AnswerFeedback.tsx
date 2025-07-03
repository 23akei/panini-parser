import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnswerFeedbackProps {
  isVisible: boolean;
  isCorrect: boolean;
  onComplete: () => void;
}

const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  isVisible,
  isCorrect,
  onComplete
}) => {
  const variants = {
    initial: {
      scale: 0,
      opacity: 0,
      rotate: -180
    },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      rotate: 180,
      transition: {
        duration: 0.3
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-start justify-center pt-20 z-40 pointer-events-none"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            className={`text-9xl font-bold ${
              isCorrect
                ? 'text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]'
                : 'text-red-400 drop-shadow-[0_0_20px_rgba(248,113,113,0.8)]'
            }`}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {isCorrect ? '✓' : '✗'}
          </motion.div>

          {/* Particle effect background */}
          <motion.div
            className={`absolute w-96 h-96 rounded-full ${
              isCorrect
                ? 'bg-green-400/20'
                : 'bg-red-400/20'
            }`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 0],
              opacity: [0, 0.4, 0],
              transition: {
                duration: 0.6,
                times: [0, 0.3, 1]
              }
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnswerFeedback;