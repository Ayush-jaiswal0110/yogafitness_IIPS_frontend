import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle } from 'lucide-react';
import { Event, User, Booking } from '@/types';
import { db } from '@/lib/database';
import { EmailService } from '@/lib/email';
import PaymentGateway from './PaymentGateway';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  studentId: z.string().min(1, 'Student ID is required'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  event: Event;
  onSuccess: () => void;
}

const BookingForm = ({ event, onSuccess }: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState<{user: User, booking: Booking} | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create user
      const user: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        studentId: data.studentId,
        registrationDate: new Date().toISOString(),
      };

      // Create booking
      const booking: Booking = {
        id: Date.now().toString(),
        userId: user.id,
        eventId: event.id,
        bookingDate: new Date().toISOString(),
        paymentStatus: event.price > 0 ? 'pending' : 'completed',
        amount: event.price,
      };

      // Check if user already exists
      const existingUser = db.getUserByEmail(data.email);
      if (!existingUser) {
        db.addUser(user);
      }

      db.addBooking(booking);

      setBookingData({ user, booking });

      if (event.price > 0) {
        setShowPayment(true);
      } else {
        // Free event - complete booking immediately
        await completeBooking(user, booking);
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeBooking = async (user: User, booking: Booking) => {
    // Update event participant count
    db.updateEvent(event.id, {
      currentParticipants: event.currentParticipants + 1
    });

    // Send confirmation email
    await EmailService.sendBookingConfirmation(user, event, booking.id);
    
    setSuccess(true);
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    if (bookingData) {
      // Update booking with payment info
      db.updateBooking(bookingData.booking.id, {
        paymentStatus: 'completed',
        paymentId: paymentId
      });

      await completeBooking(bookingData.user, bookingData.booking);
      await EmailService.sendPaymentConfirmation(bookingData.user, event, paymentId);
    }
  };

  if (success) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-700 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600">
            Your booking has been confirmed. Check your email for the confirmation details.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showPayment && bookingData) {
    return (
      <PaymentGateway
        amount={event.price}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setShowPayment(false)}
      />
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Book Your Spot</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              {...register('studentId')}
              placeholder="Enter your student ID"
            />
            {errors.studentId && (
              <p className="text-sm text-red-600 mt-1">{errors.studentId.message}</p>
            )}
          </div>

          <Alert>
            <AlertDescription>
              <strong>Event:</strong> {event.title}<br />
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}<br />
              <strong>Time:</strong> {event.time}<br />
              <strong>Price:</strong> {event.price > 0 ? `₹${event.price}` : 'Free'}
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              event.price > 0 ? 'Proceed to Payment' : 'Book Now (Free)'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;