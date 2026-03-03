import { getStudentRows } from './lib/sheets';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        const rows = await getStudentRows();
        console.log('Headers:', rows[0]);
        console.log('Row count:', rows.length);
    } catch (e) {
        console.error(e);
    }
}
test();
