import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { updateStudentRow, deleteStudentRow } from '@/lib/sheets';

export async function PATCH(request: Request) {
    try {
        const { id, data } = await request.json();
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        console.log(`[Students CRUD] Processing update for student: ${id}`);

        let dbUpdated = false;

        // 1. Try to Update Prisma
        try {
            await prisma.student.update({
                where: { cr69d_studentid: id },
                data: {
                    ...data,
                    cr69d_totaloutstanding: data.cr69d_totaloutstanding !== undefined ? parseFloat(String(data.cr69d_totaloutstanding).replace(/[^0-9.-]+/g, '')) : undefined,
                    cr69d_age: data.cr69d_age !== undefined ? parseInt(String(data.cr69d_age)) : undefined,
                    cr69d_datejoined: data.cr69d_datejoined ? new Date(data.cr69d_datejoined) : undefined,
                }
            });
            dbUpdated = true;
            console.log('[Students CRUD] Updated in Database');
        } catch (dbError: any) {
            console.warn('[Students CRUD] Database update failed, proceeding to Sheets:', dbError.message);
        }

        // 2. Always Update Sheets
        await updateStudentRow(id, data);
        console.log('[Students CRUD] Updated in Google Sheets');

        return NextResponse.json({ 
            success: true,
            message: dbUpdated ? 'Updated in all systems' : 'Updated in cloud (Database currently offline)'
        });
    } catch (error: any) {
        console.error('Students PATCH Critical Error:', error);
        return NextResponse.json({ 
            error: 'Failed to update student info. Please check your internet.' 
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        console.log(`[Students CRUD] Processing deletion for student: ${id}`);

        let dbDeleted = false;

        // 1. Try to Delete from Prisma
        try {
            await prisma.student.delete({
                where: { cr69d_studentid: id }
            });
            dbDeleted = true;
            console.log('[Students CRUD] Deleted from Database');
        } catch (dbError: any) {
            console.warn('[Students CRUD] Database delete failed, proceeding to Sheets:', dbError.message);
        }

        // 2. Always Delete from Sheets
        await deleteStudentRow(id);
        console.log('[Students CRUD] Deleted from Google Sheets');

        return NextResponse.json({ 
            success: true,
            message: dbDeleted ? 'Deleted from all systems' : 'Deleted from cloud (Database currently offline)'
        });
    } catch (error: any) {
        console.error('Students DELETE Critical Error:', error);
        return NextResponse.json({ 
            error: 'Failed to remove student record. Please try again.' 
        }, { status: 500 });
    }
}
