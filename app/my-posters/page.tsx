'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Trash2,
  Image as ImageIcon,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';

interface PosterRecord {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  templateId?: string;
}

function getStorageKey(email: string): string {
  return `posters:${email}`;
}

export default function MyPostersPage() {
  const { user, loading } = useAuth();
  const [posters, setPosters] = useState<PosterRecord[]>([]);

  useEffect(() => {
    if (!user?.email) {
      setPosters([]);
      return;
    }
    try {
      const raw = localStorage.getItem(getStorageKey(user.email));
      if (raw) {
        setPosters(JSON.parse(raw));
      } else {
        setPosters([]);
      }
    } catch {
      setPosters([]);
    }
  }, [user]);

  const handleDelete = (id: string) => {
    if (!user?.email) return;
    const updated = posters.filter((p) => p.id !== id);
    setPosters(updated);
    localStorage.setItem(getStorageKey(user.email), JSON.stringify(updated));
  };

  const handleDownload = (poster: PosterRecord) => {
    const link = document.createElement('a');
    link.download = `${poster.title || 'poster'}.jpg`;
    link.href = poster.thumbnail;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">લોડ થઈ રહ્યું છે... / Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-lg font-medium text-foreground">
          લોગીન કરો / Please log in
        </p>
        <p className="text-sm text-muted-foreground">
          તમારા પોસ્ટર જોવા માટે લોગીન કરો
        </p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-saffron to-saffron-dark text-white">
            ઘર પર જાઓ / Go Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-mandala">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 glass-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                ઘર / Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
              {user.email}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3 bg-saffron/10 text-saffron-dark">
            મારા પોસ્ટર
          </Badge>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            મારા પોસ્ટર / My Posters
          </h1>
          <p className="mt-2 text-muted-foreground">
            તમે બનાવેલ પોસ્ટરનો ઇતિહાસ
          </p>
        </div>

        {posters.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 py-20 text-center">
            <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">
              હજુ સુધી કોઈ પોસ્ટર બનાવ્યા નથી / No posters yet
            </p>
            <Link href="/" className="mt-4">
              <Button className="bg-gradient-to-r from-saffron to-saffron-dark text-white">
                પોસ્ટર બનાવો / Create Poster
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posters.map((poster) => (
              <div
                key={poster.id}
                className="group relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden">
                  {poster.thumbnail ? (
                    <img
                      src={poster.thumbnail}
                      alt={poster.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="p-4">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {poster.title || 'અનામ પોસ્ટર'}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(poster.createdAt).toLocaleDateString('gu-IN')}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1 text-xs"
                      onClick={() => handleDownload(poster)}
                    >
                      <Download className="h-3 w-3" />
                      ડાઉનલોડ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1 text-xs text-destructive"
                      onClick={() => handleDelete(poster.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      કાઢો
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

 function savePosterToHistory(email: string, record: PosterRecord) {
  try {
    const key = getStorageKey(email);
    const raw = localStorage.getItem(key);
    const existing: PosterRecord[] = raw ? JSON.parse(raw) : [];
    existing.unshift(record);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
  } catch {
    // ignore storage errors
  }
}
