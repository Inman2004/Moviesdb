import React, { createContext, useContext, useState } from 'react';

type Theme = 'amber' | 'blue' | 'purple';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeClasses: {
    bgGradient: string;
    headerBg: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentHover: string;
    border: string;
    scrollbar: string;
  };
}

const themeConfig = {
  amber: {
    bgGradient: 'from-black to-amber-900',
    headerBg: 'bg-amber-200',
    textPrimary: 'text-amber-900',
    textSecondary: 'text-amber-700',
    accent: 'bg-amber-500',
    accentHover: 'hover:bg-amber-600',
    border: 'border-amber-300',
    scrollbar: 'scrollbar-thumb-amber-500/50',
  },
  blue: {
    bgGradient: 'from-black to-blue-900',
    headerBg: 'bg-blue-200',
    textPrimary: 'text-blue-900',
    textSecondary: 'text-blue-700',
    accent: 'bg-blue-500',
    accentHover: 'hover:bg-blue-600',
    border: 'border-blue-300',
    scrollbar: 'scrollbar-thumb-blue-500/50',
  },
  purple: {
    bgGradient: 'from-black to-purple-900',
    headerBg: 'bg-purple-200',
    textPrimary: 'text-purple-900',
    textSecondary: 'text-purple-700',
    accent: 'bg-purple-500',
    accentHover: 'hover:bg-purple-600',
    border: 'border-purple-300',
    scrollbar: 'scrollbar-thumb-purple-500/50',
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'amber';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const themeClasses = themeConfig[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeClasses }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
