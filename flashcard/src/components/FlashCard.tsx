import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
export const FlashCard = ({
  title,
  number,
  description,
  onMark,
  isMarked
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return <div className="relative h-[400px] w-full perspective-1000">
      <motion.div className="relative h-full w-full cursor-pointer" onClick={() => setIsFlipped(!isFlipped)} animate={{
      rotateY: isFlipped ? 180 : 0
    }} transition={{
      duration: 0.6
    }} style={{
      transformStyle: "preserve-3d"
    }}>
        <div className={`absolute inset-0 rounded-xl p-8 shadow-lg bg-white dark:bg-gray-800 backface-hidden`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-semibold dark:text-white">{title}</h3>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              #{number}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg mt-4">
            Click to flip
          </p>
          <button onClick={e => {
          e.stopPropagation();
          onMark();
        }} className="absolute bottom-6 right-6">
            <Star className={`h-6 w-6 ${isMarked ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
          </button>
        </div>
        <div className={`absolute inset-0 rounded-xl p-8 shadow-lg bg-white dark:bg-gray-800 [transform:rotateY(180deg)] backface-hidden`}>
          <div className="h-full overflow-y-auto">
            <p className="text-gray-700 dark:text-gray-300 text-lg whitespace-pre-line">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>;
};