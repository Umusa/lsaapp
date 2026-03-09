import { getStudentRows } from './lib/sheets';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function debugData() {
    try {
        const rows = await getStudentRows();
        const headers = rows[0].map((h: any) => String(h || '').trim());
        const instuCol = headers.indexOf('cr69d_instucode');
        
        console.log("Headers:", headers);
        console.log("InstuCode Column Index:", instuCol);
        
        const counts: Record<string, number> = {};
        rows.slice(1).forEach(row => {
            const code = String(row[instuCol] || '').trim();
            counts[code] = (counts[code] || 0) + 1;
        });
        
        console.log("Student counts per instucode:", JSON.stringify(counts, null, 2));
    } catch (e) {
        console.error(e);
    }
}
debugData();
