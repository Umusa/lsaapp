const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '').trim();
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.replace(/"/g, '').trim();
const spreadsheetId = process.env.GOOGLE_SHEETS_ID_STUDENTS?.replace(/"/g, '').trim();

async function run() {
    console.log(`Testing ID: [${spreadsheetId}]`);
    console.log(`Client Email: ${clientEmail}`);
    
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: { client_email: clientEmail, private_key: privateKey },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        const sheets = google.sheets({ version: 'v4', auth });
        
        console.log("Fetching spreadsheet metadata...");
        const meta = await sheets.spreadsheets.get({ spreadsheetId });
        console.log("SUCCESS! Sheets found:", meta.data.sheets.map(s => s.properties.title));
    } catch (e) {
        console.log("ERROR TYPE:", e.code || e.message);
        console.log("ERROR DETAILS:", e.message);
        if (e.response) {
            console.log("RESPONSE DATA:", JSON.stringify(e.response.data, null, 2));
        }
    }
}

run();
