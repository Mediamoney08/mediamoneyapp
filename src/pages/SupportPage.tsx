import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createTicket } from '@/db/api';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SupportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/login', { state: { from: '/support' } });
      return;
    }

    if (!form.subject.trim() || !form.message.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await createTicket(user.id, form.subject, form.message);
      toast({
        title: 'Ticket Created',
        description: 'Our support team will respond to you soon',
      });
      setForm({ subject: '', message: '' });
    } catch (error: any) {
      toast({
        title: 'Failed to Create Ticket',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Support Center</h1>
          <p className="text-muted-foreground">We're here to help you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit a Ticket</CardTitle>
              <CardDescription>Describe your issue and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Provide detailed information about your issue"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full gradient-bg" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">How long does delivery take?</h3>
                  <p className="text-sm text-muted-foreground">
                    Digital products are delivered instantly after payment confirmation.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-sm text-muted-foreground">
                    We accept all major credit cards through our secure Stripe payment gateway.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Can I get a refund?</h3>
                  <p className="text-sm text-muted-foreground">
                    Refunds are available within 24 hours if the product code hasn't been used.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Is my payment secure?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, all payments are processed through Stripe with industry-standard encryption.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">support@rechargehub.com</p>
                </div>
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-muted-foreground">Usually within 24 hours</p>
                </div>
                <div>
                  <p className="font-medium">Availability</p>
                  <p className="text-muted-foreground">24/7 Support</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
