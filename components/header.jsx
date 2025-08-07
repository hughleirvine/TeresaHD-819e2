import Image from 'next/image';
import Link from 'next/link';
import teresaLogo from 'public/TeresaLogo.png';

const navItems = [
    { linkText: 'Trang Nhà', href: '/' },
    { linkText: 'Kinh Lòng Chúa Thương Xót', href: '/daily-prayers},
    { linkText: 'Thông Báo', href: '/announcements' },
    { linkText: 'Hiệp Thông', href: '/bulletins' },
    { linkText: 'Lịch Công Giáo', href: '/lich-cong-giao' }
];

export function Header() {
    return (
        <nav className="flex flex-wrap items-center gap-4 pt-6 pb-12 sm:pt-12 md:pb-24">
            <Link href="/">
                <Image src={teresaLogo} alt="Teresahd logo" width={150} height={50}/>
            </Link>
            {!!navItems?.length && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href} className="inline-flex px-1.5 py-1 sm:px-3 sm:py-2">
                                {item.linkText}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}
