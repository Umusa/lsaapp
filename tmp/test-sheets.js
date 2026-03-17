const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

async function test() {
    try {
        const rawAuthId = process.env.GOOGLE_SHEETS_ID_AUTH;
        const rawStudentId = process.env.GOOGLE_SHEETS_ID_STUDENTS;
        const rawEmail = process.env.GOOGLE_CLIENT_EMAIL;
        const rawKey = process.env.GOOGLE_PRIVATE_KEY;

        const authSheetId = (rawAuthId || '').replace(/"/g, '').trim();
        const studentSheetId = (rawStudentId || '').replace(/"/g, '').trim();

        console.log(`Auth ID: [${authSheetId}] (Raw length: ${rawAuthId?.length})`);
        console.log(`Student ID: [${studentSheetId}] (Raw length: ${rawStudentId?.length})`);
        console.log(`Email: [${rawEmail?.replace(/"/g, '').trim()}]`);

        const privateKey = rawKey?.replace(/\\n/g, '\n').replace(/"/g, '').trim();
        console.log(`Key starts with: [${privateKey?.substring(0, 30)}...]`);

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: rawEmail?.replace(/"/g, '').trim(),
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Test list of sheets to verify access
        console.log('\n--- Attempting Sheet 1 (Auth) ---');
        try {
            const res1 = await sheets.spreadsheets.get({ spreadsheetId: authSheetId });
            console.log('✅ Auth success:', res1.data.properties.title);
        } catch (e) {
            console.log('❌ Auth failure:', e.message);
        }

        console.log('\n--- Attempting Sheet 2 (Students) ---');
        try {
            const res2 = await sheets.spreadsheets.get({ spreadsheetId: studentSheetId });
            console.log('✅ Students success:', res2.data.properties.title);
        } catch (e) {
            console.log('❌ Students failure:', e.message);
        }

    } catch (err) {
        console.error('CRITICAL:', err);
    }
}

test();
