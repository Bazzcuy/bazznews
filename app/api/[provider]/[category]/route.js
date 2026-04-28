import { NextResponse } from 'next/server';
import { fetchRSS } from '@/app/utils/fetchRSS';

export async function GET(request, { params }) {
  const { provider, category } = params;

  const result = await fetchRSS(provider, category);

  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(
      { success: false, message: result.message, data: null },
      { status: 500 }
    );
  }
}
