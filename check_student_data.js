const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function checkStudentHeaders() {
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
    const targetSheet = 'studentt';

    console.log(`Checking sheet: ${targetSheet} in spreadsheet: ${spreadsheetId}`);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!1:1`,
    });

    const headers = response.data.values?.[0] || [];
    console.log('\n--- HEADERS FOUND ---');
    console.log(JSON.stringify(headers, null, 2));
    
    // Sample data
    const sampleResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${targetSheet}'!2:4`,
    });
    console.log('\n--- SAMPLE DATA (Rows 2-4) ---');
    console.log(JSON.stringify(sampleResponse.data.values, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response?.data) {
        console.error('Full Error Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

checkStudentHeaders();
