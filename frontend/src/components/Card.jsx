import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, onClick, gradient = false }) => {
  const baseClasses = 'bg-slate-800 rounded-xl shadow-lg border border-slate-700';
  const hoverClasses = hover ? 'hover:shadow-xl hover:border-slate-600 cursor-pointer hover:-translate-y-1' : '';
  const gradientClasses = gradient ? 'bg-gradient-to-br from-slate-800 to-slate-900' : '';
  
  const Component = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { y: -2, scale: 1.02 },
    whileTap: { scale: 0.98 },
    onClick
  } : {};

  return (
    <Component
      className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className} transition-all duration-200`}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default Card;