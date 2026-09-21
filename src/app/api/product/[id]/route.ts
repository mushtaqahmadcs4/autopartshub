import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Ensure function name matches your lib/db file
import { AutoPart } from '@/models/autoparts.model';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    await connectDB();

    const product = await AutoPart.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching single product:', error);
    return NextResponse.json(
      { error: 'Server error fetching product' },
      { status: 500 }
    );
  }
}