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
  }, []);

  // This function checks if a string is a direct link to an image file
  const isImageUrl = (url) => {
    return /\.(jpeg|jpg|gif|png|svg)$/i.test(url);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Thông Báo</h1>
      <hr style={{ margin: '20px 0' }} />
      {isLoading ? (
        <p>Loading thông báo...</p>
      ) : (
        <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
          {announcements.map((item, index) => {
            // Check if the item is an image URL
            const isImage = isImageUrl(item);
            
            return (
              <li key={index} style={{
                  marginBottom: '15px',
                  // Only add padding and background for text items
                  padding: isImage ? '0' : '15px',
                  backgroundColor: isImage ? 'transparent' : '#f0f0f0',
                  borderRadius: '5px',
                  color: '#333',
                  whiteSpace: 'pre-wrap'
              }}>
                {isImage ? (
                  // If it's an image, render an <img> tag
                  <img src={item} alt={`Announcement ${index + 1}`} style={{ maxWidth: '100%', borderRadius: '5px' }} />
                ) : (
                  // Otherwise, render the text
                  item
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
