import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  bordered?: boolean;
  compact?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  bordered = false,
  compact = false,
}) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-sm
        ${bordered ? 'border border-gray-200 dark:border-gray-700' : ''}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className={`${compact ? 'px-4 py-3' : 'px-6 py-4'} border-b border-gray-200 dark:border-gray-700`}>
          {title && <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      )}
      
      <div className={compact ? 'px-4 py-3' : 'px-6 py-5'}>
        {children}
      </div>
      
      {footer && (
        <div className={`${compact ? 'px-4 py-3' : 'px-6 py-4'} bg-gray-50 dark:bg-gray-750 rounded-b-lg border-t border-gray-200 dark:border-gray-700`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;