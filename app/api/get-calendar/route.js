// File: app/api/get-calendar/route.js
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  const url = 'https://loichuahomnay.vn/lich-cong-giao';
  const baseUrl = 'https://loichuahomnay.vn';

  try {
    const response = await fetch(url, {
      // Revalidate cache every hour to get fresh data
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch content, status: ${response.status}`);
    }

    const htmlContent = await response.text();
    const $ = cheerio.load(htmlContent);

    // Find the main calendar container
    const calendarDiv = $('.lcgtg');

    // Fix all relative links to be absolute
    calendarDiv.find('a').each((i, link) => {
      const href = $(link).attr('href');
      if (href && !href.startsWith('http')) {
        $(link).attr('href', baseUrl + href);
      }
      // Make all links open in a new tab
      $(link).attr('target', '_blank').attr('rel', 'noopener noreferrer');
    });

    const cleanedHtml = calendarDiv.html();

    if (!cleanedHtml) {
      throw new Error("Calendar content (.lcgtg) could not be found. The source website structure may have changed.");
    }

    return NextResponse.json({ html: cleanedHtml });

  } catch (e) {
    console.error("Error in get-calendar API:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
