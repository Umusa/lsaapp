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
            client_email: (process.env.GOOGLE_CLIENT_EMAIL || '').replace(/"/g, '').trim(),
            private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n').replace(/"/g, '').trim(),
        },
        scopes: [readonly ? 'https://www.googleapis.com/auth/spreadsheets.readonly' : 'https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
}

async function getTargetSheetTitle(sheets: any, spreadsheetId: string, searchPatterns: string[]) {
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetTitles = spreadsheet.data.sheets?.map((s: any) => s.properties?.title) || [];
    
    for (const pattern of searchPatterns) {
        const found = sheetTitles.find((t: string) => t === pattern);
        if (found) return found;
    }

    const fallback = sheetTitles.find((t: string) => 
        searchPatterns.some(p => t?.toLowerCase().includes(p.toLowerCase().replace('.csv', '')))
    ) || sheetTitles[0];

    return fallback;
}

export async function getStudentRows(force = false) {
    const spreadsheetId = (process.env.GOOGLE_SHEETS_ID_STUDENTS || '').replace(/"/g, '').trim();
    const now = Date.now();
    const cacheKey = `students_${spreadsheetId}`;
    const cached = globalCache[cacheKey];

    if (!force && cached && (now - cached.timestamp < CACHE_TTL)) {
        return cached.data;
    }

    try {
        const sheets = await getSheetsInstance(true);
        const targetSheet = await getTargetSheetTitle(sheets, spreadsheetId, ['cr69d_studentses.csv', 'cr69d_studentses', 'students']);

        if (!targetSheet) throw new Error('Secure Cloud: Access configuration mismatch.');
        // console.log(`[Secure Cloud] Data connection initialized for current session.`);

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `'${targetSheet}'!A1:ZZ20000`, 
        });

        const rows = response.data.values || [];
        
        globalCache[cacheKey] = {
            data: rows,
            timestamp: now
        };

        return rows;
    } catch (error) {
        console.error('[Secure Cloud] Connection error during data retrieval');
        if (cached) return cached.data;
        throw error;
    }
}

// Helper to find the best header match for a prisma field
function getHeaderIndex(headers: string[], field: string): number {
    const normalize = (s: string) => s.toLowerCase().replace(/_/g, '').trim();
    const normalizedField = normalize(field);
    
    // 1. Exact match
    let index = headers.findIndex(h => normalize(h) === normalizedField);
    if (index !== -1) return index;

    // 2. Substring match fallback (e.g., 'instucode' matches 'cr69d_instucode')
    index = headers.findIndex(h => {
        const normalizedH = normalize(h);
        return normalizedField.includes(normalizedH) || normalizedH.includes(normalizedField);
    });
    if (index !== -1) return index;

    // 3. Specific fallbacks for critical fields
    if (field === 'cr69d_studentid') {
        const fallbacks = ['cr69d_stuid', 'cr69d_student_id', 'cr69d_id', 'cr69d_regno', 'id', 'studentid'];
        for (const fb of fallbacks) {
            index = headers.findIndex(h => normalize(h) === normalize(fb));
            if (index !== -1) return index;
        }
    }

    if (field === 'cr69d_instucode') {
        const fallbacks = ['instucode', 'organisation', 'school_code', 'org_code', 'org', 'cr69d_instucode'];
        for (const fb of fallbacks) {
            index = headers.findIndex(h => normalize(h) === normalize(fb));
            if (index !== -1) return index;
        }
    }

    if (field === 'cr69d_level') {
        const fallbacks = ['level', 'class', 'grade', 'student_level', 'programme'];
        for (const fb of fallbacks) {
            index = headers.findIndex(h => normalize(h) === normalize(fb));
            if (index !== -1) return index;
        }
    }

    return -1;
}

