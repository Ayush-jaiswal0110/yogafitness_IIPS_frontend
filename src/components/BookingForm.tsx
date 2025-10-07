import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle } from 'lucide-react';
import { Event, Booking } from '@/types';
import { api } from '@/lib/api';
import { AuthService } from '@/lib/auth';
import PaymentGateway from './PaymentGateway';

interface BookingFormProps {
  event: Event;
  onSuccess: () => void;
}

const BookingForm = ({ event, onSuccess }: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const user = AuthService.getCurrentUser();

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="py-8">
          <Alert>
            <AlertDescription>
              Please login or register to book this event.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const handleBooking = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.bookings.create(event.id);
      setBookingData(response.booking);

      if (response.requiresPayment) {
        setShowPayment(true);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    if (bookingData) {
      try {
        await api.bookings.verifyPayment(bookingData.id, paymentId, `ORDER_${bookingData.id}`);
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } catch (err: any) {
        setError(err.message || 'Payment verification failed');
      }
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
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Event:</strong> {event.title}<br />
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}<br />
            <strong>Time:</strong> {event.time}<br />
            <strong>Price:</strong> {event.price > 0 ? `₹${event.price}` : 'Free'}
          </AlertDescription>
        </Alert>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleBooking}
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
      </CardContent>
    </Card>
  );
};

export default BookingForm;