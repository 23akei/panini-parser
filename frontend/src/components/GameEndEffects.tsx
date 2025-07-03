import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameEndEffectsProps {
  isVisible: boolean;
  isVictory: boolean;
  onComplete: () => void;
  playerId?: number;
}

const GameEndEffects: React.FC<GameEndEffectsProps> = ({
  isVisible,
  isVictory,
  onComplete,
  playerId
}) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  const textVariants = {
    initial: {
      y: 100,
      opacity: 0,
      scale: 0.5
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.3
      }
    }
  };

  const particleVariants = {
    initial: {
      opacity: 0,
      scale: 0,
      rotate: 0
    },
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0, 1, 0.5],
      rotate: [0, 360],
      x: [0, (i % 2 === 0 ? 1 : -1) * Math.random() * 200],
      y: [0, -Math.random() * 300],
      transition: {
        duration: 2,
        delay: i * 0.1,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    })
  };

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  // Determine positioning based on playerId
  const getPositionClass = () => {
    if (playerId === 1) {
      return "fixed inset-0 flex items-center justify-start pl-20 z-50 pointer-events-none";
    } else if (playerId === 2) {
      return "fixed inset-0 flex items-center justify-end pr-20 z-50 pointer-events-none";
    } else {
      // Default to center if no playerId specified
      return "fixed inset-0 flex items-center justify-center z-50 pointer-events-none";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={getPositionClass()}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Background overlay */}
          <motion.div
            className={`absolute inset-0 ${
              isVictory
                ? 'bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20'
                : 'bg-gradient-to-r from-gray-800/30 via-gray-700/30 to-gray-900/30'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Victory particles */}
          {isVictory && (
            <div className="absolute inset-0">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full bg-yellow-400"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  variants={particleVariants}
                  initial="initial"
                  animate="animate"
                  custom={i}
                />
              ))}
            </div>
          )}

          {/* Main text */}
          <motion.div
            className="text-center z-10"
            variants={textVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className={`text-8xl font-bold mb-4 ${
                isVictory
                  ? 'text-yellow-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.8)]'
                  : 'text-red-400 drop-shadow-[0_0_30px_rgba(248,113,113,0.8)]'
              }`}
              animate={isVictory ? {
                scale: [1, 0.4, 0.1],
                rotate: [0, 5, -5, 0],
                transition: {
                  duration: 1,
                  repeat: 1,
                  repeatType: "loop" as const
                }
              } : {
                opacity: [1, 0.4, 0.1],
                transition: {
                  duration: 1,
                  repeat: 1,
                  repeatType: "loop" as const
                }
              }}
            >
              {isVictory ? '🎉' : '💔'}
            </motion.div>

            <motion.h2
              className={`text-6xl font-bold ${
                isVictory
                  ? 'text-yellow-300'
                  : 'text-red-300'
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.6 }
              }}
            >
              {isVictory ? 'VICTORY!' : 'DEFEAT!'}
            </motion.h2>

            <motion.p
              className={`text-2xl mt-4 ${
                isVictory
                  ? 'text-yellow-200'
                  : 'text-red-200'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 1 }
              }}
            >
              {isVictory ? 'Excellent!' : 'Try again!'}
            </motion.p>
          </motion.div>

          {/* Victory sparkles */}
          {isVictory && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 1 }).map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    transition: {
                      duration: 1,
                      delay: i * 0.2,
                      repeat: 1,
                      repeatType: "loop" as const
                    }
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameEndEffects;