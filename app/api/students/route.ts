import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const org = searchParams.get('org');

    if (!org) {
      return NextResponse.json({ error: 'Missing organization code' }, { status: 400 });
    }

    let students = [];
    try {
      const cloudStorage = await import('@/lib/sheets');
      const allStudents = await cloudStorage.getStudentsAsObjects();
      
      const normalizedOrg = String(org).trim().toLowerCase();
      
      // --- REWRITTEN FILTER LOGIC ---
      students = allStudents.filter((s: any) => {
        // Convert both to strings and trim to ensure "2" matches "2 " or 2
        const sOrg = String(s.cr69d_instucode || '').trim().toLowerCase();
        
        // MATCH ONLY BY ORG: We remove the 'isActive !== false' restriction 
        // so you see EVERY student assigned to this institution.
        return sOrg === normalizedOrg;
      });

      // Sort alphabetically by title/name
      students.sort((a: any, b: any) => (a.cr69d_title || '').localeCompare(b.cr69d_title || ''));

      // Log the counts to your VS Code terminal for debugging
      console.log(`[Registry] Found ${allStudents.length} total rows in Sheet.`);
      console.log(`[Registry] Filtered down to ${students.length} for Org: ${normalizedOrg}`);

    } catch (cloudError: any) {
      return NextResponse.json({ error: 'Data link unavailable' }, { status: 500 });
    }

    // Return the full list
    return NextResponse.json({ 
      count: students.length, 
      students 
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Communication error' }, { status: 500 });
  }
}