import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Trash2, Eye, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EmailService } from '@/lib/email';

const EmailHistory = () => {
  const [emails, setEmails] = useState<any[]>([]);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = () => {
    setEmails(EmailService.getEmailHistory());
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all email history?')) {
      EmailService.clearEmailHistory();
      loadEmails();
    }
  };

  const downloadEmail = (email: any) => {
    const blob = new Blob([email.html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket_${email.bookingId || email.paymentId}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email History</h1>
          <p className="text-gray-600">View all sent confirmation emails and tickets</p>
        </div>
        <Button onClick={clearHistory} variant="outline" className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear History
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {emails.length > 0 ? (
          emails.map((email, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <Mail className="mr-2 h-5 w-5" />
                      {email.subject}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">To: {email.to}</p>
                  </div>
                  <Badge variant={email.type === 'booking_confirmation' ? 'default' : 'secondary'}>
                    {email.type === 'booking_confirmation' ? 'Booking' : 'Payment'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Sent:</strong> {new Date(email.sentAt).toLocaleString()}
                    </div>
                    {email.bookingId && (
                      <div>
                        <strong>Booking ID:</strong> {email.bookingId}
                      </div>
                    )}
                    {email.paymentId && (
                      <div>
                        <strong>Payment ID:</strong> {email.paymentId}
                      </div>
                    )}
                    {email.eventDetails && (
                      <div>
                        <strong>Event:</strong> {email.eventDetails.title}
                      </div>
                    )}
                    {email.userDetails && (
                      <div>
                        <strong>Participant:</strong> {email.userDetails.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 pt-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Email Preview</DialogTitle>
                        </DialogHeader>
                        <div 
                          className="border rounded-lg p-4 bg-gray-50"
                          dangerouslySetInnerHTML={{ __html: email.html }}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <Button size="sm" variant="outline" onClick={() => downloadEmail(email)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No emails sent yet</h3>
              <p className="text-gray-600">Email confirmations will appear here once users book events.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmailHistory;