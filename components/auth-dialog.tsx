'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { Mail, LogOut, CheckCircle2, Loader2 } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { user, signInWithOtp, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!email.trim()) return;
    setSending(true);
    setError(null);
    const { error: errMsg } = await signInWithOtp(email.trim());
    setSending(false);
    if (errMsg) {
      setError(errMsg);
    } else {
      setSent(true);
    }
  };

  const handleLogout = async () => {
    await signOut();
    onOpenChange(false);
    setEmail('');
    setSent(false);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {user ? (
          <>
            <DialogHeader>
              <DialogTitle>તમારું એકાઉન્ટ / Your Account</DialogTitle>
              <DialogDescription>
                તમે લોગીન થયેલ છો / You are logged in
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron/15">
                  <Mail className="h-5 w-5 text-saffron" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">લોગીન થયેલ / Logged in</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full gap-2 text-destructive"
              >
                <LogOut className="h-4 w-4" />
                લોગઆઉટ / Logout
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>લોગીન / Login</DialogTitle>
              <DialogDescription>
                તમારો ઈમેઈલ દાખલ કરો અને OTP મેળવો
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {sent ? (
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      ઈમેઈલ મોકલાયો! / Email sent!
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {email} પર મોકલેલ લિંક પર ક્લિક કરીને લોગીન કરો.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSent(false);
                      setEmail('');
                    }}
                  >
                    ફરી પ્રયાસ કરો / Try again
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="auth-email">ઈમેઈલ / Email</Label>
                    <Input
                      id="auth-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  <Button
                    onClick={handleSendOtp}
                    disabled={sending || !email.trim()}
                    className="w-full gap-2 bg-gradient-to-r from-saffron to-saffron-dark text-white"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        મોકલી રહ્યા છીએ...
                      </>
                    ) : (
                      'OTP મોકલો / Send OTP'
                    )}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    ઈમેઈલ પર મેજિક લિંક મળશે. તેના પર ક્લિક કરીને લોગીન કરો.
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
