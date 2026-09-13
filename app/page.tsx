'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Landmark,
  Sparkles,
  Store,
  Megaphone,
  Search,
  Menu,
  X,
  ChevronRight,
  Star,
  TrendingUp,
  Palette,
  Download,
  Heart,
  ArrowRight,
  Crown,
  CheckCircle2,
  User,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { AuthDialog } from '@/components/auth-dialog';

type Category = {
  id: string;
  name: string;
  gujaratiName: string;
  description: string;
  icon: typeof Landmark;
  gradient: string;
  bgGradient: string;
  iconBg: string;
  count: string;
  accentText: string;
  borderHover: string;
};

const categories: Category[] = [
  {
    id: 'sarkari-yojana',
    name: 'Sarkari Yojana',
    gujaratiName: 'સરકારી યોજના',
    description: 'સરકારી યોજનાના પોસ્ટર બનાવો',
    icon: Landmark,
    gradient: 'from-blue-600 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    iconBg: 'bg-blue-100',
    count: '૨૫૦+ ટેમ્પલેટ',
    accentText: 'text-blue-700',
    borderHover: 'hover:border-blue-300',
  },
  {
    id: 'festival',
    name: 'Festival',
    gujaratiName: 'તહેવાર',
    description: 'તહેવારના સુંદર પોસ્ટર બનાવો',
    icon: Sparkles,
    gradient: 'from-saffron to-gold',
    bgGradient: 'from-amber-50 to-orange-50',
    iconBg: 'bg-amber-100',
    count: '૩૦૦+ ટેમ્પલેટ',
    accentText: 'text-saffron-dark',
    borderHover: 'hover:border-amber-300',
  },
  {
    id: 'business',
    name: 'Business',
    gujaratiName: 'બિઝનેસ',
    description: 'બિઝનેસ પ્રમોશન પોસ્ટર',
    icon: Store,
    gradient: 'from-teal to-emerald-500',
    bgGradient: 'from-teal-50 to-emerald-50',
    iconBg: 'bg-teal-100',
    count: '૨૦૦+ ટેમ્પલેટ',
    accentText: 'text-teal-dark',
    borderHover: 'hover:border-teal-300',
  },
  {
    id: 'political',
    name: 'Political',
    gujaratiName: 'રાજકીય',
    description: 'રાજકીય પ્રચાર પોસ્ટર',
    icon: Megaphone,
    gradient: 'from-maroon to-rose-600',
    bgGradient: 'from-rose-50 to-red-50',
    iconBg: 'bg-rose-100',
    count: '૧૫૦+ ટેમ્પલેટ',
    accentText: 'text-maroon',
    borderHover: 'hover:border-rose-300',
  },
];

type Template = {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  image: string;
  badge?: string;
  popular?: boolean;
};

const templates: Template[] = [
  {
    id: 't1',
    title: 'દીવાળી શુભેચ્છા પોસ્ટર',
    category: 'festival',
    categoryLabel: 'તહેવાર',
    image:
      'https://images.pexels.com/photos/3913942/pexels-photo-3913942.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    badge: 'નવું',
    popular: true,
  },
  {
    id: 't2',
    title: 'પ્રધાનમંત્રી આવાસ યોજના',
    category: 'sarkari-yojana',
    categoryLabel: 'સરકારી યોજના',
    image:
      'https://images.pexels.com/photos/39119983/pexels-photo-39119983.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    badge: 'લોકપ્રિય',
    popular: true,
  },
  {
    id: 't3',
    title: 'ઉત્તરાયણ પર્વ પોસ્ટર',
    category: 'festival',
    categoryLabel: 'તહેવાર',
    image:
      'https://images.pexels.com/photos/14546935/pexels-photo-14546935.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 't4',
    title: 'ગ્રામ્ય બિઝનેસ પ્રમોશન',
    category: 'business',
    categoryLabel: 'બિઝનેસ',
    image:
      'https://images.pexels.com/photos/19566900/pexels-photo-19566900.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    badge: 'નવું',
  },
  {
    id: 't5',
    title: 'ચૂંટણી પ્રચાર પોસ્ટર',
    category: 'political',
    categoryLabel: 'રાજકીય',
    image:
      'https://images.pexels.com/photos/16136353/pexels-photo-16136353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    badge: 'લોકપ્રિય',
    popular: true,
  },
  {
    id: 't6',
    title: 'હોળી ફેસ્ટિવલ પોસ્ટર',
    category: 'festival',
    categoryLabel: 'તહેવાર',
    image:
      'https://images.pexels.com/photos/913775/pexels-photo-913775.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 't7',
    title: 'સુકી શેરી દુકાન પોસ્ટર',
    category: 'business',
    categoryLabel: 'બિઝનેસ',
    image:
      'https://images.pexels.com/photos/13369323/pexels-photo-13369323.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 't8',
    title: 'સ્વચ્છ ભારત અભિયાન',
    category: 'sarkari-yojana',
    categoryLabel: 'સરકારી યોજના',
    image:
      'https://images.pexels.com/photos/38958648/pexels-photo-38958648.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    badge: 'નવું',
  },
];

