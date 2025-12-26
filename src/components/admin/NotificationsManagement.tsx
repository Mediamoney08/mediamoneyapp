import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotificationsManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>NotificationsManagement</CardTitle>
        <CardDescription>
          Manage notificationsmanagement settings and configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This feature is coming soon. Full functionality will be implemented in the next update.
        </p>
      </CardContent>
    </Card>
  );
}
