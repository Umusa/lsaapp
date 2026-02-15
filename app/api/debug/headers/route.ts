import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client_email = process.env.GOOGLE_CLIENT_EMAIL;
    const private_key = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    if (!client_email || !private_key || !spreadsheetId) {
      return NextResponse.json({ 
        error: "Missing environment variables",
        env: {
          hasEmail: !!client_email,
          hasKey: !!private_key,
          hasId: !!spreadsheetId
        }
      }, { status: 500 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email,
        private_key: private_key.replace(/\\n/g, '\n').replace(/"/g, ''),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheet = await sheets.spreadsheets.get({ 
        spreadsheetId: spreadsheetId.trim() 
    });
    const sheetTitles = (spreadsheet.data.sheets || [])
        .map(s => s.properties?.title)
        .filter((t): t is string => !!t);
    
    const results: Record<string, any> = {};

    for (const title of sheetTitles) {
        try {
          const response = await sheets.spreadsheets.values.get({
              spreadsheetId: spreadsheetId.trim(),
              range: `'${title}'!1:1`,
          });
          results[title] = response.data.values?.[0] || ["(Empty Sheet)"];
        } catch (err: any) {
          results[title] = `Error: ${err.message}`;
        }
    }

    return NextResponse.json({ 
        spreadsheetId,
        sheetCount: sheetTitles.length,
        sheetTitles, 
        headers: results 
    });

  } catch (error: any) {
    console.error('Debug API Error:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.response?.data?.error || "Check server logs"
    }, { status: 500 });
  }
}
