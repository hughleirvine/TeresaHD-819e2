import Link from 'next/link';
import Image from 'next/image';

// This function fetches the latest TEXT announcement from your Google Script API
async function getLatestAnnouncement() {
  const API_URL = 'https://script.google.com/macros/s/AKfycbyOjM1HbdNG0gU3OPSIj5Q0oU3gIhLcrPT-TFZnSYNpjQtMlzBXsqPDJy1_-A-f8nCF/exec';
  
  try {
    const response = await fetch(`${API_URL}?action=getAnnouncements`, { next: { revalidate: 300 } });
    if (!response.ok) {
      throw new Error('Failed to fetch announcement');
    }
    const data = await response.json();
    return data.announcement && data.announcements.length > 0 ? data.announcements[0] : null;
  } catch (error) {
    console.error("Failed to fetch announcement:", error);
    return null;
  }
}

export default async function HomePage() {
  const latestAnnouncement = await getLatestAnnouncement();

  return (
    <main className="space-y-12">
      {/* 1. Welcome Section */}
      <section className="text-center py-16 px-4 rounded-lg hero-section">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Kính Chào Nhóm Teresa Hài Đồng Giêsu
        </h1>
        <p className="mt-4 text-lg text-gray-200">
          Tạ ơn Chúa đã ban cho chúng con hồng ân đồng hành học hỏi Lời Chúa.
        </p>
      </section>

      {/* 2. Quick Actions Section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <Link href="/daily-prayers" className="quick-action-card">
            <Image src="/schedule-icon.png" alt="Kinh LCTX Icon" width={80} height={80} className="mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white">Kinh LCTX</h2>
            <p className="mt-2 text-gray-400">Vào đây đọc kinh LCTX</p>
          </Link>
          <Link href="/announcements" className="quick-action-card">
            <Image src="/announcement-icon.png" alt="Thông Báo Icon" width={80} height={80} className="mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white">Thông Báo Mới Nhất</h2>
            <p className="mt-2 text-gray-400">Cập nhật những thông báo quan trọng.</p>
          </Link>
          <a href="/hiep-thong" target="_blank" rel="noopener noreferrer" className="quick-action-card">
             <Image src="/bulletin-icon.png" alt="Hiệp Thông Icon" width={80} height={80} className="mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white">Hiệp Thông Hàng Tuần</h2>
            <p className="mt-2 text-gray-400">Tải về các bản tin Hiệp Thông mới nhất.</p>
          </a>

          {/* ADDED: Liturgical Calendar Card */}
          <Link href="/lich-cong-giao" className="quick-action-card">
            <Image src="/calendar-icon.png" alt="Lịch Công Giáo Icon" width={80} height={80} className="mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white">Lịch Công Giáo</h2>
            <p className="mt-2 text-gray-400">Xem lịch phụng vụ cho các tuần sắp tới.</p>
          </Link>
          
        </div>
      </section>

      {/* 3. Recent Announcement Section */}
      {latestAnnouncement && (
        <section>
          <h2 className="text-3xl font-bold text-center mb-6 text-white">Thông Báo Gần Đây</h2>
          <div className="announcement-box text-gray-300">
            {latestAnnouncement}
          </div>
        </section>
      )}
    </main>
  );
}
