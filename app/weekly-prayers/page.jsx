// File: app/daily-prayers/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './prayers.module.css'; // Import the new CSS module

const JESUS_DIVINE_IMAGE_URL = "https://i.imgur.com/PyVG92U.png";

export default function WeeklyPrayersPage() {
  const API_URL = 'https://script.google.com/macros/s/AKfycbyOjM1HbdNG0gU3OPSIj5Q0oU3gIhLcrPT-TFZnSYNpjQtMlzBXsqPDJy1_-A-f8nCF/exec';

  const [prayersData, setPrayersData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const prayersPromise = fetch(`${API_URL}?action=getWklyBiblePrayer`).then(res => res.json());
    const tablePromise = ' ';

    Promise.all([prayersPromise,tablePromise])
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
        <h1>Thánh Kinh Mỗi Tuần</h1>
        <h2>Kinh Chia Sẻ Kinh Thánh</h2>

        {prayersData.formattedPrayers.map((prayer, i) => (
          <div key={i}>
            <div className={styles.prayerSection}>
              <p className={styles.prayerText} dangerouslySetInnerHTML={{ __html: prayer }} />
            </div>

            {i === tableInsertionIndex && tableData.tableData.length > 0 && (
              <table className={styles.additionalTable}>
                <thead>
                  <tr>
                    {tableData.tableData[0].map((header, colIndex) => (
                      <th key={colIndex}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.tableData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
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

      <div className={styles.imageContainer}>
        <Image src={JESUS_DIVINE_IMAGE_URL} alt="Jesus Divine Image" width={200} height={300} style={{width: '100%', height: 'auto'}} priority />
      </div>
    </div>
  );
}
