import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { supabase } from '../config/database.js';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

export const sendBookingConfirmation = async (user, event, booking) => {
  const subject = `Booking Confirmation - ${event.title}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed!</h1>
        </div>
        <div class="content">
          <p>Dear ${user.name},</p>
          <p>Your booking has been successfully confirmed for the following event:</p>

          <div class="details">
            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Instructor:</strong> ${event.instructor}</p>
            <p><strong>Amount Paid:</strong> ₹${booking.amount}</p>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
          </div>

          <p>We look forward to seeing you at the event!</p>
          <p>If you have any questions, please contact us.</p>
        </div>
        <div class="footer">
          <p>IIPS Yoga and Fitness Club</p>
          <p>International Institute of Professional Studies, DAVV Indore</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const result = await sendEmail(user.email, subject, html);

  await supabase.from('email_history').insert({
    user_id: user.id,
    booking_id: booking.id,
    email_type: 'booking_confirmation',
    recipient_email: user.email,
    subject,
    body: html,
    status: result.success ? 'sent' : 'failed',
    sent_at: result.success ? new Date().toISOString() : null,
  });

  return result;
};

export const sendPaymentSuccess = async (user, event, booking, paymentId) => {
  const subject = `Payment Successful - ${event.title}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .success { color: #4CAF50; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Successful!</h1>
        </div>
        <div class="content">
          <p>Dear ${user.name},</p>
          <p class="success">Your payment has been successfully processed.</p>

          <div class="details">
            <h3>Payment Details</h3>
            <p><strong>Event:</strong> ${event.title}</p>
            <p><strong>Amount:</strong> ₹${booking.amount}</p>
            <p><strong>Payment ID:</strong> ${paymentId}</p>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <p>Your spot has been reserved for the event. We will send you a reminder before the event date.</p>
        </div>
        <div class="footer">
          <p>IIPS Yoga and Fitness Club</p>
          <p>International Institute of Professional Studies, DAVV Indore</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const result = await sendEmail(user.email, subject, html);

  await supabase.from('email_history').insert({
    user_id: user.id,
    booking_id: booking.id,
    email_type: 'payment_success',
    recipient_email: user.email,
    subject,
    body: html,
    status: result.success ? 'sent' : 'failed',
    sent_at: result.success ? new Date().toISOString() : null,
  });

  return result;
};
