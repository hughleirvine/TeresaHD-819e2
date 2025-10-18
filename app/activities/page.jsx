// File: app/activities/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Slider from "react-slick"; // Import the Slider component

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
      <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <Slider {...sliderSettings}>
          {images.map((activity, index) => (
            <div key={index} className="p-4">
              <div className="w-full h-[70vh] relative">
                <Image src={activity.imageUrl} alt={activity.title} fill className="object-contain" />
              </div>
              <div className="p-6 text-center text-white">
                <h2 className="text-2xl font-bold mb-2">{activity.title}</h2>
                <p className="text-gray-300">{activity.description}</p>
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
  const API_URL = 'https://script.google.com/macros/s/AKfycbyOjM1HbdNG0gU3OPSIj5Q0oU3gIhLcrPT-TFZnSYNpjQtMlzBXsqPDJy1_-A-f8nCF/exec'; // Make sure this is your correct API URL

  const [activities, setActivities] = useState([]);
  const [groupedActivities, setGroupedActivities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlideshow, setActiveSlideshow] = useState(null); // State for slideshow modal
  const [modalImage, setModalImage] = useState(null); // State for single image modal

  useEffect(() => {
    fetch(`${API_URL}?action=getActivities`)
      .then(res => res.json())
      .then(data => {
        if (data.activities) {
          setActivities(data.activities);
          // Group activities by event
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
    return <p className="text-center p-10">Loading activities...</p>;
  }

  return (
    <main>
      <div className="flex justify-between items-center my-8">
        <h1 className="text-4xl font-bold">Hoạt Động Của Nhóm</h1>
        {activities.length > 0 && (
          <button
            onClick={() => setActiveSlideshow(activities)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Play All
          </button>
        )}
      </div>

      {events.length > 0 ? (
        <div className="space-y-12">
          {events.map(event => (
            <section key={event}>
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
                <h2 className="text-3xl font-bold">{event}</h2>
                <button
                  onClick={() => setActiveSlideshow(groupedActivities[event])}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Play Slideshow
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedActivities[event].filter(act => act.imageUrl).map((activity, index) => (
                    <div key={index} className="activity-card">
                      {/* Make the image container clickable for single view */}
                      <div
                        className="w-full h-48 relative cursor-zoom-in"
                        onClick={() => setModalImage(activity.imageUrl)}
                      >
                        <Image src={activity.imageUrl} alt={activity.title} fill className="object-contain rounded-t-lg"/>
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{activity.description}</p>
                      </div>
                    </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-center">Hiện không có hoạt động nào được đăng.</p>
      )}

      {/* Slideshow Modal */}
      {activeSlideshow && (
        <SlideshowModal images={activeSlideshow} onClose={() => setActiveSlideshow(null)} />
      )}

      {/* Single Image Fullscreen Modal */}
      {modalImage && (
        <div className="fullscreen-modal-overlay" onClick={() => setModalImage(null)}>
          <Image
            src={modalImage}
            alt="Expanded Activity Image"
            width={1200} // Adjust size as needed
            height={800} // Adjust size as needed
            className="fullscreen-modal-image"
          />
        </div>
      )}
    </main>
  );
}