import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDb from '@/lib/db';
import Order from '@/models/order.model';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      items, 
      shippingAddress, 
      subtotal, 
      shippingFee, 
      totalAmount, 
      paymentMethod, 
      paymentDetails 
    } = body;

    await connectDb();

    // 1. Normalize payment method string
    const normalizedMethod = paymentMethod?.toLowerCase() || 'cod';

    // 2. Determine payment status correctly:
    // EasyPaisa, JazzCash, Bank Transfer, and COD start as unpaid (isPaid: false) until verified or paid on delivery.
    // Card/PayFast will be marked paid after successful callback verification.
    const isPaid = normalizedMethod === 'card';

    // 3. Extract and sanitize payment details for manual wallets
    let sanitizedPaymentDetails = {};

    if (['easypaisa', 'jazzcash', 'bank'].includes(normalizedMethod)) {
      sanitizedPaymentDetails = {
        walletPhone: paymentDetails?.walletPhone || paymentDetails?.easypaisaNumber || shippingAddress?.phone || '',
        transactionId: paymentDetails?.transactionId || paymentDetails?.trxId || '',
        accountHolder: paymentDetails?.accountHolder || '',
      };
    } else if (paymentDetails) {
      sanitizedPaymentDetails = paymentDetails;
    }

    // 4. Create the order in MongoDB
    const newOrder = await Order.create({
      items,
      shippingAddress,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod: normalizedMethod,
      paymentDetails: sanitizedPaymentDetails,
      isPaid,
      orderStatus: 'Pending',
    });

    // 5. Card / PayFast payment payload processing
    if (normalizedMethod === 'card') {
      const merchantId = process.env.PAYFAST_MERCHANT_ID;
      const securedKey = process.env.PAYFAST_SECURED_KEY;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const payfastUrl = process.env.PAYFAST_URL;

      if (!merchantId || !securedKey || !baseUrl || !payfastUrl) {
        return NextResponse.json(
          { success: false, message: 'PayFast configuration missing in .env.local' },
          { status: 500 }
        );
      }

      const basketId = `AUTOPARTS_${newOrder._id}`;
      const formattedAmount = Number(totalAmount).toFixed(2);
      const rawSignature = `${merchantId}${basketId}${formattedAmount}${securedKey}`;
      const token = crypto.createHash('md5').update(rawSignature).digest('hex');

      const payload = {
        merchant_id: merchantId,
        basket_id: basketId,
        txnamt: formattedAmount,
        customer_name: shippingAddress.fullName || 'Valued Customer',
        customer_email: 'test@example.com',
        customer_mobile: shippingAddress.phone || '03001234567',
        redirect_url: `${baseUrl}/api/payfast/callback`,
        token: token,
        proc_code: '00',
      };

      return NextResponse.json({
        success: true,
        orderId: newOrder._id,
        actionUrl: payfastUrl,
        payload,
      });
    }

    // 6. Return success for EasyPaisa, JazzCash, Bank Transfer, and COD
    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      orderId: newOrder._id,
    });

  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while creating order.' },
      { status: 500 }
    );
  }
}