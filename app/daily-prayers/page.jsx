// File: app/daily-prayers/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './prayers.module.css';

const JESUS_DIVINE_IMAGE_URL = "https://i.imgur.com/PyVG92U.png";

export default function DailyPrayersPage() {
  const API_URL = 'https://script.google.com/macros/s/AKfycbyOjM1HbdNG0gU3OPSIj5Q0oU3gIhLcrPT-TFZnSYNpjQtMlzBXsqPDJy1_-A-f8nCF/exec';

  const [prayersData, setPrayersData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageVisible, setIsImageVisible] = useState(true);
  
  // NEW STATE: For controlling the full-screen modal
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const prayersPromise = fetch(`${API_URL}?action=getDailyPrayers`).then(res => res.json());
    const tablePromise = fetch(`${API_URL}?action=getPrayerTable`).then(res => res.json());

    Promise.all([prayersPromise, tablePromise])
      .then(([prayersResult, tableResult]) => {
        if (prayersResult.error || tableResult.error) {
          throw new Error(prayersResult.error || tableResult.error);
        }
        setPrayersData(prayersResult);
        setTableData(tableResult);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [API_URL]);

  const toggleImage = () => {
    setIsImageVisible(!isImageVisible);
  };

  // NEW FUNCTIONS: To open and close the modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isLoading) {
    return <div className={styles.pageWrapper}><div className={styles.container}><h1>Loading Prayers...</h1></div></div>;
  }

  if (error || !prayersData || !tableData) {
    return <div className={styles.pageWrapper}><div className={styles.container}><h1>Error Loading Page</h1><p>{error || "Data could not be loaded."}</p></div></div>;
  }

  const tableInsertionIndex = 7;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1>TUẦN CỬU NHẬT (Ngày Thứ {prayersData.currentSetNumber})</h1>
        <h2>Kinh Lòng Chúa Thương Xót</h2>

        {prayersData.formattedPrayers.map((prayer, i) => (
          <div key={i}>
            <div className={styles.prayerSection}>
              <p className={styles.prayerText} dangerouslySetInnerHTML={{ __html: prayer }} />
            </div>

            {i === tableInsertionIndex && tableData.tableData.length > 0 && (
              <table className={styles.additionalTable}>
                <thead>
                  <tr>{tableData.tableData[0].map((h, c) => <th key={c}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {tableData.tableData.slice(1).map((r, ri) => (
                    <tr key={ri}>{r.map((c, ci) => <td key={ci}>{c}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}

        <div className={styles.footer}>
          Nhóm Teresa Hài Đồng Giêsu 2025
        </div>
      </div>

      <div className={`${styles.imageContainer} ${!isImageVisible ? styles.imageCollapsed : ''}`}>
        <button onClick={toggleImage} className={styles.toggleButton}>
          {isImageVisible ? '›' : '‹'}
        </button>
        {/* MODIFIED: Add onClick to Image to open modal */}
        <Image 
          src={JESUS_DIVINE_IMAGE_URL} 
          alt="Jesus Divine Image" 
          width={200} 
          height={300} 
          style={{width: '100%', height: 'auto', cursor: 'zoom-in'}} 
          priority 
          onClick={openModal} /* Add this line */
        />
      </div>

      {/* NEW: Full-screen Modal for expanded image */}
      {isModalOpen && (
        <div className={styles.fullscreenModalOverlay} onClick={closeModal}>
          <Image
            src={JESUS_DIVINE_IMAGE_URL}
            alt="Expanded Jesus Divine Image"
            width={1200} // Set a larger default width for the modal image
            height={1800} // Set a larger default height for the modal image
            className={styles.fullscreenModalImage}
            priority
          />
        </div>
      )}
    </div>
  );
}