const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '').trim();
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.replace(/"/g, '').trim();

async function run() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: { client_email: clientEmail, private_key: privateKey },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        const sheets = google.sheets({ version: 'v4', auth });
        const studentId = process.env.GOOGLE_SHEETS_ID_STUDENTS;
        
        console.log('Fetching spreadsheet metadata...');
        const response = await sheets.spreadsheets.get({ spreadsheetId: studentId });
        const sheetTitle = response.data.sheets[0].properties.title;
        console.log('Target Sheet Title:', sheetTitle);
        
        console.log('Fetching first 5 rows...');
        const data = await sheets.spreadsheets.values.get({ 
            spreadsheetId: studentId, 
            range: `'${sheetTitle}'!A1:ZZ5` 
        });
        
        const output = {
            title: sheetTitle,
            rowCount: data.data.values ? data.data.values.length : 0,
            headers: data.data.values ? data.data.values[0] : [],
            sampleRows: data.data.values ? data.data.values.slice(1) : []
        };
        
        fs.writeFileSync('debug_sheets_raw.json', JSON.stringify(output, null, 2));
        console.log('Dumped raw data to debug_sheets_raw.json');
    } catch (e) {
        console.error('ERROR:', e.message);
    }
}

run();
