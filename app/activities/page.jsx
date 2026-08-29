// File: app/activities/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Slider from "react-slick";

// Reusable Slideshow Modal Component
function SlideshowModal({ images, onClose }) {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="fullscreen-modal-overlay" onClick={onClose}>
      <div className="w-full max-w-4xl px-4" onClick={(e) => e.stopPropagation()}>
        <Slider {...sliderSettings}>
          {images.map((activity, index) => (
            <div key={index} className="p-2">
              <div className="w-full h-[65vh] relative rounded-lg overflow-hidden bg-black/40">
                <Image 
                  src={activity.imageUrl} 
                  alt={activity.title || "Slideshow image"} 
                  fill 
                  className="object-contain" 
                />
              </div>
              <div className="p-4 text-center text-white">
                <h2 className="text-2xl font-bold mb-2 text-[#E0E7FF]">{activity.title}</h2>
                {activity.description && (
                  <p className="text-gray-300 text-sm sm:text-base">{activity.description}</p>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

// Main Page Component
export default function ActivitiesPage() {
  const API_URL = 'https://script.google.com/macros/s/AKfycbyOjM1HbdNG0gU3OPSIj5Q0oU3gIhLcrPT-TFZnSYNpjQtMlzBXsqPDJy1_-A-f8nCF/exec';

  const [activities, setActivities] = useState([]);
  const [groupedActivities, setGroupedActivities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlideshow, setActiveSlideshow] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}?action=getActivities`)
      .then(res => res.json())
      .then(data => {
        if (data.activities) {
          setActivities(data.activities);
          const grouped = data.activities.reduce((acc, activity) => {
            const eventName = activity.event || "Uncategorized";
            if (!acc[eventName]) acc[eventName] = [];
            acc[eventName].push(activity);
            return acc;
          }, {});
          setGroupedActivities(grouped);
        }
      })
      .catch(err => console.error("Error fetching activities:", err))
      .finally(() => setIsLoading(false));
  }, [API_URL]);

  const events = Object.keys(groupedActivities);

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <p className="text-xl text-[#93C5FD] animate-pulse">Đang tải hoạt động...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-6 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 mb-8 border-b border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#E0E7FF] tracking-tight">
          Hoạt Động Của Nhóm
        </h1>
        {activities.length > 0 && (
          <button
            onClick={() => setActiveSlideshow(activities)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition-all duration-150 cursor-pointer"
          >
            Play All
          </button>
        )}
      </div>

      {/* Grouped Events */}
      {events.length > 0 ? (
        <div className="space-y-12">
          {events.map(event => (
            <section key={event} className="space-y-6">
              {/* Event Section Heading & Action */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#93C5FD]">
                  {event}
                </h2>
                <button
                  onClick={() => setActiveSlideshow(groupedActivities[event])}
                  className="px-4 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow transition duration-150 cursor-pointer"
                >
                  Play Slideshow
                </button>
              </div>

              {/* Grid of Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedActivities[event]
                  .filter(act => act.imageUrl)
                  .map((activity, index) => (
                    <div 
                      key={index} 
                      className="bg-[#1F2937] border border-gray-700/80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-200 flex flex-col"
                    >
                      {/* Clickable Image Container */}
                      <div
                        className="w-full h-64 relative cursor-zoom-in bg-black/30 overflow-hidden"
                        onClick={() => setModalImage(activity.imageUrl)}
                      >
                        <Image 
                          src={activity.imageUrl} 
                          alt={activity.title || "Hình hoạt động"} 
                          fill 
                          className="object-contain hover:scale-105 transition-transform duration-300 p-2"
                        />
                      </div>

                      {/* Card Content */}
                      <div className="p-4 text-center flex flex-col grow justify-center">
                        <h3 className="text-lg sm:text-xl font-semibold text-[#F8F8F8] mb-1">
                          {activity.title}
                        </h3>
                        {activity.description && (
                          <p className="text-gray-300 text-sm">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-300 text-lg py-12">
          Hiện không có hoạt động nào được đăng.
        </p>
      )}

      {/* Slideshow Modal */}
      {activeSlideshow && (
        <SlideshowModal 
          images={activeSlideshow} 
          onClose={() => setActiveSlideshow(null)} 
        />
      )}

      {/* Single Image Fullscreen Modal */}
      {modalImage && (
        <div 
          className="fullscreen-modal-overlay" 
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Image
              src={modalImage}
              alt="Expanded Activity"
              width={1200}
              height={800}
              className="object-contain max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}