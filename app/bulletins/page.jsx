// File: app/bulletins/page.jsx
"use client";

import { useState, useEffect } from 'react';

function getEmbedUrl(googleDriveUrl) {
  if (!googleDriveUrl) return '';
  return googleDriveUrl.replace("/view?usp=drive_link", "/preview");
}

export default function BulletinPage() {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');

  useEffect(() => {
    fetch('/api/get-bulletins')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch bulletins');
        return response.json();
      })
      .then(data => {
        if (data.links && data.links.length > 0) {
          setLinks(data.links);
          // Automatically show the latest bulletin if available
          setEmbedUrl(getEmbedUrl(data.links[0]));
        } else {
          setError("No bulletins found.");
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const buttonLabels = ["Hiệp Thông Tuần Này", "Hiệp Thông Tuần Trước", "Hiệp Thông 2 Tuần Trước"];

  const handleButtonClick = (link) => {
    setEmbedUrl(getEmbedUrl(link));
  };

  return (
    <div className="w-full min-h-screen py-8">
      {/* Page Header */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#E0E7FF] text-center mb-8 tracking-tight">
        Hiệp Thông Bulletins
      </h1>

      {/* Loading & Error States */}
      {isLoading && (
        <p className="text-center text-[#93C5FD] text-lg animate-pulse my-6">
          Đang tải bản tin Hiệp Thông...
        </p>
      )}
      
      {error && (
        <p className="text-center text-red-400 font-medium my-6">{error}</p>
      )}
      
      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 my-6">
        {!isLoading && !error && links.map((link, index) => {
          const currentLinkEmbed = getEmbedUrl(link);
          const isSelected = embedUrl === currentLinkEmbed;
          return (
            <button 
              key={index}
              onClick={() => handleButtonClick(link)}
              className={`px-4 py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-150 shadow-md cursor-pointer ${
                isSelected 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                  : 'bg-[#1F2937] text-gray-200 hover:bg-gray-700 hover:text-white border border-gray-600'
              }`}
            >
              {buttonLabels[index] || `Bản Tin #${index + 1}`}
            </button>
          );
        })}
      </div>

      {/* PDF Viewer */}
      {embedUrl && (
        <div className="w-full max-w-5xl mx-auto mt-6 bg-[#1F2937] p-2 sm:p-4 rounded-xl shadow-xl border border-gray-700">
          <iframe
            src={embedUrl}
            className="w-full h-[700px] sm:h-[850px] rounded-lg border-0"
            title="Bulletin PDF Viewer"
            allow="autoplay"
          ></iframe>
        </div>
      )}
    </div>
  );
}