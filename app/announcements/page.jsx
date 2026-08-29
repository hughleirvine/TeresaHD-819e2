// File: app/announcements/page.jsx
"use client";

import { useState, useEffect } from 'react';

export default function AnnouncementPage() {
  const API_URL = 'https://script.google.com/macros/s/AKfycbyOjM1HbdNG0gU3OPSIj5Q0oU3gIhLcrPT-TFZnSYNpjQtMlzBXsqPDJy1_-A-f8nCF/exec';
  
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}?action=getAnnouncements`)
      .then(res => res.json())
      .then(data => {
        if (data.announcements) {
          setAnnouncements(data.announcements);
        }
      })
      .catch(err => console.error("Error fetching announcements:", err))
      .finally(() => setIsLoading(false));
  }, [API_URL]);

  // Check if string is a direct link to an image file
  const isImageUrl = (url) => {
    return /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(url?.trim());
  };

  // Helper to parse URLs inside text into clickable links
  const renderTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#67E8F9] hover:underline break-all font-medium transition-colors"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full min-h-screen py-8">
      <div className="max-w-4xl px-4 mx-auto sm:px-6">
        {/* Page Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#E0E7FF] text-center mb-4 tracking-tight">
          Thông Báo
        </h1>
        <div className="w-24 h-1 bg-[#374151] mx-auto rounded mb-8" />

        {/* Loading State */}
        {isLoading ? (
          <p className="text-center text-[#93C5FD] text-lg animate-pulse my-10">
            Đang tải thông báo...
          </p>
        ) : announcements.length > 0 ? (
          <ul className="space-y-6 list-none p-0">
            {announcements.map((item, index) => {
              const isImage = isImageUrl(item);
              
              return (
                <li
                  key={index}
                  className={`rounded-xl border transition-all duration-200 shadow-lg ${
                    isImage 
                      ? 'bg-transparent border-transparent p-0 overflow-hidden' 
                      : 'bg-[#1F2937] border-gray-700/80 p-5 sm:p-6 text-[#F8F8F8] leading-relaxed'
                  }`}
                >
                  {isImage ? (
                    <div className="relative overflow-hidden rounded-xl border border-gray-700/80 bg-[#1F2937] p-2 flex justify-center">
                      <img 
                        src={item} 
                        alt={`Thông báo ${index + 1}`} 
                        className="max-w-full h-auto rounded-lg object-contain shadow-md" 
                      />
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-base sm:text-lg">
                      {renderTextWithLinks(item)}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="bg-[#1F2937] border border-gray-700/80 rounded-xl p-8 text-center text-gray-300">
            Hiện chưa có thông báo mới.
          </div>
        )}
      </div>
    </div>
  );
}