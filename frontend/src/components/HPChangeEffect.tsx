import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HPChangeEffectProps {
  isVisible: boolean;
  isDamage: boolean; // true for damage, false for heal
  onComplete: () => void;
  playerId?: number;
}

const HPChangeEffect: React.FC<HPChangeEffectProps> = ({
  isVisible,
  isDamage,
  onComplete,
  playerId
}) => {
  const variants = {
    initial: {
      scale: 0,
      opacity: 0,
      y: 0
    },
    animate: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0],
      y: isDamage ? -50 : -30,
      transition: {
        duration: 1,
        times: [0, 0.3, 1],
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  // Determine positioning based on playerId
  const getPositionClass = () => {
    if (playerId === 1) {
      return "fixed top-20 left-20 z-30 pointer-events-none";
    } else if (playerId === 2) {
      return "fixed top-20 right-20 z-30 pointer-events-none";
    } else {
      // Default to center if no playerId specified
      return "fixed top-20 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none";
    }
  };

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={`hp-effect-${playerId}-${Date.now()}`}
          className={getPositionClass()}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            key={`hp-text-${playerId}-${Date.now()}`}
            className={`text-6xl font-bold ${
              isDamage
                ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]'
                : 'text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]'
            }`}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {isDamage ? '-1 ❤️' : '+1 ❤️'}
          </motion.div>

          {/* Pulse effect background */}
          <motion.div
            key={`hp-pulse-${playerId}-${Date.now()}`}
            className={`absolute inset-0 w-24 h-24 rounded-full ${
              isDamage
                ? 'bg-red-500/20'
                : 'bg-green-500/20'
            }`}
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 2, 0],
              opacity: [0, 0.4, 0],
              transition: {
                duration: 0.8,
                times: [0, 0.4, 1]
              }
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HPChangeEffect;