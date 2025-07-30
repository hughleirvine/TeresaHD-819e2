// File: app/api/get-bulletins/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const targetUrl = 'https://www.vietcatholiccenter.org/hi%E1%BB%87p-th%C3%B4ng';
  const count = 3;
  const links = [];

  try {
    const response = await fetch(targetUrl);
    const htmlContent = await response.text();

    // The same regex you used before to find the Google Drive links
    const driveLinkRegex = /https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view\?usp=drive_link/g;
    let match;

    while ((match = driveLinkRegex.exec(htmlContent)) !== null && links.length < count) {
      links.push(match[0]);
    }

    // Return the found links as a JSON object
    return NextResponse.json({ links });

  } catch (e) {
    console.error("Error fetching or parsing URL:", e);
    // Return an error message in a JSON object
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
