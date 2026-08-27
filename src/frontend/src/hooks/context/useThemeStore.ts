import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeStore {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => {
	const savedTheme = ((typeof window !== 'undefined' ? localStorage.getItem('app-theme') : null) as Theme) || 'light';

	if (typeof document !== 'undefined') {
		if (savedTheme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	return {
		theme: savedTheme,
		toggleTheme: () => {
			set((state) => {
				const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
				localStorage.setItem('app-theme', nextTheme);
				if (nextTheme === 'dark') {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
				return { theme: nextTheme };
			});
		},
		setTheme: (theme) => {
			localStorage.setItem('app-theme', theme);
			if (theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
			set({ theme });
		}
	};
});