export default function Home() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiPromptText, setAiPromptText] = useState('');
  const [authOpen, setAuthOpen] = useState(false);

  const handleAiPoster = () => {
    if (!aiPromptText.trim()) return;
    router.push(`/editor?ai_prompt=${encodeURIComponent(aiPromptText.trim())}`);
  };

  const filteredTemplates =
    activeCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-background bg-mandala">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 glass-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-saffron to-gold shadow-md">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-foreground">
                  ગુજરાત પોસ્ટર
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Poster Maker
                </span>
              </div>
            </div>

            <nav className="hidden items-center gap-1 md:flex">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    document
                      .getElementById('templates')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {cat.name}
                </button>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              {user ? (
                <>
                  <Link href="/my-posters">
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      મારા પોસ્ટર
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4" />
                    લોગઆઉટ
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground"
                  onClick={() => setAuthOpen(true)}
                >
                  <User className="h-4 w-4" />
                  લોગીન / Login
                </Button>
              )}
              <Button
                size="sm"
                className="bg-gradient-to-r from-saffron to-saffron-dark text-white shadow-md hover:shadow-lg transition-shadow"
              >
                પોસ્ટર બનાવો
              </Button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="મેનુ"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="border-t border-border/40 py-4 md:hidden">
              <nav className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setMobileMenuOpen(false);
                      document
                        .getElementById('templates')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.name}
                    <span className="text-xs">— {cat.gujaratiName}</span>
                  </button>
                ))}
                <div className="mt-2 flex gap-2 px-3">
                  {user ? (
                    <>
                      <Link href="/my-posters" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-1.5">
                          <User className="h-4 w-4" />
                          મારા પોસ્ટર
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5"
                        variant="outline"
                        onClick={() => signOut()}
                      >
                        <LogOut className="h-4 w-4" />
                        લોગઆઉટ
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => setAuthOpen(true)}
                    >
                      <User className="h-4 w-4" />
                      લોગીન / Login
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-saffron to-saffron-dark text-white"
                  >
                    પોસ્ટર બનાવો
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-saffron/15 blur-3xl animate-float" />
          <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-teal/12 blur-3xl animate-float-delayed" />
          <div className="absolute left-1/2 top-40 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-28 lg:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-4 py-1.5 animate-fade-in-up">
              <Sparkles className="h-4 w-4 text-saffron" />
              <span className="text-sm font-medium text-saffron-dark">
                ૧૦૦૦+ ગુજરાતી પોસ્ટર ટેમ્પલેટ
              </span>
            </div>

            {/* Main heading */}
            <h1
              className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl animate-fade-in-up"
              style={{ animationDelay: '0.1s', opacity: 0 }}
            >
              બધા જ પ્રકારના
              <br />
              <span className="bg-gradient-to-r from-saffron via-gold to-saffron-dark bg-clip-text text-transparent animate-gradient">
                ગુજરાતી પોસ્ટર
              </span>
              <br />
              બનાવો
            </h1>

            {/* Subheading */}
            <p
              className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl animate-fade-in-up"
              style={{ animationDelay: '0.2s', opacity: 0 }}
            >
              સરકારી યોજના, તહેવાર, બિઝનેસ અને રાજકીય પોસ્ટર — બધું જ એક જ જગ્યાએ,
              ગુજરાતી ફોન્ટમાં, ફટાફટ બનાવો.
            </p>

            {/* Search bar */}
            <div
              className="mx-auto mt-8 flex max-w-xl items-center gap-2 animate-fade-in-up"
              style={{ animationDelay: '0.3s', opacity: 0 }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="પોસ્ટર શોધો... (e.g. દીવાળી, યોજના)"
                  className="h-12 rounded-full border-border/60 bg-white/80 pl-12 pr-4 text-base shadow-sm backdrop-blur-sm"
                />
              </div>
              <Button
                size="lg"
                className="h-12 rounded-full bg-gradient-to-r from-saffron to-saffron-dark px-6 text-white shadow-md hover:shadow-lg transition-shadow"
              >
                શોધો
              </Button>
            </div>

            {/* Stats */}
            <div
              className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 animate-fade-in-up"
              style={{ animationDelay: '0.4s', opacity: 0 }}
            >
              {[
                { icon: Palette, value: '૧૦૦૦+', label: 'ટેમ્પલેટ' },
                { icon: Download, value: '૫૦,૦૦૦+', label: 'ડાઉનલોડ' },
                { icon: Star, value: '૪.૮', label: 'રેટિંગ' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <stat.icon className="h-5 w-5 text-saffron" />
                  <div className="text-left">
                    <div className="text-xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative">
          <svg
            className="block h-12 w-full text-muted/30"
            viewBox="0 0 1440 48"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,32L80,26.7C160,21,320,11,480,16C640,21,800,43,960,42.7C1120,43,1280,21,1360,10.7L1440,0L1440,48L1360,48C1280,48,1120,48,960,48C800,48,640,48,480,48C320,48,160,48,80,48L0,48Z"
            />
          </svg>
        </div>
      </section>

      {/* AI Prompt Section */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gold-light">AI પાવર્ડ</span>
            </div>
            <h2 className="text-balance text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Prompt લખીને પોસ્ટર બનાવો <span className="inline-block">✨</span>
            </h2>
            <p className="mt-3 text-white/60">
              તમારો વિચાર લખો અને AI તમારા માટે પોસ્ટર ડિઝાઇન બનાવશે
            </p>
            <div className="mt-8 space-y-3">
              <Textarea
                value={aiPromptText}
                onChange={(e) => setAiPromptText(e.target.value)}
                placeholder="દા.ત. દીવાળીની શુભેચ્છા પોસ્ટર, રંગબેરંગી દીવા અને ફૂલો સાથે..."
                className="min-h-[120px] resize-none rounded-2xl border-white/10 bg-white/5 px-5 py-4 text-base text-white placeholder:text-white/40 backdrop-blur-sm"
              />
              <Button
                size="lg"
                onClick={handleAiPoster}
                className="h-14 w-full rounded-2xl bg-gradient-to-r from-saffron to-saffron-dark px-8 text-lg text-white shadow-lg transition-all hover:shadow-xl sm:w-auto"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                AI પોસ્ટર બનાવો
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge
              variant="secondary"
              className="mb-3 bg-saffron/10 text-saffron-dark"
            >
              શ્રેણીઓ
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              પોસ્ટર શ્રેણી પસંદ કરો
            </h2>
            <p className="mt-3 text-muted-foreground">
              તમારી જરૂરિયાત મુજબ શ્રેણી પસંદ કરી પોસ્ટર બનાવવાનું શરૂ કરો
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, idx) => (
              <Card
                key={cat.id}
                className={`group relative cursor-pointer overflow-hidden border-2 border-transparent ${cat.borderHover} bg-gradient-to-br ${cat.bgGradient} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-scale-in`}
                style={{ animationDelay: `${idx * 0.1}s`, opacity: 0 }}
                onClick={() => {
                  setActiveCategory(cat.id);
                  document
                    .getElementById('templates')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <CardHeader className="pb-3">
                  <div
                    className={`mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${cat.iconBg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <cat.icon
                      className={`h-7 w-7 ${cat.accentText}`}
                    />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {cat.name}
                  </CardTitle>
                  <CardDescription className="text-sm font-medium text-muted-foreground">
                    {cat.gujaratiName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {cat.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold ${cat.accentText}`}
                    >
                      {cat.count}
                    </span>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r ${cat.gradient} text-white opacity-0 transition-all duration-300 group-hover:opacity-100`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
                {/* Decorative gradient bar */}
                <div
                  className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${cat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <Badge
                variant="secondary"
                className="mb-3 bg-teal/10 text-teal-dark"
              >
                ટેમ્પલેટ
              </Badge>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                લોકપ્રિય પોસ્ટર ટેમ્પલેટ
              </h2>
              <p className="mt-2 text-muted-foreground">
                પોસ્ટર પસંદ કરો અને તમારી જાતને અનુકૂળ બનાવો
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === 'all'
                    ? 'bg-gradient-to-r from-saffron to-saffron-dark text-white shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
              >
                બધા જ
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? `bg-gradient-to-r ${cat.gradient} text-white shadow-md`
                      : 'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  {cat.gujaratiName}
                </button>
              ))}
            </div>
          </div>

          {/* Template grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map((template, idx) => (
              <Link href={`/editor?template=${template.id}`} key={template.id}>
                <Card
                  className="group relative overflow-hidden border border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-scale-in cursor-pointer"
                  style={{ animationDelay: `${idx * 0.05}s`, opacity: 0 }}
                >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Badges */}
                  <div className="absolute left-3 top-3 flex gap-2">
                    {template.badge && (
                      <Badge
                        className={`border-0 text-xs ${
                          template.popular
                            ? 'bg-gold text-foreground'
                            : 'bg-saffron text-white'
                        }`}
                      >
                        {template.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Heart icon */}
                  <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white">
                    <Heart className="h-4 w-4 text-maroon" />
                  </button>

                  {/* Category label */}
                  <div className="absolute bottom-3 left-3">
                    <Badge
                      variant="secondary"
                      className="border-0 bg-white/90 text-xs text-foreground backdrop-blur-sm"
                    >
                      {template.categoryLabel}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  <h3 className="truncate text-base font-semibold text-foreground">
                    {template.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                      <span className="font-medium">૪.૮</span>
                      <span>•</span>
                      <span>૧.૨k વાપર</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1 text-xs transition-all group-hover:border-saffron group-hover:text-saffron-dark"
                    >
                      ઉપયોગ કરો
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">
                આ શ્રેણીમાં હાલમાં કોઈ ટેમ્પલેટ નથી.
              </p>
            </div>
          )}

          {/* Load more */}
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 rounded-full border-saffron/40 px-8 text-saffron-dark hover:bg-saffron/10"
            >
              વધુ ટેમ્પલેટ જુઓ
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-3 bg-white/10 text-gold border-0">
              વિશેષતાઓ
            </Badge>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              શા માટે ગુજરાત પોસ્ટર મેકર?
            </h2>
            <p className="mt-3 text-white/60">
              ગુજરાતી ભાષામાં ઝડપથી પોસ્ટર બનાવવાનું સૌથી સરળ માધ્યમ
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Palette,
                title: 'ગુજરાતી ફોન્ટ સપોર્ટ',
                desc: 'બધા જ પોસ્ટરમાં સંપૂર્ણ ગુજરાતી ફોન્ટ સપોર્ટ',
              },
              {
                icon: TrendingUp,
                title: 'ઝડપી બનાવટ',
                desc: 'માત્ર કેટલાક ક્લિકમાં પોસ્ટર તૈયાર',
              },
              {
                icon: Download,
                title: 'મફત ડાઉનલોડ',
                desc: 'બધા જ પોસ્ટર મફત ડાઉનલોડ કરો',
              },
              {
                icon: Crown,
                title: 'પ્રીમિયમ ડિઝાઇન',
                desc: 'પ્રોફેશનલ લેવલના ડિઝાઇન ટેમ્પલેટ',
              },
              {
                icon: CheckCircle2,
                title: 'કસ્ટમાઇઝ',
                desc: 'તમારી જરૂરિયાત મુજબ બદલાવો',
              },
              {
                icon: Sparkles,
                title: 'નિયમિત અપડેટ',
                desc: 'દર મહિને નવા ટેમ્પલેટ ઉમેરાય',
              },
            ].map((feature, idx) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:bg-white/10 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s`, opacity: 0 }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-saffron/20 transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-saffron/15 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-teal/12 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-saffron" />
              <span className="text-sm font-medium text-saffron-dark">
                આજે જ શરૂ કરો
              </span>
            </div>
            <h2 className="text-balance text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">
              તમારો પહેલો
              <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">
                {' '}
                ગુજરાતી પોસ્ટર{' '}
              </span>
              બનાવો
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              કોઈ રજીસ્ટ્રેશન નહીં, કોઈ ચાર્જ નહીં — બસ પસંદ કરો અને બનાવો!
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-14 rounded-full bg-gradient-to-r from-saffron to-saffron-dark px-8 text-lg text-white shadow-lg transition-shadow hover:shadow-xl"
              >
                <Palette className="mr-2 h-5 w-5" />
                પોસ્ટર બનાવો
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-full px-8 text-lg"
              >
                ટેમ્પલેટ જુઓ
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-saffron to-gold shadow-md">
                  <Palette className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-bold text-foreground">
                  ગુજરાત પોસ્ટર
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                ગુજરાતી ભાષામાં બધા જ પ્રકારના પોસ્ટર બનાવવાનું સરળ માધ્યમ.
              </p>
            </div>

            {[
              {
                title: 'શ્રેણીઓ',
                links: categories.map((c) => c.name),
              },
              {
                title: 'કંપની',
                links: ['અમારા વિશે', 'સંપર્ક', 'બ્લોગ', 'ગોપનીયતા'],
              },
              {
                title: 'મદદ',
                links: ['વારંબાર પ્રશ્ન', 'માર્ગદર્શિકા', 'સપોર્ટ', 'શરત'],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="mb-3 text-sm font-semibold text-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-saffron-dark"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-border/40 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © ૨૦૨૬ ગુજરાત પોસ્ટર મેકર. બધા જ હક અધિકાર સુરક્ષિત.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
