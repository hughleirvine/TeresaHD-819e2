// File: app/page.jsx
"use client";

import { useState, useEffect } from 'react';

// NEW: Helper function to convert a standard Google Drive link to an embeddable one
function getEmbedUrl(googleDriveUrl) {
  if (!googleDriveUrl) return '';
  // Replaces the end of the URL to make it embeddable
  return googleDriveUrl.replace("/view?usp=drive_link", "/preview");
}

export default function BulletinPage() {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // NEW: State to hold the URL of the PDF to be displayed in the iframe
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

  // NEW: Function to handle button clicks
  const handleButtonClick = (link) => {
    setEmbedUrl(getEmbedUrl(link));
  };

  return (
    <main>
      <h1>Hiệp Thông Bulletins</h1>

      {isLoading && <p id="loading">Loading latest bulletins...</p>}
      {error && <p id="errorResult">{error}</p>}
      
      <div id="buttonsContainer" style={{ textAlign: center }}>
        {!isLoading && !error && links.map((link, index) => (
          // Buttons now call the handler function instead of opening a new tab
          <button 
            key={index}
            onClick={() => handleButtonClick(link)}
            className="action-button"
          >
            {buttonLabels[index] || `Bulletin #${index + 1}`}
          </button>
        ))}
      </div>

      {/* NEW: Iframe to display the selected PDF */}
      {embedUrl && (
        <div id="pdf-viewer" style={{ marginTop: '20px' }}>
          <iframe
            src={embedUrl}
            style={{ width: '100%', height: '800px', border: '1px solid #ccc' }}
            title="Bulletin PDF Viewer"
          ></iframe>
        </div>
      )}
    </main>
  );
}
