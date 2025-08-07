// File: app/api/get-daily-prayers/route.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  const SPREADSHEET_ID = "1L-k945Fb7CFjDZALwdjCO854aL05B5M-BagtPj0G4vM";
  const SHEET_NAME = "Daily Prayers";

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const currentSetNumber = ((dayOfYear + 3) % 9) + 1;

    const prayersPerSet = 22;
    const setActualStartRow = 2 + (currentSetNumber - 1) * prayersPerSet;
    const range = `${SHEET_NAME}!C${setActualStartRow}:C${setActualStartRow + prayersPerSet - 1}`;
    
    const response = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSheet_ID, range });
    const prayers = response.data.values ? response.data.values.flat() : [];
    
    const formattedPrayers = prayers.map(prayer => {
        const lines = String(prayer).split('\n');
        if (lines.length > 0) {
          lines[0] = `<strong style="color: #007BFF;">${lines[0]}</strong>`;
        }
        return lines.join('\n');
    });

    return NextResponse.json({ currentSetNumber, formattedPrayers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch prayer data' }, { status: 500 });
  }
}
