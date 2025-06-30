'use client';

import { logout } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Logo from '@/components/logo';

type HeaderProps = {
  session: { user: { email: string } } | null;
};

export default function Header({ session }: HeaderProps) {
  if (!session) {
    return null;
  }

  return (
    <header className="w-full bg-background border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <span className="font-bold text-lg">Agent Forge</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline-block">
            {session.user.email}
          </span>
          <form action={logout}>
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
