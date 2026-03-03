import { getStudentRows } from '../lib/sheets';
import { prisma } from '../lib/db';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function migrate() {
    console.log('🚀 Starting Data Migration: Google Sheets -> Supabase');
    
    try {
        const rows = await getStudentRows();
        if (!rows || rows.length <= 1) {
            console.log('⚠️ No data found to migrate.');
            return;
        }

        const headers = rows[0].map((h: any) => String(h || '').trim());
        const rawStudents = rows.slice(1);

        console.log(`📊 Found ${rawStudents.length} students. Mapping fields...`);

        const studentsToInsert = rawStudents.map((row) => {
            const student: any = {};
            headers.forEach((header, index) => {
                if (header) student[header] = row[index];
            });

            // Prepare for Prisma
            return {
                cr69d_studentid: String(student.cr69d_studentid || '').trim(),
                cr69d_title: student.cr69d_title,
                cr69d_gender: student.cr69d_gender,
                cr69d_level: student.cr69d_level,
                cr69d_instucode: String(student.cr69d_instucode || '').trim(),
                cr69d_studentactive: String(student.cr69d_studentactive).toLowerCase() === 'true',
                cr69d_totaloutstanding: parseFloat(String(student.cr69d_totaloutstanding || '0').replace(/[^0-9.-]+/g, '')) || 0,
                cr69d_emailaddress: student.cr69d_emailaddress,
                cr69d_guardianname: student.cr69d_guardianname,
                cr69d_guardianphone: student.cr69d_guardianphone || student.cr69d_contact_number,
                cr69d_guardianwhatsapp: student.cr69d_whatsapppreferrednumber || student.cr69d_guardianwhatsapp,
                cr69d_address: student.cr69d_address,
                cr69d_age: parseInt(student.cr69d_age) || 0,
                cr69d_section: student.cr69d_section,
                cr69d_legacyregno: student.cr69d_legacyregno,
                cr69d_datejoined: student.cr69d_datejoined ? new Date(student.cr69d_datejoined) : null,
                cr69d_medication: student.cr69d_medication || student.cr69d_medication_information,
                cr69d_sportweartype: student.cr69d_sportweartype,
                cr69d_contactmethod: student.cr69d_contactmethod || student.cr69d_preferredmethodofcontact,
                cr69d_sessionjoined: student.cr69d_sessionjoined,
                cr69d_termjoined: student.cr69d_termjoined,
                cr69d_bus_subcriber: String(student.cr69d_bus_subcriber).toLowerCase() === 'true',
                cr69d_sms_subscriber: String(student.cr69d_sms_subscriber).toLowerCase() === 'true',
            };
        }).filter(s => s.cr69d_studentid);

        console.log('⚡ Upserting to Supabase...');
        
        let successCount = 0;
        for (const scholar of studentsToInsert) {
            try {
                await prisma.student.upsert({
                    where: { cr69d_studentid: scholar.cr69d_studentid },
                    update: scholar,
                    create: scholar,
                });
                successCount++;
                if (successCount % 10 === 0) console.log(`✅ Processed ${successCount}/${studentsToInsert.length}...`);
            } catch (err) {
                console.error(`❌ Failed to migrate student ${scholar.cr69d_studentid}:`, err);
            }
        }

        console.log(`\n🎉 Migration Complete! Successfully synced ${successCount} students.`);
    } catch (error) {
        console.error('💀 Fatal Migration Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
