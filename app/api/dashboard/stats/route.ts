import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const org = searchParams.get('org');

    if (!org) {
      return NextResponse.json({ error: 'Organisation is required' }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, ''),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID_STUDENTS;

    // Use the verified tab name
    const targetSheet = 'cr69d_studentses.csv';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A:ZZ`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'No student data found' }, { status: 404 });
    }

    // Header Discovery
    const headers = rows[0].map((h: any) => String(h || '').trim());
    console.log('Live Student Headers:', headers);

    const orgCol = headers.indexOf('cr69d_organisation');
    const genderCol = headers.indexOf('cr69d_gender');
    const statusCol = headers.indexOf('cr69d_status');
    const balanceCol = headers.indexOf('cr69d_balance');
    const emailCol = headers.indexOf('cr69d_email');
    const whatsappCol = headers.indexOf('cr69d_whatsapp');

    // Filter students by organization
    const students = rows.slice(1).filter(row => {
        return String(row[orgCol] || '').trim().toLowerCase() === org.toLowerCase();
    });

    // Aggregation logic
    const totalStudents = students.length;
    let activeStudents = 0;
    let maleCount = 0;
    let femaleCount = 0;
    let clearedCount = 0;
    let debtorCount = 0;
    let whatsappCount = 0;
    let emailCount = 0;
    let creditBalanceCount = 0;

    students.forEach(student => {
        // Active Status
        const status = String(student[statusCol] || '').toLowerCase();
        if (status === 'active' || status === '1') activeStudents++;

        // Gender
        const gender = String(student[genderCol] || '').toLowerCase();
        if (gender === 'male' || gender === 'm') maleCount++;
        else if (gender === 'female' || gender === 'f') femaleCount++;

        // Balance
        const rawBalance = String(student[balanceCol] || '0').replace(/[^0-9.-]+/g, '');
        const balance = parseFloat(rawBalance) || 0;
        
        if (balance <= 0) clearedCount++;
        else debtorCount++;
        
        if (balance < 0) creditBalanceCount++;

        // Communication
        if (String(student[whatsappCol] || '').trim().length > 5) whatsappCount++;
        if (String(student[emailCol] || '').trim().includes('@')) emailCount++;
    });

    const stats = {
        activePercentage: totalStudents ? (activeStudents / totalStudents) * 100 : 0,
        genderRatio: { male: maleCount, female: femaleCount },
        clearedVsDebtors: { cleared: clearedCount, debtors: debtorCount },
        totalStudents,
        clearedBalanceCount: clearedCount,
        creditBalanceCount,
        totalDebtors: debtorCount,
        whatsappFilled: whatsappCount,
        emailsFilled: emailCount,
        incompleteProfiles: totalStudents - Math.min(whatsappCount, emailCount)
    };

    return NextResponse.json(stats);

  } catch (error: any) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
