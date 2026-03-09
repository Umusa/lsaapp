import { getStudentRows } from './lib/sheets';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function dumpHeaders() {
    try {
        const rows = await getStudentRows();
        if (rows && rows.length > 0) {
            const headers = rows[0];
            console.log('--- Google Sheets Headers ---');
            headers.forEach((h: any, i: number) => {
                console.log(`${i}: ${String(h || '').trim()}`);
            });
            console.log('---------------------------');
        } else {
            console.log('No data found in Google Sheets.');
        }
    } catch (error) {
        console.error('Error dumping headers:', error);
    }
}

dumpHeaders();
