import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, Bell } from 'lucide-react';
import { createBroadcastNotification } from '@/db/api';
import type { NotificationType } from '@/types/types';

export default function BroadcastNotification() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'system' as NotificationType,
    title: '',
    message: '',
  });

  const notificationTypes: { value: NotificationType; label: string }[] = [
    { value: 'system', label: 'System Announcement' },
    { value: 'news', label: 'News' },
    { value: 'website_update', label: 'Website Update' },
    { value: 'service_added', label: 'New Service' },
    { value: 'price_update', label: 'Price Update' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.message) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const count = await createBroadcastNotification(
        formData.type,
        formData.title,
        formData.message
      );

      toast({
        title: 'Success',
        description: `Notification sent to ${count} users`,
      });

      // Reset form
      setFormData({
        type: 'system',
        title: '',
        message: '',
      });
    } catch (error) {
      console.error('Error sending broadcast notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send notification',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Broadcast Notification</CardTitle>
            <CardDescription>Send a notification to all users</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Notification Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Notification Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as NotificationType })
              }
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {notificationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter notification title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter notification message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send to All Users
              </>
            )}
          </Button>
        </form>

        {/* Preview */}
        {(formData.title || formData.message) && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="space-y-1">
              {formData.title && (
                <p className="font-semibold">{formData.title}</p>
              )}
              {formData.message && (
                <p className="text-sm text-muted-foreground">{formData.message}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