export async function getStudentsAsObjects(force = false) {
    try {
        const rows = await getStudentRows(force);
        if (rows.length < 2) return [];

        const headers = rows[0];
        
        // Find indices for critical fields
        const idIdx = getHeaderIndex(headers, 'cr69d_studentid');
        const instuIdx = getHeaderIndex(headers, 'cr69d_instucode');
        const levelIdx = getHeaderIndex(headers, 'cr69d_level');

        const students = rows.slice(1).map((row: any[]) => {
            const student: any = {};
            // Map all available headers to keys
            headers.forEach((header: string, index: number) => {
                if (header) {
                    const key = header.trim();
                    student[key] = row[index] || null;
                }
            });
            
            // NORMALIZE CRITICAL FIELDS
            // 1. ID
            if (idIdx !== -1 && row[idIdx]) {
                student.cr69d_studentid = String(row[idIdx]).trim();
            } else if (student.cr69d_student_id) {
                student.cr69d_studentid = String(student.cr69d_student_id).trim();
            } else if (student.cr69d_stuid) {
                student.cr69d_studentid = String(student.cr69d_stuid).trim();
            } else if (student.cr69d_id) {
                student.cr69d_studentid = String(student.cr69d_id).trim();
            }

            // 2. Instucode (Org)
            if (instuIdx !== -1 && row[instuIdx]) {
                student.cr69d_instucode = String(row[instuIdx]).trim();
            }

            // 3. Level (Class)
            if (levelIdx !== -1 && row[levelIdx]) {
                student.cr69d_level = String(row[levelIdx]).trim();
            }

            // 4. Balance
            if (student.cr69d_totaloutstanding === undefined && student.totaloutstanding !== undefined) {
                student.cr69d_totaloutstanding = student.totaloutstanding;
            }

            // 5. Name
            if (!student.cr69d_title && student.title) {
                student.cr69d_title = student.title;
            }

            return student;
        }).filter((s: any) => s.cr69d_studentid || s.cr69d_id || s.cr69d_stuid || s.cr69d_student_id);

        // console.log(`[Secure Cloud] Data retrieval successful.`);
        return students;
    } catch (error) {
        console.error('[Secure Cloud] Object mapping failed.');
        return [];
    }
}

export async function updateStudentRow(id: string, updatedData: any) {
    const spreadsheetId = (process.env.GOOGLE_SHEETS_ID_STUDENTS || '').replace(/"/g, '').trim();
    
    try {
        const sheets = await getSheetsInstance(false);
        const targetSheet = await getTargetSheetTitle(sheets, spreadsheetId, ['cr69d_studentses.csv', 'cr69d_studentses', 'students']);
        
        const rows = await getStudentRows();
        const headers = rows[0];
        
        const idIndex = getHeaderIndex(headers, 'cr69d_studentid');
        if (idIndex === -1) throw new Error('Could not find Student ID column in sheet');
        
        const rowIndex = rows.findIndex(row => String(row[idIndex]) === String(id));
        if (rowIndex === -1) throw new Error(`Student with ID ${id} not found in sheet`);

        const newRow = [...rows[rowIndex]];
        // Map updatedData fields to sheet headers
        Object.keys(updatedData).forEach(key => {
            const colIndex = getHeaderIndex(headers, key);
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
        const cacheKey = `students_${spreadsheetId}`;
        delete globalCache[cacheKey];
        return true;
    } catch (error) {
        console.error('[Secure Cloud] Sync update failed.');
        throw error;
    }
}

export async function deleteStudentRow(id: string) {
    const spreadsheetId = (process.env.GOOGLE_SHEETS_ID_STUDENTS || '').replace(/"/g, '').trim();

    try {
        const sheets = await getSheetsInstance(false);
        const targetSheet = await getTargetSheetTitle(sheets, spreadsheetId, ['cr69d_studentses.csv', 'cr69d_studentses', 'students']);
        
        const rows = await getStudentRows();
        const headers = rows[0];
        const idIndex = getHeaderIndex(headers, 'cr69d_studentid');
        
        if (idIndex === -1) throw new Error('Could not find Student ID column in sheet');

        const rowIndex = rows.findIndex(row => String(row[idIndex]) === String(id));
        if (rowIndex === -1) throw new Error(`Student with ID ${id} not found in sheet`);

        await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range: `'${targetSheet}'!A${rowIndex + 1}:ZZ${rowIndex + 1}`,
        });

        // Invalidate cache
        const cacheKey = `students_${spreadsheetId}`;
        delete globalCache[cacheKey];
        return true;
    } catch (error) {
        console.error('[Secure Cloud] Sync removal failed.');
        throw error;
    }
}

export async function addStudentRow(data: any) {
    const spreadsheetId = (process.env.GOOGLE_SHEETS_ID_STUDENTS || '').replace(/"/g, '').trim();

    try {
        const sheets = await getSheetsInstance(false);
        const targetSheet = await getTargetSheetTitle(sheets, spreadsheetId, ['cr69d_studentses.csv', 'cr69d_studentses', 'students']);
        
        const rows = await getStudentRows();
        const headers = rows[0];

        const newRow = new Array(headers.length).fill('');
        let mappedCount = 0;
        Object.keys(data).forEach(key => {
            const colIndex = getHeaderIndex(headers, key);
            if (colIndex !== -1) {
                newRow[colIndex] = data[key];
                mappedCount++;
            }
        });

        // console.log(`[Secure Cloud] Entry successfully committed.`);
        
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `'${targetSheet}'!A:A`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [newRow] },
        });

        // Invalidate cache
        const cacheKey = `students_${spreadsheetId}`;
        delete globalCache[cacheKey];
        return true;
    } catch (error) {
        console.error('[Secure Cloud] Entry commitment failed.');
        throw error;
    }
}
