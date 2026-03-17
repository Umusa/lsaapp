const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

async function testPermutations(baseId, name) {
    const chars = baseId.split('');
    const suspectIndices = [];
    chars.forEach((c, i) => {
        if (c.toLowerCase() === 'l' || c.toLowerCase() === 'i' || c === '1') {
            suspectIndices.push(i);
        }
    });

    // Limit to 4 suspects to avoid too many requests
    const limitedSuspects = suspectIndices.slice(0, 4);
    const variants = [];
    
    function generate(index, currentId) {
        if (index === limitedSuspects.length) {
            variants.push(currentId);
            return;
        }
        const sIdx = limitedSuspects[index];
        const possible = ['l', 'I', '1'];
        for (const p of possible) {
            const nextChars = currentId.split('');
            nextChars[sIdx] = p;
            generate(index + 1, nextChars.join(''));
        }
    }

    generate(0, baseId);

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL?.replace(/"/g, '').trim(),
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '').trim(),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    console.log(`\n--- Testing ${name} (${variants.length} variants) ---`);
    for (const id of variants) {
        try {
            const res = await sheets.spreadsheets.get({ spreadsheetId: id });
            console.log(`✅ FOUND CORRECT ID FOR ${name}: [${id}] -> Title: ${res.data.properties.title}`);
            return id;
        } catch (e) {
            // console.log(`  ❌ [${id}] fail: ${e.message.slice(0, 30)}`);
        }
    }
    console.log(`❌ No variants worked for ${name}`);
    return null;
}

async function run() {
    const authId = '1fZXI8DG6ye-jjO8OwdXA8tU9D0x1sUt1L2aW0SLs_SI';
    const studentId = '1lwm0SsZB8roRUx07h5RvILIhweTONHwMQxXBitW_Dug';

    await testPermutations(authId, 'Auth Sheet');
    await testPermutations(studentId, 'Students Sheet');
}

run();
