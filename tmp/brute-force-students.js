const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

async function testPermutations(baseId, name) {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL?.replace(/"/g, '').trim(),
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '').trim(),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // Likely variants for 1lwm0SsZB8roRUx07h5RvILIhweTONHwMQxXBitW_Dug
    // Suspects: char at 1 (l), char at 22-23 (IL)
    const variants = [
        '1lwm0SsZB8roRUx07h5RvILIhweTONHwMQxXBitW_Dug', // Original (l...ILI)
        '1lwm0SsZB8roRUx07h5RvILlhweTONHwMQxXBitW_Dug', // (l...ILl)
        '1lwm0SsZB8roRUx07h5RvIllhweTONHwMQxXBitW_Dug', // (l...Ill)
        '1Iwm0SsZB8roRUx07h5RvILIhweTONHwMQxXBitW_Dug', // (I...ILI)
        '1Iwm0SsZB8roRUx07h5RvILlhweTONHwMQxXBitW_Dug', // (I...ILl)
        '1Iwm0SsZB8roRUx07h5RvIllhweTONHwMQxXBitW_Dug', // (I...Ill)
        '1lwm0SsZB8roRUx07h5RvIlIhweTONHwMQxXBitW_Dug', // (l...IlI)
        '1Iwm0SsZB8roRUx07h5RvIlIhweTONHwMQxXBitW_Dug', // (I...IlI)
    ];

    console.log(`\n--- Testing ${name} ---`);
    for (const id of variants) {
        try {
            const res = await sheets.spreadsheets.get({ spreadsheetId: id });
            console.log(`✅ FOUND CORRECT ID FOR ${name}: [${id}] -> Title: ${res.data.properties.title}`);
            return id;
        } catch (e) {
            console.log(`  ❌ [${id}] failed`);
        }
    }
    return null;
}

testPermutations('1lwm0SsZB8roRUx07h5RvILIhweTONHwMQxXBitW_Dug', 'Students Sheet');
