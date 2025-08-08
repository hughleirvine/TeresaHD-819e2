// File: app/weekly-prayers/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './prayers.module.css';

const JESUS_DIVINE_IMAGE_URL = "https://i.imgur.com/PyVG92U.png";

export default function WeeklyPrayersPage() {
  const API_URL = 'https://script.google.com/macros/s/AKfycbyOjM1HbdNG0gU3OPSIj5Q0oU3gIhLcrPT-TFZnSYNpjQtMlzBXsqPDJy1_-A-f8nCF/exec'; // Make sure to paste your API URL here

  const [prayersData, setPrayersData] = useState(null);
  // REMOVED: tableData state is no longer needed
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // SIMPLIFIED: Fetch only the daily prayers data
    fetch(`${API_URL}?action=getWklyBiblePrayer`)
      .then(res => res.json())
      .then(prayersResult => {
        if (prayersResult.error) {
          throw new Error(prayersResult.error);
        }
        setPrayersData(prayersResult);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [API_URL]);

  if (isLoading) {
    return <div className={styles.pageWrapper}><div className={styles.container}><h1>Loading Prayers...</h1></div></div>;
  }

  // SIMPLIFIED: Error check no longer includes tableData
  if (error || !prayersData) {
    return <div className={styles.pageWrapper}><div className={styles.container}><h1>Error Loading Page</h1><p>{error || "Data could not be loaded."}</p></div></div>;
  }

  // REMOVED: tableInsertionIndex is no longer needed

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1>KINH THÁNH</h1>
        <h2>Kinh Trước Khi Chia Sẻ</h2>

        {prayersData.formattedPrayers.map((prayer, i) => (
          <div key={i}>
            <div className={styles.prayerSection}>
              <p className={styles.prayerText} dangerouslySetInnerHTML={{ __html: prayer }} />
            </div>
            
            {/* REMOVED: The logic for rendering the additional table is gone */}
          </div>
        ))}

        <div className={styles.footer}>
          Nhóm Teresa Hài Đồng Giêsu 2025
        </div>
      </div>

      <div className={styles.imageContainer}>
        <Image src={JESUS_DIVINE_IMAGE_URL} alt="Jesus Divine Image" width={200} height={300} style={{width: '100%', height: 'auto'}} priority />
      </div>
    </div>
  );
}