// File: app/daily-prayers/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const JESUS_DIVINE_IMAGE_URL = "https://i.imgur.com/PyVG92U.png";

export default function DailyPrayersPage() {
  // PASTE YOUR NEW GOOGLE SCRIPT URL HERE
  const API_URL = 'https://script.google.com/macros/s/AKfycbyOjM1HbdNG0gU3OPSIj5Q0oU3gIhLcrPT-TFZnSYNpjQtMlzBXsqPDJy1_-A-f8nCF/exec';

  const [prayersData, setPrayersData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  if (isLoading) {
    return <div className="container" style={{color: '#333'}}><h1>Loading Prayers...</h1></div>;
  }

  if (error || !prayersData || !tableData) {
    return <div className="container" style={{color: '#333'}}><h1>Error Loading Page</h1><p>{error || "Data could not be loaded."}</p></div>;
  }

  const tableInsertionIndex = 7;

  return (
    <>
      <div className="container">
        <h1>TUẦN CỬU NHẬT (Ngày Thứ {prayersData.currentSetNumber})</h1>
        <h2>Kinh Lòng Chúa Thương Xót</h2>

        {prayersData.formattedPrayers.map((prayer, i) => (
          <div key={i}>
            <div className="prayer-section">
              <p className="prayer-text" dangerouslySetInnerHTML={{ __html: prayer }} />
            </div>

            {i === tableInsertionIndex && tableData.tableData.length > 0 && (
              <table className="additional-table">
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

        <div className="footer">
          Nhóm Teresa Hài Đồng Giêsu 2025
        </div>
      </div>

      <div className="image-container">
        <Image src={JESUS_DIVINE_IMAGE_URL} alt="Jesus Divine Image" width={200} height={300} style={{width: '100%', height: 'auto'}} priority />
      </div>
    </>
  );
}
