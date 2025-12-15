
import React, { useState } from 'react';
import { Search, Check, X } from 'lucide-react';

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
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm border border-transparent",
    secondary: "bg-brand-900 text-white hover:bg-brand-800 shadow-sm border border-transparent",
    accent: "bg-accent-500 text-white hover:bg-accent-600 shadow-sm border border-transparent",
    outline: "border border-gray-200 dark:border-white/20 bg-transparent text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10",
    ghost: "text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white bg-transparent",
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

interface CardProps { 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void;
  variant?: 'standard' | 'glass';
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, variant = 'standard' }) => {
  const baseStyle = `rounded-2xl overflow-hidden transition-all ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`;
  
  const variants = {
    standard: "bg-white text-gray-900 shadow-native border border-gray-100",
    glass: "bg-slate-900/40 backdrop-blur-md border border-white/10 text-white shadow-glass"
  };

  return (
    <div 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'purple' | 'gold' }> = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-brand-50 text-brand-700 border-brand-100',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    gold: 'bg-accent-50 text-accent-700 border-accent-200',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

export const PageHeader: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="flex justify-between items-center mb-6 pt-2">
    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-sm">{title}</h1>
    {action && <div>{action}</div>}
  </div>
);

export const LoadingScreen: React.FC = () => (
  <div className="flex h-64 w-full items-center justify-center text-white/60">
    <div className="flex flex-col items-center gap-3">
      <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="text-sm font-medium">Loading...</span>
    </div>
  </div>
);

// --- MultiSelectListBox Component (Always Visible List) ---
interface MultiSelectListBoxProps {
  label: string;
  options: { value: string; label: string; subLabel?: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  height?: string;
  colorTheme?: 'blue' | 'green' | 'red' | 'yellow';
}

export const MultiSelectListBox: React.FC<MultiSelectListBoxProps> = ({ 
  label, options, selectedValues, onChange, height = "h-64", colorTheme = 'blue'
}) => {
  const [search, setSearch] = useState("");
  
  const filtered = options.filter(o => 
      o.label.toLowerCase().includes(search.toLowerCase()) || 
      (o.subLabel && o.subLabel.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleOption = (val: string) => {
      const newValues = selectedValues.includes(val) 
        ? selectedValues.filter(v => v !== val)
        : [...selectedValues, val];
      onChange(newValues);
  };
  
  const handleSelectAll = () => {
      // Add all visible that aren't already selected
      const visibleIds = filtered.map(o => o.value);
      const toAdd = visibleIds.filter(id => !selectedValues.includes(id));
      onChange([...selectedValues, ...toAdd]);
  };

  const handleClearVisible = () => {
      // Remove all visible from selection
      const visibleIds = filtered.map(o => o.value);
      onChange(selectedValues.filter(id => !visibleIds.includes(id)));
  };

  // Helper for selection styling
  const getSelectionClasses = (isSelected: boolean) => {
      if (!isSelected) return 'bg-white hover:bg-gray-50 border-gray-100 text-gray-700';
      switch(colorTheme) {
          case 'green': return 'bg-green-50 border-green-200 text-green-900 font-semibold';
          case 'yellow': return 'bg-yellow-50 border-yellow-200 text-yellow-900 font-semibold';
          case 'red': return 'bg-red-50 border-red-200 text-red-900 font-semibold';
          default: return 'bg-brand-50 border-brand-200 text-brand-900 font-semibold';
      }
  };

  const getCheckboxClasses = (isSelected: boolean) => {
      if (!isSelected) return 'border-gray-300 bg-white';
      switch(colorTheme) {
          case 'green': return 'bg-green-500 border-green-500 text-white';
          case 'yellow': return 'bg-yellow-500 border-yellow-500 text-white';
          case 'red': return 'bg-red-500 border-red-500 text-white';
          default: return 'bg-brand-600 border-brand-600 text-white';
      }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col shadow-sm">
        {/* Header with Search */}
        <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/50">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-sm text-gray-700 dark:text-gray-200">{label}</h4>
                <div className="text-xs text-gray-500">
                    {selectedValues.length} selected
                </div>
            </div>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
                    <input 
                        className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                        placeholder="Search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button onClick={handleSelectAll} className="px-3 py-1 text-xs font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">All</button>
                <button onClick={handleClearVisible} className="px-3 py-1 text-xs font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">None</button>
            </div>
        </div>
        
        {/* Scrollable List */}
        <div className={`overflow-y-auto ${height} p-2 space-y-1`}>
            {filtered.length === 0 ? (
                 <div className="text-center text-sm text-gray-400 py-8">No members found matching "{search}"</div>
            ) : (
                filtered.map(opt => {
                    const isSelected = selectedValues.includes(opt.value);
                    return (
                        <div 
                            key={opt.value}
                            onClick={() => toggleOption(opt.value)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${getSelectionClasses(isSelected)}`}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${getCheckboxClasses(isSelected)}`}>
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                                <div className="text-sm">{opt.label}</div>
                                {opt.subLabel && <div className="text-xs opacity-70">{opt.subLabel}</div>}
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    </div>
  );
};

// Keep old MultiSelect for compatibility if needed, but MultiSelectListBox is preferred.
export const MultiSelect = MultiSelectListBox; 
