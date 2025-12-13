import React from 'react';

// --- Types ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

// --- Components ---

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', isLoading, className = '', disabled, ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] touch-manipulation select-none";
  
  const variants = {
    // Primary Brand Blue #1F4FD8
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm border border-transparent dark:shadow-none",
    // Navy Secondary
    secondary: "bg-brand-900 text-white hover:bg-brand-800 shadow-sm border border-transparent dark:bg-slate-800 dark:hover:bg-slate-700",
    // Gold Accent
    accent: "bg-accent-500 text-white hover:bg-accent-600 shadow-sm border border-transparent",
    outline: "border border-app-border dark:border-app-darkBorder bg-app-card dark:bg-transparent text-app-text dark:text-app-darkText hover:bg-brand-50 dark:hover:bg-white/5",
    ghost: "text-app-subtext dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-white/10 hover:text-brand-700 dark:hover:text-white bg-transparent",
    danger: "bg-error-500 text-white hover:bg-error-700 shadow-sm",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-base", 
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    className={`bg-app-card dark:bg-app-darkCard rounded-2xl shadow-native border border-app-border dark:border-app-darkBorder overflow-hidden ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'purple' | 'teal' | 'indigo' | 'gold' }> = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-brand-50 text-brand-700 border-brand-100 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-800',
    green: 'bg-success-50 text-success-700 border-success-500/20 dark:bg-success-900/30 dark:text-success-300 dark:border-success-800',
    red: 'bg-error-50 text-error-700 border-error-500/20 dark:bg-error-900/30 dark:text-error-300 dark:border-error-800',
    yellow: 'bg-warning-50 text-warning-700 border-warning-500/20 dark:bg-warning-900/30 dark:text-warning-300 dark:border-warning-800',
    gold: 'bg-accent-50 text-accent-700 border-accent-200 dark:bg-accent-900/30 dark:text-accent-300 dark:border-accent-800',
    gray: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    purple: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
    teal: 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

export const PageHeader: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="flex justify-between items-center mb-6 pt-2">
    <h1 className="text-2xl md:text-3xl font-bold text-brand-900 dark:text-white tracking-tight">{title}</h1>
    {action && <div>{action}</div>}
  </div>
);

export const LoadingScreen: React.FC = () => (
  <div className="flex h-64 w-full items-center justify-center text-app-subtext">
    <div className="flex flex-col items-center gap-3">
      <svg className="animate-spin h-8 w-8 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="text-sm font-medium">Loading...</span>
    </div>
  </div>
);