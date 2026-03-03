import { google } from 'googleapis';

// In-memory cache for student data
interface CacheEntry {
    data: any[][];
    timestamp: number;
}

const CACHE_TTL = 300000; // 5 minutes for better performance

// Persist cache across HMR reloads in development
const globalForSheets = global as unknown as {
  globalCache: { [key: string]: CacheEntry }
};

const globalCache = globalForSheets.globalCache || {};
if (process.env.NODE_ENV !== 'production') globalForSheets.globalCache = globalCache;

async function getSheetsInstance(readonly = true) {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, ''),
        },
        scopes: [readonly ? 'https://www.googleapis.com/auth/spreadsheets.readonly' : 'https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
}

export async function getStudentRows() {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID_STUDENTS;
    const targetSheet = 'cr69d_studentses.csv';
    const cacheKey = `${spreadsheetId}-${targetSheet}`;

    const now = Date.now();
    const cached = globalCache[cacheKey];

    if (cached && (now - cached.timestamp < CACHE_TTL)) {
        console.log('Performance: Returning cached student data');
        return cached.data;
    }

    try {
        console.log('Performance: Fetching live student data from Google Sheets');
        const sheets = await getSheetsInstance(true);
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `'${targetSheet}'!A1:AM1000`, // Narrower range for significant speed boost
        });

        const rows = response.data.values || [];
        
        // Update cache
        globalCache[cacheKey] = {
            data: rows,
            timestamp: now
        };

        return rows;
    } catch (error) {
        console.error('Performance Error: Failed to fetch sheets data:', error);
        if (cached) return cached.data;
        throw error;
    }
}

export async function updateStudentRow(id: string, updatedData: any) {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID_STUDENTS;
    const targetSheet = 'cr69d_studentses.csv';
    
    try {
        const sheets = await getSheetsInstance(false);
        const rows = await getStudentRows();
        const headers = rows[0];
        const idIndex = headers.indexOf('cr69d_studentid');
        
        const rowIndex = rows.findIndex(row => row[idIndex] === id);
        if (rowIndex === -1) throw new Error('Student not found');

        // Prepare updated row
        const newRow = [...rows[rowIndex]];
        Object.keys(updatedData).forEach(key => {
            const colIndex = headers.indexOf(key);
            if (colIndex !== -1) {
                newRow[colIndex] = updatedData[key];
            }
        });

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `'${targetSheet}'!A${rowIndex + 1}:ZZ${rowIndex + 1}`,
            valueInputOption: 'RAW',
            requestBody: { values: [newRow] },
        });

        // Invalidate cache
        const cacheKey = `${spreadsheetId}-${targetSheet}`;
        delete globalCache[cacheKey];
        
        return true;
    } catch (error) {
        console.error('Failed to update student:', error);
        throw error;
    }
}

export async function deleteStudentRow(id: string) {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID_STUDENTS;
    const targetSheet = 'cr69d_studentses.csv';

    try {
        const sheets = await getSheetsInstance(false);
        const rows = await getStudentRows();
        const headers = rows[0];
        const idIndex = headers.indexOf('cr69d_studentid');
        
        const rowIndex = rows.findIndex(row => row[idIndex] === id);
        if (rowIndex === -1) throw new Error('Student not found');

        // Clear row range (Google Sheets doesn't have a direct "delete row" values API, 
        // usually we'd use batchUpdate but for simplicity clearing values is safer/faster for now)
        await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range: `'${targetSheet}'!A${rowIndex + 1}:ZZ${rowIndex + 1}`,
        });

        // Invalidate cache
        const cacheKey = `${spreadsheetId}-${targetSheet}`;
        delete globalCache[cacheKey];

        return true;
    } catch (error) {
        console.error('Failed to delete student:', error);
        throw error;
    }
}
