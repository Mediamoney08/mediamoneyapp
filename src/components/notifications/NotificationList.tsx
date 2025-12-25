import { formatDistanceToNow } from 'date-fns';
import { 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Key, 
  Info,
  Trash2,
  Circle
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
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'order_canceled':
    case 'order_refunded':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'wallet_credited':
    case 'payment_approved':
      return <DollarSign className="h-5 w-5 text-green-500" />;
    case 'wallet_debited':
    case 'payment_rejected':
      return <DollarSign className="h-5 w-5 text-red-500" />;
    case 'api_key_changed':
      return <Key className="h-5 w-5 text-blue-500" />;
    case 'system_announcement':
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <Circle className="h-5 w-5 text-muted-foreground" />;
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
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-3 w-full bg-muted" />
                <Skeleton className="h-3 w-1/2 bg-muted" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`p-4 transition-colors ${
            !notification.is_read ? 'bg-accent/50 border-primary/20' : ''
          }`}
        >
          <div className="flex gap-3">
            {/* Icon */}
            <div className="shrink-0 mt-1">
              {getNotificationIcon(notification.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                {!notification.is_read && (
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 break-words">
                {notification.message}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">
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
                      className="h-7 text-xs"
                    >
                      Mark as read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(notification.id)}
                    className="h-7 w-7"
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

function Bell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
