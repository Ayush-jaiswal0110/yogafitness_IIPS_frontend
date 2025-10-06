import { User, Event } from '@/types';

// Email ticket template generator
export class EmailService {
  private static generateTicketHTML(user: User, event: Event, bookingId: string): string {
    const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const eventTime = new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Booking Confirmation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .ticket-container {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            border-radius: 15px;
            padding: 30px;
            margin: 20px 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .ticket-header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }
        .ticket-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .ticket-header p {
            margin: 5px 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .ticket-body {
            background: white;
            border-radius: 10px;
            padding: 25px;
            margin: 20px 0;
        }
        .ticket-row {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .ticket-row:last-child {
            border-bottom: none;
        }
        .ticket-label {
            font-weight: bold;
            color: #666;
            width: 40%;
        }
        .ticket-value {
            color: #333;
            width: 60%;
            text-align: right;
        }
        .booking-id {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            border-left: 4px solid #ff6b35;
        }
        .booking-id strong {
            color: #ff6b35;
            font-size: 18px;
        }
        .instructions {
            background: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
        }
        .instructions h3 {
            color: #28a745;
            margin-top: 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background: white;
            border-radius: 10px;
        }
        .footer p {
            margin: 5px 0;
            color: #666;
        }
        .qr-placeholder {
            width: 100px;
            height: 100px;
            background: #f0f0f0;
            border: 2px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px auto;
            border-radius: 8px;
            color: #999;
            font-size: 12px;
        }
        @media (max-width: 600px) {
            .ticket-row {
                flex-direction: column;
            }
            .ticket-label, .ticket-value {
                width: 100%;
                text-align: left;
            }
            .ticket-value {
                margin-top: 5px;
                font-weight: bold;
            }
        }
    </style>
</head>
<body>
    <div class="ticket-container">
        <div class="ticket-header">
            <h1>🧘‍♀️ FITNESS & YOGA CLUB</h1>
            <p>International Institute of Professional Studies</p>
            <p>DAVV Indore</p>
        </div>
        
        <div class="ticket-body">
            <h2 style="text-align: center; color: #ff6b35; margin-bottom: 25px;">
                🎫 EVENT BOOKING CONFIRMATION
            </h2>
            
            <div class="booking-id">
                <p style="margin: 0; color: #666;">Booking Reference</p>
                <strong>${bookingId}</strong>
            </div>
            
            <div class="ticket-row">
                <span class="ticket-label">👤 Participant Name:</span>
                <span class="ticket-value">${user.name}</span>
            </div>
            
            <div class="ticket-row">
                <span class="ticket-label">🆔 Student ID:</span>
                <span class="ticket-value">${user.studentId}</span>
            </div>
            
            <div class="ticket-row">
                <span class="ticket-label">📧 Email:</span>
                <span class="ticket-value">${user.email}</span>
            </div>
            
            <div class="ticket-row">
                <span class="ticket-label">📱 Phone:</span>
                <span class="ticket-value">${user.phone}</span>
            </div>
            
            <div class="ticket-row">
                <span class="ticket-label">🏃‍♀️ Event:</span>
                <span class="ticket-value">${event.title}</span>
            </div>
            
            <div class="ticket-row">
                <span class="ticket-label">📅 Date:</span>
                <span class="ticket-value">${eventDate}</span>
            </div>
            
            <div class="ticket-row">
                <span class="ticket-label">🕐 Time:</span>
                <span class="ticket-value">${eventTime}</span>
            </div>
            
            <div class="ticket-row">
                <span class="ticket-label">📍 Venue:</span>
                <span class="ticket-value">${event.location}</span>
            </div>
            
            <div class="ticket-row">
                <span class="ticket-label">👨‍🏫 Instructor:</span>
                <span class="ticket-value">${event.instructor}</span>
            </div>
            
            <div class="ticket-row">
                <span class="ticket-label">💰 Amount Paid:</span>
                <span class="ticket-value">${event.price > 0 ? `₹${event.price}` : 'Free'}</span>
            </div>
        </div>
        
        <div class="instructions">
            <h3>📋 Important Instructions:</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Please arrive 15 minutes before the scheduled time</li>
                <li>Bring your own yoga mat and water bottle</li>
                <li>Wear comfortable workout clothes</li>
                <li>Show this ticket at the venue for entry</li>
                <li>Contact us if you need to reschedule or cancel</li>
            </ul>
        </div>
        
        <div class="qr-placeholder">
            QR Code
            <br>
            (Scan at venue)
        </div>
    </div>
    
    <div class="footer">
        <p><strong>Fitness & Yoga Club</strong></p>
        <p>International Institute of Professional Studies, DAVV Indore</p>
        <p>📧 fitness@iips.edu.in | 📞 +91 731 123 4567</p>
        <p style="font-size: 12px; color: #999; margin-top: 15px;">
            This is an auto-generated email. Please do not reply to this email.
        </p>
    </div>
</body>
</html>
    `;
  }

  static async sendBookingConfirmation(user: User, event: Event, bookingId: string): Promise<boolean> {
    try {
      // Generate the ticket HTML
      const ticketHTML = this.generateTicketHTML(user, event, bookingId);
      
      // Create email content
      const emailData = {
        to: user.email,
        subject: `🎫 Booking Confirmed: ${event.title} - Fitness & Yoga Club IIPS`,
        html: ticketHTML,
        from: 'fitness@iips.edu.in',
        bookingId: bookingId,
        eventDetails: {
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location,
          instructor: event.instructor
        },
        userDetails: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          studentId: user.studentId
        }
      };

      // Simulate email sending (in real implementation, this would call an email service)
      console.log('📧 SENDING BOOKING CONFIRMATION EMAIL:');
      console.log('To:', emailData.to);
      console.log('Subject:', emailData.subject);
      console.log('Booking ID:', emailData.bookingId);
      console.log('Event:', emailData.eventDetails.title);
      console.log('Date & Time:', `${emailData.eventDetails.date} at ${emailData.eventDetails.time}`);
      console.log('Venue:', emailData.eventDetails.location);
      console.log('Participant:', emailData.userDetails.name);
      console.log('Student ID:', emailData.userDetails.studentId);
      
      // Store email in localStorage for demo purposes
      const emailHistory = JSON.parse(localStorage.getItem('email_history') || '[]');
      emailHistory.push({
        ...emailData,
        sentAt: new Date().toISOString(),
        type: 'booking_confirmation'
      });
      localStorage.setItem('email_history', JSON.stringify(emailHistory));

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success notification
      alert(`✅ Booking confirmation email sent successfully to ${user.email}!\n\n` +
            `📧 Email includes:\n` +
            `• Digital ticket with QR code\n` +
            `• Event details: ${event.title}\n` +
            `• Date: ${new Date(event.date).toLocaleDateString()}\n` +
            `• Time: ${event.time}\n` +
            `• Venue: ${event.location}\n` +
            `• Booking ID: ${bookingId}\n\n` +
            `Please check your email inbox and spam folder.`);
      
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      alert('❌ Failed to send confirmation email. Please contact support.');
      return false;
    }
  }

  static async sendPaymentConfirmation(user: User, event: Event, paymentId: string): Promise<boolean> {
    try {
      const emailData = {
        to: user.email,
        subject: `💳 Payment Confirmed: ₹${event.price} - ${event.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 20px; border-radius: 10px; text-align: center;">
              <h1>💳 Payment Successful!</h1>
              <p>Your payment has been processed successfully</p>
            </div>
            
            <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 10px; border: 1px solid #ddd;">
              <h2 style="color: #28a745;">Payment Details</h2>
              <p><strong>Payment ID:</strong> ${paymentId}</p>
              <p><strong>Amount:</strong> ₹${event.price}</p>
              <p><strong>Event:</strong> ${event.title}</p>
              <p><strong>Participant:</strong> ${user.name}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                This payment confirmation is for your records. Your booking ticket has been sent separately.
              </p>
            </div>
          </div>
        `,
        paymentId: paymentId,
        amount: event.price
      };

      console.log('💳 SENDING PAYMENT CONFIRMATION EMAIL:');
      console.log('To:', emailData.to);
      console.log('Payment ID:', emailData.paymentId);
      console.log('Amount:', `₹${emailData.amount}`);

      // Store payment email in localStorage
      const emailHistory = JSON.parse(localStorage.getItem('email_history') || '[]');
      emailHistory.push({
        ...emailData,
        sentAt: new Date().toISOString(),
        type: 'payment_confirmation'
      });
      localStorage.setItem('email_history', JSON.stringify(emailHistory));

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Payment confirmation email failed:', error);
      return false;
    }
  }

  // Admin function to view email history
  static getEmailHistory(): any[] {
    return JSON.parse(localStorage.getItem('email_history') || '[]');
  }

  // Admin function to clear email history
  static clearEmailHistory(): void {
    localStorage.removeItem('email_history');
  }
}