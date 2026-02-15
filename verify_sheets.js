const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function verifySheets() {
  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const tests = [
    { name: 'Auth Sheet', id: process.env.GOOGLE_SHEETS_ID_AUTH, tab: 'cr69d_usertokens.csv' },
    { name: 'Students Sheet', id: process.env.GOOGLE_SHEETS_ID_STUDENTS, tab: 'cr69d_studentses.csv' },
  ];

  for (const test of tests) {
    console.log(`\nTesting ${test.name} (${test.id})...`);
    try {
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: test.id,
      });
      const titles = spreadsheet.data.sheets.map(s => s.properties.title);
      console.log(`  Available tabs: ${titles.join(', ')}`);
      
      const hasTab = titles.includes(test.tab);
      console.log(`  Target tab "${test.tab}" exists: ${hasTab}`);

      if (hasTab) {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: test.id,
          range: `'${test.tab}'!A1:Z5`,
        });
        console.log(`  Data found: ${response.data.values ? response.data.values.length : 0} rows`);
      }
    } catch (error) {
      console.error(`  Error: ${error.message}`);
    }
  }
}

verifySheets();
