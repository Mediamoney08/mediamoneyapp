import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Key } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">Manage your account security</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Account Security</CardTitle>
              </div>
              <CardDescription>Your account is protected with industry-standard security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Password Protection</p>
                    <p className="text-sm text-muted-foreground">Your password is encrypted and secure</p>
                  </div>
                </div>
                <div className="text-green-500 font-medium">Active</div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Secure Sessions</p>
                    <p className="text-sm text-muted-foreground">Your sessions are protected with JWT tokens</p>
                  </div>
                </div>
                <div className="text-green-500 font-medium">Active</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Tips</CardTitle>
              <CardDescription>Keep your account safe</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Use a strong, unique password for your account</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Never share your password with anyone</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Log out from shared or public devices</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Contact support immediately if you notice suspicious activity</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
