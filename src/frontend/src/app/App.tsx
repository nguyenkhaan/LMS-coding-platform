import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AppRoutes } from './router/appRoutes.tsx';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
			staleTime: 5 * 60 * 1000
		}
	}
});

export default function App() {
	const initializeAuth = useAuthStore((state) => state.initializeAuth);

	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AppRoutes />
				<Toaster position="top-right" richColors />
			</BrowserRouter>
		</QueryClientProvider>
	);
}

