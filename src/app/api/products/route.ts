import { NextResponse } from 'next/server';
import { mockProducts } from '@/data/mockProducts';

export async function GET() {
  return NextResponse.json({ data: mockProducts });
}