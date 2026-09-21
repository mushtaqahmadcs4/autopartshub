import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const formData = await req.formData();
    const responseData = Object.fromEntries(formData.entries());

    const errCode = String(responseData.err_code || '');
    const basketId = String(responseData.basket_id || '');

    // PayFast returns '000' for successful authorization
    if (errCode === '000' || responseData.status === 'SUCCESS') {
      return NextResponse.redirect(
        `${baseUrl}/order-success?basket_id=${encodeURIComponent(basketId)}`,
        303
      );
    } else {
      return NextResponse.redirect(
        `${baseUrl}/checkout?error=payment_failed&code=${encodeURIComponent(errCode)}`,
        303
      );
    }
  } catch (error) {
    console.error('PayFast Callback Processing Error:', error);
    return NextResponse.redirect(`${baseUrl}/checkout?error=callback_error`, 303);
  }
}