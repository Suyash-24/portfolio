import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$*";

export function RandomLetterSwap({ label, className, staggerDuration = 0.05 }) {
  const [text, setText] = useState(label);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setText(label);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setText((current) => 
        current.split("").map((letter, index) => {
          if (index < iteration) {
            return label[index];
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      
      if (iteration >= label.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / (staggerDuration * 20); // Control speed
    }, 30);

    return () => {
      clearInterval(interval);
      setText(label);
    };
  }, [isHovered, label, staggerDuration]);

  return (
    <motion.span 
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
    >
      {text}
    </motion.span>
  );
}
