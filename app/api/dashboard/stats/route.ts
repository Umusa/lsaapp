import { NextResponse } from 'next/server';
import { getStudentRows } from '@/lib/sheets';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const org = searchParams.get('org');

    if (!org) {
      return NextResponse.json({ error: 'Organisation is required' }, { status: 400 });
    }

    const rows = await getStudentRows();
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'No student data found' }, { status: 404 });
    }

    // Header Mapping
    const headers = rows[0].map((h: any) => String(h || '').trim());
    
    // Identified columns from diagnostic
    const instuCol = headers.indexOf('cr69d_instucode');
    const genderCol = headers.indexOf('cr69d_gender');
    const activeCol = headers.indexOf('cr69d_studentactive');
    const balanceCol = headers.indexOf('cr69d_totaloutstanding');
    const emailCol = headers.indexOf('cr69d_emailaddress');
    const whatsappCol = headers.indexOf('cr69d_whatsapppreferrednumber');
    const levelCol = headers.indexOf('cr69d_level');
    const busCol = headers.indexOf('cr69d_bus_subcriber');
    const smsCol = headers.indexOf('cr69d_sms_subscriber');

    if (instuCol === -1) {
        return NextResponse.json({ error: 'Organisation column (cr69d_instucode) not found' }, { status: 500 });
    }

    const allStudents = rows.slice(1);
    
    // FILTER BY INSTUCODE
    const students = allStudents.filter(row => {
        const studentOrg = String(row[instuCol] || '').trim();
        return studentOrg === org;
    });

    // Aggregation logic
    const totalStudents = students.length;
    let activeStudentsCount = 0;
    let maleCount = 0;
    let femaleCount = 0;
    
    // For ratio card: Cleared (< 1) vs Debtors (> 1)
    let ratioCleared = 0;
    let ratioDebtors = 0;

    // For specific count cards
    let clearedBalanceCount = 0; // -1 < balance < 1
    let creditBalanceCount = 0;  // balance < 0
    let totalDebtorsCount = 0;   // balance > 0
    
    let inactiveDebtSum = 0;
    
    let whatsappCount = 0;
    let emailCount = 0;
    let busSubscribers = 0;
    let smsSubscribers = 0;
    const levelsMap: { [key: string]: number } = {};

    students.forEach(student => {
        // Active Status
        const isActive = String(student[activeCol] || '').toUpperCase() === 'TRUE';
        if (isActive) activeStudentsCount++;

        // Balance
        const rawBalance = String(student[balanceCol] || '0').replace(/[^0-9.-]+/g, '');
        const balance = parseFloat(rawBalance) || 0;

        // Gender (PowerFX: Filter Active Male/Female)
        const gender = String(student[genderCol] || '').toLowerCase();
        if (isActive) {
            if (gender === 'male' || gender === 'm') maleCount++;
            else if (gender === 'female' || gender === 'f') femaleCount++;
        }

        // Ratio logic (PowerFX: < 1 vs > 1)
        if (balance < 1) ratioCleared++;
        if (balance > 1) ratioDebtors++;
        
        // Exact counts (PowerFX)
        if (balance < 1 && balance > -1) clearedBalanceCount++;
        if (balance < 0) creditBalanceCount++;
        if (balance > 0) totalDebtorsCount++;

        // Inactive Debt Sum (PowerFX: Sum if Inactive and Balance > 0)
        if (!isActive && balance > 0) {
            inactiveDebtSum += balance;
        }

        // Communication
        if (String(student[whatsappCol] || '').trim().length > 5) whatsappCount++;
        if (String(student[emailCol] || '').trim().includes('@')) emailCount++;

        // Subscribers
        if (busCol !== -1 && String(student[busCol] || '').trim().toUpperCase() === 'TRUE') busSubscribers++;
        if (smsCol !== -1 && String(student[smsCol] || '').trim().toUpperCase() === 'TRUE') smsSubscribers++;

        // Levels
        const level = String(student[levelCol] || 'Unknown').trim();
        if (level) {
            levelsMap[level] = (levelsMap[level] || 0) + 1;
        }
    });

    // Sort levels by count
    const levels = Object.entries(levelsMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const stats = {
        activePercentage: totalStudents ? (activeStudentsCount / totalStudents) * 100 : 0,
        genderRatio: { male: maleCount, female: femaleCount },
        clearedVsDebtors: { cleared: ratioCleared, debtors: ratioDebtors },
        totalStudents,
        clearedBalanceCount,
        creditBalanceCount,
        totalDebtors: totalDebtorsCount,
        inactiveDebtSum,
        whatsappFilled: whatsappCount,
        emailsFilled: emailCount,
        busSubscribers,
        smsSubscribers,
        incompleteProfiles: totalStudents - Math.min(whatsappCount, emailCount),
        levels: levels.slice(0, 10) // Top 10 levels
    };

    return NextResponse.json(stats);

  } catch (error: any) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
