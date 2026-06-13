import { create } from 'zustand';

interface ThemeState {
  darkMode: boolean;
  sidebarExpanded: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => {
  // Load initial settings
  const storedDark = localStorage.getItem('unisync_dark');
  const initialDark = storedDark ? storedDark === 'true' : true; // Default to dark mode for premium look
  
  if (initialDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  return {
    darkMode: initialDark,
    sidebarExpanded: true,
    
    toggleDarkMode: () => {
      const nextDark = !get().darkMode;
      localStorage.setItem('unisync_dark', String(nextDark));
      if (nextDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      set({ darkMode: nextDark });
    },

    toggleSidebar: () => {
      set({ sidebarExpanded: !get().sidebarExpanded });
    },

    setSidebarExpanded: (expanded: boolean) => {
      set({ sidebarExpanded: expanded });
    }
  };
});
