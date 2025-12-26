import { formatDistanceToNow } from 'date-fns';
import { 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Key, 
  Info,
  Trash2,
  Circle,
  Bell
} from 'lucide-react';
import type { Notification, NotificationType } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { markNotificationAsRead, deleteNotification } from '@/db/api';
import { Skeleton } from '@/components/ui/skeleton';

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onUpdate: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'order_completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'order_canceled':
    case 'order_refunded':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'wallet_credited':
    case 'payment_approved':
      return <DollarSign className="h-4 w-4 text-green-500" />;
    case 'wallet_debited':
    case 'payment_rejected':
      return <DollarSign className="h-4 w-4 text-red-500" />;
    case 'api_key_changed':
      return <Key className="h-4 w-4 text-blue-500" />;
    case 'system_announcement':
      return <Info className="h-4 w-4 text-blue-500" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function NotificationList({ notifications, isLoading, onUpdate }: NotificationListProps) {
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      onUpdate();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-3">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-3/4 bg-muted" />
                <Skeleton className="h-2.5 w-full bg-muted" />
                <Skeleton className="h-2.5 w-1/2 bg-muted" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`p-3 transition-colors ${
            !notification.is_read ? 'bg-accent/50 border-primary/20' : ''
          }`}
        >
          <div className="flex gap-2">
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {getNotificationIcon(notification.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-xs">{notification.title}</h4>
                {!notification.is_read && (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 break-words">
                {notification.message}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                  })}
                </span>
                <div className="flex gap-1">
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="h-6 text-[10px] px-2"
                    >
                      Mark as read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(notification.id)}
                    className="h-6 w-6"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
