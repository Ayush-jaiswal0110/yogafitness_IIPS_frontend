import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, ArrowLeft } from 'lucide-react';

interface PaymentGatewayProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

const PaymentGateway = ({ amount, onSuccess, onCancel }: PaymentGatewayProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhonePePayment = async () => {
    setIsProcessing(true);
    
    // Simulate PhonePe payment process
    try {
      // In a real implementation, you would integrate with PhonePe API
      // For demo purposes, we'll simulate the payment process
      
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      
      // Generate a mock payment ID
      const paymentId = `PHONEPE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate successful payment (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        onSuccess(paymentId);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Payment</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            <div className="flex justify-between items-center">
              <span>Amount to pay:</span>
              <span className="font-bold text-lg">₹{amount}</span>
            </div>
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h3 className="font-semibold">Choose Payment Method</h3>
          
          <Button
            onClick={handlePhonePePayment}
            disabled={isProcessing}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay with PhonePe
              </>
            )}
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>Secure payment powered by PhonePe</p>
            <p className="mt-1">Your payment information is safe and encrypted</p>
          </div>
        </div>

        <Alert>
          <AlertDescription className="text-xs">
            <strong>Note:</strong> This is a demo payment gateway. In a real implementation, 
            you would be redirected to PhonePe's secure payment page.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default PaymentGateway;