import Script from 'next/script'; // 1. Import the Script component
import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';

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
                <div className="flex flex-col min-h-screen px-6 bg-noise sm:px-12">
                    <div className="flex flex-col w-full max-w-5xl mx-auto grow">
                        <Header />
                        <main className="grow">{children}</main>
                        <Footer />
                    </div>
                </div>

                {/* 2. Add the Google Analytics scripts here */}
                <Script 
                  src="https://www.googletagmanager.com/gtag/js?id=G-DNMR4PP143" 
                  strategy="afterInteractive" 
                />
                <Script id="google-analytics" strategy="afterInteractive">
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-DNMR4PP143', { 'debug_mode': true });
                  `}
                </Script>
            </body>
        </html>
    );
}
