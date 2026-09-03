import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppRoutes } from './router/appRoutes.tsx';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
			staleTime: 5 * 60 * 1000
		}
	}
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-google-client-id';

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<GoogleOAuthProvider clientId={googleClientId}>
				<BrowserRouter>
					<AppRoutes />
					<Toaster position="top-right" richColors />
				</BrowserRouter>
			</GoogleOAuthProvider>
		</QueryClientProvider>
	);
}
