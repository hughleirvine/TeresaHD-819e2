// File: app/layout.jsx
import Script from 'next/script';
import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export const metadata = {
    title: {
        template: '%s | Netlify',
        default: 'Nhóm Teresa Hài Đồng Giêsu'
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body className="antialiased text-white bg-blue-900">
                <div className="flex flex-col min-h-screen bg-noise">
                    {/* Constrained Header */}
                    <div className="w-full max-w-5xl px-6 mx-auto sm:px-12">
                        <Header />
                    </div>

                    {/* Full-Width Main Area */}
                    <main className="w-full grow">{children}</main>

                    {/* Constrained Footer */}
                    <div className="w-full max-w-5xl px-6 mx-auto sm:px-12">
                        <Footer />
                    </div>
                </div>

                {/* Google Analytics Scripts */}
                <Script 
                  src="https://www.googletagmanager.com/gtag/js?id=G-BDQLJ8ZTFX" 
                  strategy="afterInteractive" 
                />
                <Script id="google-analytics" strategy="afterInteractive">
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-BDQLJ8ZTFX', { 'debug_mode': true });
                  `}
                </Script>
            </body>
        </html>
    );
}