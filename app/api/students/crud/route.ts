import { NextResponse } from 'next/server';
import { updateStudentRow, deleteStudentRow } from '@/lib/sheets';

export async function PATCH(request: Request) {
    try {
        const { id, data } = await request.json();
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await updateStudentRow(id, data);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await deleteStudentRow(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
