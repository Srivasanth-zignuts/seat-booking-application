import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { FirebaseProvider } from '@/context/firebaseContext';
import QueryProvider from '@/context/queryProvider';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata = {
	title: 'Seat Booking Application',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<FirebaseProvider>
					<QueryProvider>{children}</QueryProvider>
				</FirebaseProvider>
			</body>
		</html>
	);
}
