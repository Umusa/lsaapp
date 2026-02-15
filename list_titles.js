const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function listTitles() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, ''),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID_STUDENTS;

    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    
    const fs = require('fs');
    let info = `Spreadsheet Title: ${spreadsheet.data.properties.title}\n`;
    info += `Sheet Tabs:\n`;
    spreadsheet.data.sheets.forEach(s => {
        info += `- "${s.properties.title}" (ID: ${s.properties.sheetId})\n`;
    });
    fs.writeFileSync('titles.txt', info);
    console.log('Metadata saved to titles.txt');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

listTitles();
