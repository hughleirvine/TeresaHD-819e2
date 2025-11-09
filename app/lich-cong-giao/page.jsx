// File: app/lich-cong-giao/page.jsx
"use client";

import { useState, useEffect } from 'react';

export default function CalendarPage() {
  const [calendarHtml, setCalendarHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/get-calendar')
      .then(res => {
        if (!res.ok) {
          throw new Error("Could not load the calendar data from the server.");
        }
        return res.json();
      })
      .then(data => {
        if (data.html) {
          setCalendarHtml(data.html);
        } else {
          setError(data.error || "Calendar content is empty.");
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main>
      {isLoading && (
        <div className="lcgtg">
          <h2>Đang tải Lịch Công Giáo Tuần Này...</h2>
        </div>
      )}

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* This div will render the fetched HTML content */}
      {calendarHtml && (
        <div className="lcgtg" dangerouslySetInnerHTML={{ __html: calendarHtml }} />
      )}
    </main>
  );
}
