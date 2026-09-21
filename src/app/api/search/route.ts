import { NextResponse } from 'next/server';
import  connectDB from '@/lib/db'; // Adjust path if your DB connector is located elsewhere
import { AutoPart } from '@/models/autoparts.model';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim() === '') {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    await connectDB();

    const regex = new RegExp(query.trim(), 'i');

    const products = await AutoPart.find({
      $or: [
        { name: { $regex: regex } },
        { brand: { $regex: regex } },
        { partNumber: { $regex: regex } },
        { category: { $elemMatch: { $regex: regex } } },
        { description: { $regex: regex } },
      ],
    })
      .select('name price image category brand partNumber _id')
      .limit(6)
      .lean();

    return NextResponse.json({ products }, { status: 200 });
  } catch (error: any) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Failed to execute search' },
      { status: 500 }
    );
  }
}