import { NextResponse } from 'next/server';
import { getStudentRows } from '@/lib/sheets';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const org = searchParams.get('org');

    const rows = await getStudentRows();
    if (!rows || rows.length === 0) {
      return NextResponse.json({ students: [] });
    }

    const headers = rows[0].map((h: any) => String(h || '').trim());
    const instuCol = headers.indexOf('cr69d_instucode');

    let students = rows.slice(1).map(row => {
        const student: any = {};
        headers.forEach((header, index) => {
            if (header) {
                student[header] = row[index];
            }
        });
        return student;
    });

    // FILTER BY ORGANIZATION (instuCode) if provided
    if (org && instuCol !== -1) {
        students = students.filter(s => String(s.cr69d_instucode || '').trim() === org);
    }

    return NextResponse.json({ students });

  } catch (error: any) {
    console.error('Students API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
