'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { login } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/logo';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Sign In
    </Button>
  );
}

const initialState = {
  success: false,
  errors: undefined,
  message: undefined,
}

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(login, initialState);

  useEffect(() => {
    if (state.success) {
      router.push('/');
    }
  }, [state.success, router]);


  return (
    <div className="w-full max-w-sm">
      <form action={formAction}>
        <Card className="shadow-2xl shadow-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo className="h-14 w-14" />
            </div>
            <CardTitle className="text-2xl">Sign in to Agent Forge</CardTitle>
            <CardDescription>Enter your email below to sign in to your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              {state.errors?.email && (
                <p className="text-sm font-medium text-destructive">{state.errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {state.errors?.password && (
                 <p className="text-sm font-medium text-destructive">{state.errors.password}</p>
              )}
            </div>
            {state.message && !state.success && (
              <p className="text-sm font-medium text-destructive text-center">{state.message}</p>
            )}
            <SubmitButton />
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
