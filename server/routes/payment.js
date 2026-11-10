import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { readJson } from '../utils/db.js';

const router = express.Router();

function getRazorpayClient(settings) {
  const keyId = settings?.razorpay?.keyId;
  const keySecret = settings?.razorpay?.keySecret;

  if (keyId && keySecret && !keyId.includes('placeholder')) {
    return new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return null;
}

// Create an order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required.' });
    }

    const settings = await readJson('settings.json');
    const rzp = getRazorpayClient(settings);
    const orderReceipt = receipt || `rec_${Date.now()}`;

    // If active Razorpay credentials exist
    if (rzp) {
      const options = {
        amount: Math.round(amount * 100), // amount in paise
        currency,
        receipt: orderReceipt,
        notes: notes || {}
      };

      const order = await rzp.orders.create(options);
      return res.json({
        success: true,
        isTestMode: false,
        keyId: settings.razorpay.keyId,
        order
      });
    }

    // Seamless Mock / Sandbox fallback for development & preview
    const mockOrderId = `order_test_${Date.now()}`;
    return res.json({
      success: true,
      isTestMode: true,
      keyId: 'rzp_test_mock_key',
      order: {
        id: mockOrderId,
        entity: 'order',
        amount: Math.round(amount * 100),
        amount_paid: 0,
        amount_due: Math.round(amount * 100),
        currency,
        receipt: orderReceipt,
        status: 'created'
      }
    });
  } catch (err) {
    console.error('Razorpay create-order error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to create payment order.' });
  }
});

// Verify payment signature
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const settings = await readJson('settings.json');
    const keySecret = settings?.razorpay?.keySecret;

    // In test/mock mode
    if (!keySecret || keySecret.includes('placeholder')) {
      return res.json({
        success: true,
        verified: true,
        message: 'Test payment verified successfully.',
        paymentId: razorpay_payment_id || `pay_test_${Date.now()}`
      });
    }

    // In live / real test mode
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      return res.json({
        success: true,
        verified: true,
        message: 'Payment verified successfully.',
        paymentId: razorpay_payment_id
      });
    } else {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Invalid payment signature.'
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
});

export default router;

