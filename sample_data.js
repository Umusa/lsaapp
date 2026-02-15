const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function sampleData() {
  try {
    console.log('Env Check:', {
        email: process.env.GOOGLE_CLIENT_EMAIL?.substring(0, 10) + '...',
        hasKey: !!process.env.GOOGLE_PRIVATE_KEY,
        id: process.env.GOOGLE_SHEETS_ID
    });

    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const targetSheet = 'cr69d_studentses.csv';

    console.log('Fetching data from sheet...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A1:ZZ10`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in sheet.');
      return;
    }

    const headers = rows[0].map(h => String(h || '').trim());
    console.log('Headers found:', headers.length);

    const orgCol = headers.indexOf('cr69d_organisation');
    const genderCol = headers.indexOf('cr69d_gender');
    
    console.log('Indexes:', { orgCol, genderCol });

    rows.slice(0, 5).forEach((row, i) => {
        console.log(`Row ${i} Organization: "${row[orgCol]}" | Gender: "${row[genderCol]}" | Title: "${row[headers.indexOf('cr69d_title')]}"`);
    });

  } catch (error) {
    console.error('CRITICAL ERROR:', error);
  }
}

sampleData();
