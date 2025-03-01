// /api/send-email/route.ts
import { handleSendMail } from '@/lib/mail-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, content } = await req.json();
    if (!to || !subject || !content) {
      return NextResponse.json(
        { success: false, error: 'Field Error' },
        { status: 400 }
      );
    }

    const result = await handleSendMail(to, subject, content);
    return NextResponse.json(
      { success: true, message: 'POST API Success', result },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unexpexted Error',
      },
      { status: 500 }
    );
  }
}