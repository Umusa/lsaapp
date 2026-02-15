import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const org = searchParams.get('org');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, ''),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID_STUDENTS;
    const targetSheet = 'cr69d_studentses.csv';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A:ZZ`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ students: [] });
    }

    const headers = rows[0].map((h: any) => String(h || '').trim());
    const instuCol = headers.indexOf('cr69d_instucode');

    let students = rows.slice(1).map(row => {
        const student: any = {};
        headers.forEach((header, index) => {
            if (header) {
                student[header] = row[index];
            }
        });
        return student;
    });

    // FILTER BY ORGANIZATION if provided
    if (org && instuCol !== -1) {
        students = students.filter(s => String(s.cr69d_instucode || '').trim() === org);
    }

    return NextResponse.json({ students });

  } catch (error: any) {
    console.error('Students API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
