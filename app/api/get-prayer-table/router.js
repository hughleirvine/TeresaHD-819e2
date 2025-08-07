// File: app/api/get-prayer-table/route.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  const SPREADSHEET_ID = "1FRAvxdKIht8TBVrBbAZqBHCshC8ULK67ZT8PAziyO_s";
  const RANGE = "Cầu Nguyện!A1:C15";

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: RANGE });
    
    return NextResponse.json({ tableData: response.data.values || [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch table data' }, { status: 500 });
  }
}
