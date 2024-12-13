import localFont from 'next/font/local';
import type { Metadata } from 'next';
import { KittyCareTheme } from './theme';
import './globals.css';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});

const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'KittyCare',
    description: 'KittyCare is a web IOT project for taking care of your cat.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <KittyCareTheme>{children}</KittyCareTheme>
            </body>
        </html>
    );
}
