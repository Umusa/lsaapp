const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '').trim();
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.replace(/"/g, '').trim();

async function testId(id) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: { client_email: clientEmail, private_key: privateKey },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        const sheets = google.sheets({ version: 'v4', auth });
        await sheets.spreadsheets.get({ spreadsheetId: id });
        return true;
    } catch (e) {
        return false;
    }
}

async function run() {
    const base = "1lwm0SsZB8roRUx07h5RvILlhweTONHwMQxXBitW_Dug";
    // Target sections: 
    // Index 1: 'l' (pos 1)
    // Index 21: 'I' (pos 21)
    // Index 22: 'L' (pos 22)
    // Index 23: 'l' (pos 23)
    // Index 36: 'i' (pos 36)
    
    const options = {
        1: ['l', 'I', '1'],
        21: ['I', 'l', '1'],
        23: ['l', 'I', '1'],
        36: ['i', 'l', 'I', '1']
    };

    console.log("Starting brute force for Students ID...");
    
    for (let char1 of options[1]) {
        for (let char21 of options[21]) {
            for (let char23 of options[23]) {
                for (let char36 of options[36]) {
                    let id = base.split('');
                    id[1] = char1;
                    id[21] = char21;
                    id[23] = char23;
                    id[36] = char36;
                    let testStr = id.join('');
                    
                    const works = await testId(testStr);
                    if (works) {
                        console.log(`\n✅ FOUND WORKING ID: ${testStr}`);
                        process.exit(0);
                    }
                    process.stdout.write(".");
                }
            }
        }
    }
    console.log("\n❌ No working ID found among checked permutations.");
}

run();
