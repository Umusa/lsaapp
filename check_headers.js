const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env.local') });

async function checkHeaders() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID_STUDENTS;

    console.log('Fetching spreadsheet metadata...');
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetTitles = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
    
    console.log('Found sheets:', sheetTitles.join(', '));

    const fs = require('fs');
    let output = '';

    for (const title of sheetTitles) {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `'${title}'!1:1`,
        });
        const headers = response.data.values?.[0] || [];
        output += `\nSheet Name: ${title}\n`;
        output += 'Headers: [\n';
        headers.forEach(h => output += `  '${h}',\n`);
        output += ']\n';
    }

    fs.writeFileSync('headers_output.txt', output);
    console.log('Results saved to headers_output.txt');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkHeaders();
