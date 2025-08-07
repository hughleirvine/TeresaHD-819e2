// File: app/daily-prayers/page.jsx
import Image from 'next/image';

const JESUS_DIVINE_IMAGE_URL = "https://i.imgur.com/PyVG92U.png";

async function getPageData() {
  // Use absolute URLs for fetching on the server
  const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  
  try {
    const [prayersRes, tableRes] = await Promise.all([
      fetch(`${domain}/api/get-daily-prayers`, { cache: 'no-store' }),
      fetch(`${domain}/api/get-prayer-table`, { cache: 'no-store' }),
    ]);

    if (!prayersRes.ok || !tableRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const prayersData = await prayersRes.json();
    const tableData = await tableRes.json();

    return { prayersData, tableData };
  } catch (error) {
    console.error("Error fetching page data:", error);
    return { error: error.message };
  }
}


export default async function DailyPrayersPage() {
  const { prayersData, tableData, error } = await getPageData();

  if (error) {
    return <div className="container"><h1>Error Loading Page</h1><p>{error}</p></div>
  }

  // Find the prayer to insert the table after (prayer #8, which is at index 7)
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

            {/* Insert the table after the specified prayer */}
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
        <Image src={JESUS_DIVINE_IMAGE_URL} alt="Jesus Divine Image" width={200} height={300} style={{width: '100%', height: 'auto'}} />
      </div>
    </>
  );
}
