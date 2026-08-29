// File: components/header.jsx
import Image from 'next/image';
import Link from 'next/link';
import teresaLogo from 'public/TeresaLogo.png';

const navItems = [
    { linkText: 'Trang Nhà', href: '/' },
    { linkText: 'Kinh LCTX', href: '/daily-prayers' },
    { linkText: 'Kinh Thánh', href: '/weekly-prayers' },
    { linkText: 'Thông Báo', href: '/announcements' },
    { linkText: 'Sinh Hoạt', href: '/activities' },
    { linkText: 'Hiệp Thông', href: '/bulletins' },
    { linkText: 'Lịch Công Giáo', href: '/lich-cong-giao' }
];

export function Header() {
    return (
        <nav className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 md:py-6">
            {/* Logo */}
            <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
                <Image 
                    src={teresaLogo} 
                    alt="Teresahd logo" 
                    width={100} 
                    height={40}
                    className="brightness-0 invert object-contain h-auto w-20 sm:w-24 md:w-28"
                />
            </Link>

            {/* Nav Menu inline with logo */}
            {!!navItems?.length && (
                <ul className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-2 text-sm sm:text-base font-medium">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link 
                                href={item.href} 
                                className="text-[#F8F8F8] hover:text-[#93C5FD] no-underline transition-colors duration-150 px-1 py-1"
                            >
                                {item.linkText}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}