import Image from 'next/image';
import teresaLogo from 'public/TeresaLogo.png';

const navItems = [
    { linkText: 'Home', href: '/' },
    { linkText: 'Revalidation', href: '/revalidation' },
    { linkText: 'Image CDN', href: '/image-cdn' },
    { linkText: 'Edge Function', href: '/edge' },
    { linkText: 'Blobs', href: '/blobs' },
    { linkText: 'Classics', href: '/classics' }
];

export default function Header() {
  return (
    <header>
      {/* The src="/my-logo.png" path directly refers to public/my-logo.png */}
      <Image
        src={teresaLogo}
        alt="Nhóm Teresa logo"
        width={150}
        height={40}
      />
      {/* ... other header content ... */}
    </header>
  );
}
