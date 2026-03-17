import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '').trim()
      : undefined;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL) {
       console.error('Critical Error: Missing Google credentials in .env.local');
       return NextResponse.json(
         { error: 'Server configuration error: Missing cloud credentials' },
         { status: 500 }
       );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // First, let's get the spreadsheet details to find the correct tab name
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: (process.env.GOOGLE_SHEETS_ID_AUTH || '').replace(/"/g, '').trim(),
    });

    const sheetTitles = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
    // console.log('[Secure Cloud] Verification metadata retrieval');

    // Simplified sheet selection based on user input
    let targetSheet = sheetTitles.find(t => t === 'cr69d_usertokens.csv') || 
                      sheetTitles.find(t => t === 'cr69d_usertokens') ||
                      sheetTitles.find(t => t?.toLowerCase().includes('usertokens')) ||
                      sheetTitles[0];

    if (!targetSheet) {
      return NextResponse.json(
        { error: 'No sheets found in this spreadsheet.' },
        { status: 500 }
      );
    }

    // console.log('[Secure Cloud] Session context established');
    const range = `'${targetSheet}'!A:ZZ`; // Expanded range to include AW and AY

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: (process.env.GOOGLE_SHEETS_ID_AUTH || '').replace(/"/g, '').trim(),
      range: range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: `No data found in sheet: ${targetSheet}` },
        { status: 500 }
      );
    }

    // --- REFINED HEADER DISCOVERY ---
    // Sometimes headers aren't in row 0, or have weird spacing.
    // We search first 10 rows for our headers.
    let usernameColIndex = -1;
    let pinColIndex = -1;
    let headerRowIndex = -1;

    for (let i = 0; i < Math.min(rows.length, 10); i++) {
        const currentRow = rows[i].map((h: any) => String(h || '').trim());
        const uIdx = currentRow.indexOf('cr69d_username');
        const pIdx = currentRow.indexOf('cr69d_pin');
        
        if (uIdx !== -1 && pIdx !== -1) {
            usernameColIndex = uIdx;
            pinColIndex = pIdx;
            headerRowIndex = i;
            break;
        }
    }

    if (usernameColIndex === -1 || pinColIndex === -1) {
      // console.error('[Secure Cloud] Verification index mismatch');
      return NextResponse.json(
        { 
          error: `Could not find columns 'cr69d_username' and 'cr69d_pin' in the first 10 rows.`,
          debug_first_row: rows[0]?.slice(0, 70) // Show a slice of headers for debugging
        },
        { status: 500 }
      );
    }

    // console.log('[Secure Cloud] Verification indices mapped successfully');

    // Find user (skip the header row)
    const userRow = rows.slice(headerRowIndex + 1).find(row => {
        const val = String(row[usernameColIndex] || '').trim();
        return val === username;
    });

    if (!userRow) {
      return NextResponse.json(
        { error: 'Invalid credentials (user not found)' },
        { status: 401 }
      );
    }

    const storedPin = String(userRow[pinColIndex] || '').trim();

    if (storedPin !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials (pin mismatch)' },
        { status: 401 }
      );
    }

    // --- RE-SCAN HEADERS FOR METADATA ---
    const currentHeaders = rows[headerRowIndex].map((h: any) => String(h || '').trim());
    const roleColIndex = currentHeaders.indexOf('cr69d_role');
    const orgColIndex = currentHeaders.indexOf('cr69d_organisation');
    const instuColIndex = currentHeaders.indexOf('cr69d_instucode');

    // --- PRISMA JOIN (REMOVED FOR STEALTH) ---
    let dbStats = { studentCount: 0, dbConnected: true };
    const instuCode = (instuColIndex !== -1 ? userRow[instuColIndex] : null) || 
                      (orgColIndex !== -1 ? userRow[orgColIndex] : null);

    // Success - return user info + Prisma verification results
    const user: any = {
      username: userRow[usernameColIndex],
      dbStats // Include Prisma check results in user object
    };

    if (roleColIndex !== -1) user.role = userRow[roleColIndex];
    if (orgColIndex !== -1) user.organisation = userRow[orgColIndex];
    if (instuColIndex !== -1) user.instuCode = instuCode;

    return NextResponse.json({
      message: 'Login successful',
      user,
    });

  } catch (error: any) {
    console.error('[Secure Cloud] Verification process failed');
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
