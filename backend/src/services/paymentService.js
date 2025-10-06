import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env.js';

export const initiatePayment = async (amount, userInfo, eventInfo) => {
  const orderId = `ORDER_${uuidv4()}`;
  const transactionId = `TXN_${uuidv4()}`;

  const paymentRequest = {
    orderId,
    transactionId,
    amount,
    currency: 'INR',
    userInfo: {
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
    },
    eventInfo: {
      title: eventInfo.title,
      date: eventInfo.date,
    },
    callbackUrl: `${config.frontend.url}/payment/callback`,
    redirectUrl: `${config.frontend.url}/payment/status`,
  };

  return {
    success: true,
    paymentUrl: `${config.frontend.url}/payment/gateway`,
    orderId,
    transactionId,
    paymentRequest,
  };
};

export const verifyPayment = async (paymentId, orderId) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    paymentId,
    orderId,
    status: 'completed',
    verifiedAt: new Date().toISOString(),
  };
};

export const refundPayment = async (paymentId, amount) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const refundId = `REFUND_${uuidv4()}`;

  return {
    success: true,
    refundId,
    paymentId,
    amount,
    status: 'refunded',
    refundedAt: new Date().toISOString(),
  };
};
