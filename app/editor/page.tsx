'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Upload,
  Palette,
  Type,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/auth-context';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;
const GUJARATI_FONT = 'var(--font-gujarati), "Noto Sans Gujarati", sans-serif';

type TextLayerKey = 'headline' | 'subheadline' | 'name' | 'mobile' | 'from';

interface TextLayer {
  text: string;
  fontSize: number;
  top: number;
  left: number;
  originX: 'center' | 'right' | 'left';
  fill: string;
  fontWeight: string;
}

const defaultLayers: Record<TextLayerKey, TextLayer> = {
  headline: { text: 'તહેવારની શુભેચ્છા', fontSize: 140, top: 180, left: CANVAS_WIDTH / 2, originX: 'center', fill: '#ffffff', fontWeight: 'bold' },
  subheadline: { text: 'સૌને શુભ દીપાવલી', fontSize: 95, top: 350, left: CANVAS_WIDTH / 2, originX: 'center', fill: '#FFD700', fontWeight: 'bold' },
  name: { text: 'તમારું નામ', fontSize: 85, top: 780, left: CANVAS_WIDTH / 2, originX: 'center', fill: '#ffffff', fontWeight: 'bold' },
  mobile: { text: 'મોબાઈલ: ૯૮૦૫૪૩૨૧૦', fontSize: 55, top: 900, left: CANVAS_WIDTH / 2, originX: 'center', fill: '#ffffff', fontWeight: 'normal' },
  from: { text: '', fontSize: 50, top: 1000, left: CANVAS_WIDTH / 2, originX: 'center', fill: '#ffffff', fontWeight: 'normal' },
};

export default function EditorPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const aiPrompt = searchParams.get('ai_prompt');
  const { user } = useAuth();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<any>(null);
  const textObjectsRef = useRef<Record<TextLayerKey, any>>({} as any);
  const photoRef = useRef<any>(null);
  const bgImageRef = useRef<any>(null);
  const aiPromptRef = useRef<string | null>(aiPrompt);

  const [inputs, setInputs] = useState<Record<TextLayerKey, string>>({
    headline: defaultLayers.headline.text,
    subheadline: defaultLayers.subheadline.text,
    name: defaultLayers.name.text,
    mobile: defaultLayers.mobile.text,
    from: '',
  });
  const [fontSize, setFontSize] = useState<number>(48);
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [selectedObject, setSelectedObject] = useState<TextLayerKey | 'photo' | null>(null);

  useEffect(() => {
    if (user?.email &&!inputs.from) {
      const name = user.email.split('@')[0];
      setInputs((prev) => ({...prev, from: name }));
      const obj = textObjectsRef.current['from'];
      if (obj && fabricRef.current) {
        obj.set('text', `- પ્રેષક: ${name}`);
        fabricRef.current.renderAll();
      }
    }
  }, [user]);

  useEffect(() => {
    let disposed = false;
    async function init() {
      const fabricModule = await import('fabric');
      const f = (fabricModule as any).fabric?? (fabricModule as any).default?.fabric?? fabricModule as any;
      if (disposed ||!canvasRef.current) return;

      const canvas = new f.Canvas(canvasRef.current, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: '#1a1a2e',
        preserveObjectStacking: true,
      });
      fabricRef.current = canvas;

      const bgRect = new f.Rect({
        left: 0, top: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
        selectable: false, evented: false,
      });
      bgRect.set('fill', new f.Gradient({
        coords: { x1: 0, y1: 0, x2: CANVAS_WIDTH, y2: CANVAS_HEIGHT },
        colorStops: [
          { offset: 0, color: '#1a1a2e' },
          { offset: 0.5, color: '#16213e' },
          { offset: 1, color: '#0f3460' },
        ],
      }));
      canvas.add(bgRect);

      const topBar = new f.Rect({ left: 0, top: 0, width: CANVAS_WIDTH, height: 12, fill: '#e8783c', selectable: false, evented: false });
      canvas.add(topBar);
      const bottomBar = new f.Rect({ left: 0, top: CANVAS_HEIGHT - 12, width: CANVAS_WIDTH, height: 12, fill: '#e8783c', selectable: false, evented: false });
      canvas.add(bottomBar);

      if (aiPromptRef.current) {
        const promptVal = encodeURIComponent(aiPromptRef.current + ' gujarati poster, vibrant, 3d');
        const imgUrl = `https://image.pollinations.ai/prompt/${promptVal}?width=1080&height=1080&nologo=true`;
        f.Image.fromURL(imgUrl, (img: any) => {
          if (disposed ||!fabricRef.current) return;
          img.set({ left: 0, top: 0, scaleX: CANVAS_WIDTH / img.width, scaleY: CANVAS_HEIGHT / img.height, selectable: false, evented: false });
          fabricRef.current.insertAt(0, img);
          bgImageRef.current = img;
          fabricRef.current.renderAll();
        }, { crossOrigin: 'anonymous' });
      }

      const fontStack = GUJARATI_FONT;
      (Object.keys(defaultLayers) as TextLayerKey[]).forEach((key) => {
        const layer = defaultLayers[key];
        const displayText = key === 'from'? '' : layer.text;
        const textObj = new f.Text(displayText, {
          left: layer.left, top: layer.top, originX: layer.originX, originY: 'center',
          fontSize: layer.fontSize, fill: layer.fill, fontWeight: layer.fontWeight as any,
          fontFamily: fontStack, textAlign: layer.originX === 'right'? 'right' : 'center',
          shadow: new f.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 8, offsetX: 2, offsetY: 2 }),
        });
        canvas.add(textObj);
        textObjectsRef.current[key] = textObj;
      });

      canvas.on('selection:created', (e: any) => handleSelection(e));
      canvas.on('selection:updated', (e: any) => handleSelection(e));
      canvas.on('selection:cleared', () => setSelectedObject(null));
    }

    function handleSelection(e: any) {
      const obj = e.selected?.[0];
      if (!obj) return;
      const key = (Object.keys(textObjectsRef.current) as TextLayerKey[]).find((k) => textObjectsRef.current[k] === obj);
      if (key) {
        setSelectedObject(key);
        setFontSize(obj.fontSize);
        setTextColor(obj.fill as string);
      } else if (obj === photoRef.current) {
        setSelectedObject('photo');
      } else {
        setSelectedObject(null);
      }
    }
    init();
    return () => {
      disposed = true;
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, []);

  const updateText = useCallback((key: TextLayerKey, value: string) => {
    setInputs((prev) => ({...prev, [key]: value }));
    const obj = textObjectsRef.current[key];
    if (obj && fabricRef.current) {
      if (key === 'from') {
        obj.set('text', value? `- પ્રેષક: ${value}` : '');
      } else {
        obj.set('text', value);
      }
      fabricRef.current.renderAll();
    }
  }, []);

  const applyFontSize = useCallback((size: number) => {
    setFontSize(size);
    if (!fabricRef.current ||!selectedObject || selectedObject === 'photo') return;
    const obj = textObjectsRef.current[selectedObject as TextLayerKey];
    if (obj) {
      obj.set('fontSize', size);
      fabricRef.current.renderAll();
    }
  }, [selectedObject]);

  const applyTextColor = useCallback((color: string) => {
    setTextColor(color);
    if (!fabricRef.current ||!selectedObject || selectedObject === 'photo') return;
    const obj = textObjectsRef.current[selectedObject as TextLayerKey];
    if (obj) {
      obj.set('fill', color);
      fabricRef.current.renderAll();
    }
  }, [selectedObject]);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file ||!fabricRef.current) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const fabricModule = await import('fabric');
      const f = (fabricModule as any).fabric?? (fabricModule as any).default?.fabric?? fabricModule as any;
      const dataUrl = ev.target?.result as string;
      f.Image.fromURL(dataUrl, (img: any) => {
        if (!fabricRef.current) return;
        if (photoRef.current) {
          fabricRef.current.remove(photoRef.current);
        }
        const targetSize = 300;
        const scale = Math.min(targetSize / img.width, targetSize / img.height);
        img.scale(scale);
        img.set({
          left: CANVAS_WIDTH / 2, top: CANVAS_HEIGHT / 2, originX: 'center', originY: 'center',
          clipPath: new f.Circle({ radius: (targetSize * scale) / 2, originX: 'center', originY: 'center' }),
        });
        const border = new f.Circle({
          radius: (targetSize * scale) / 2 + 6, left: CANVAS_WIDTH / 2, top: CANVAS_HEIGHT / 2,
          originX: 'center', originY: 'center', fill: 'transparent', stroke: '#e8783c', strokeWidth: 4,
          selectable: false, evented: false,
        });
        fabricRef.current.add(border);
        fabricRef.current.add(img);
        photoRef.current = img;
        fabricRef.current.renderAll();
        fabricRef.current.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDownload = useCallback(() => {
    if (!fabricRef.current) return;
    fabricRef.current.discardActiveObject();
    fabricRef.current.renderAll();
    const dataUrl = fabricRef.current.toDataURL({ format: 'jpg', quality: 1, multiplier: 1 });
    const link = document.createElement('a');
    link.download = `poster-${templateId || 'custom'}-${Date.now()}.jpg`;
    link.href = dataUrl;
    link.click();
    if (user?.email) {
      try {
        const key = `posters:${user.email}`;
        const raw = localStorage.getItem(key);
        const existing: any[] = raw? JSON.parse(raw) : [];
        existing.unshift({
          id: `${Date.now()}`,
          title: inputs.headline || 'અનામ પોસ્ટર',
          thumbnail: dataUrl,
          createdAt: new Date().toISOString(),
          templateId: templateId || undefined,
        });
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
      } catch {}
    }
  }, [templateId, user, inputs.headline]);

  const handleDelete = useCallback(() => {
    if (!fabricRef.current ||!selectedObject) return;
    if (selectedObject === 'photo') {
      if (photoRef.current) {
        fabricRef.current.remove(photoRef.current);
        photoRef.current = null;
      }
    } else {
      const obj = textObjectsRef.current[selectedObject as TextLayerKey];
      if (obj) {
        fabricRef.current.remove(obj);
        delete textObjectsRef.current[selectedObject as TextLayerKey];
      }
    }
    fabricRef.current.discardActiveObject();
    fabricRef.current.renderAll();
    setSelectedObject(null);
  }, [selectedObject]);

  const inputFields: { key: TextLayerKey; label: string; placeholder: string }[] = [
    { key: 'headline', label: 'મથાળું', placeholder: 'મુખ્ય શીર્ષક' },
    { key: 'subheadline', label: 'પેટા-મથાળું', placeholder: 'ઉપ-શીર્ષક' },
    { key: 'name', label: 'તમારું નામ', placeholder: 'નામ દાખલ કરો' },
    { key: 'mobile', label: 'મોબાઈલ', placeholder: 'મોબાઈલ નંબર' },
    { key: 'from', label: 'From / પ્રેષક', placeholder: 'તમારું નામ લખો' },
  ];

  const colorSwatches = ['#ffffff', '#e8783c', '#f2c14e', '#2ec4b6', '#e94560', '#0f3460', '#000000'];

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/40 bg-card px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/"><Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">ઘર પાછા જાઓ</span><span className="sm:hidden">ઘર</span></Button></Link>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <span className="hidden text-sm font-medium text-muted-foreground sm:inline">{aiPrompt? 'AI પોસ્ટર' : templateId? `ટેમ્પલેટ: ${templateId}` : 'નવો પોસ્ટર'}</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedObject && (<Button variant="outline" size="sm" className="gap-1 text-destructive" onClick={handleDelete}><Trash2 className="h-4 w-4" /><span className="hidden sm:inline">કાઢી નાખો</span></Button>)}
          <Button size="sm" className="gap-2 bg-gradient-to-r from-saffron to-saffron-dark text-white shadow-md" onClick={handleDownload}><Download className="h-4 w-4" /><span className="hidden sm:inline">ડાઉનલોડ</span><span className="sm:hidden">JPG</span></Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="flex flex-1 items-center justify-center overflow-auto bg-muted/30 p-4">
          <div className="relative shadow-2xl ring-1 ring-border/30" style={{ width: 'min(100%, 1080px)', aspectRatio: '1 / 1' }}>
            <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="block h-full w-full" />
          </div>
        </div>
        <aside className="w-full shrink-0 overflow-y-auto border-t border-border/40 bg-card lg:w-[360px] lg:border-l lg:border-t-0">
          <ScrollArea className="h-full">
            <div className="space-y-6 p-5">
              <section>
                <div className="mb-3 flex items-center gap-2"><Type className="h-4 w-4 text-saffron" /><h3 className="text-sm font-semibold text-foreground">લખાણ દાખલ કરો</h3></div>
                <div className="space-y-3">
                  {inputFields.map((field) => (
                    <div key={field.key} className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{field.label}</Label><Input value={inputs[field.key]} onChange={(e) => updateText(field.key, e.target.value)} placeholder={field.placeholder} className="h-9 text-sm" /></div>
                  ))}
                </div>
              </section>
              <Separator />
              <section>
                <div className="mb-3 flex items-center gap-2"><ImageIcon className="h-4 w-4 text-saffron" /><h3 className="text-sm font-semibold text-foreground">ફોટો ઉમેરો</h3></div>
                <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/60 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-saffron hover:bg-saffron/5 hover:text-saffron-dark"><Upload className="h-4 w-4" /> ફોટો અપલોડ કરો<input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} /></label>
                <p className="mt-2 text-xs text-muted-foreground">ફોટો ગોળાકાર આકારમાં દેખાશે. ખસેડવા, મોટો કરવા અને ફેરવવા માટે ક્લિક કરીને ખેંચો.</p>
              </section>
              <Separator />
              <section>
                <div className="mb-3 flex items-center gap-2"><Palette className="h-4 w-4 text-saffron" /><h3 className="text-sm font-semibold text-foreground">ફોન્ટ સેટિંગ્સ</h3></div>
                {!selectedObject || selectedObject === 'photo'? (<p className="text-xs text-muted-foreground">ફોન્ટ સાઇઝ અને રંગ બદલવા માટે કેનવાસ પરના લખાણ પર ક્લિક કરો.</p>) : (
                  <div className="space-y-4">
                    <div className="space-y-2"><div className="flex items-center justify-between"><Label className="text-xs font-medium text-muted-foreground">ફોન્ટ સાઇઝ</Label><span className="text-xs font-semibold text-foreground">{fontSize}px</span></div><Slider value={[fontSize]} onValueChange={(val) => applyFontSize(val[0])} min={16} max={300} step={1} /></div>
                    <div className="space-y-2"><Label className="text-xs font-medium text-muted-foreground">રંગ</Label><div className="flex flex-wrap items-center gap-2">{colorSwatches.map((color) => (<button key={color} onClick={() => applyTextColor(color)} className={`h-8 w-8 rounded-full border-2 transition-all ${textColor === color? 'border-saffron ring-2 ring-saffron/30' : 'border-border/60 hover:scale-110'}`} style={{ backgroundColor: color }} aria-label={`રંગ ${color}`} />))}<label className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 border-border/60 hover:scale-110 transition-all"><div className="h-full w-full" style={{ background: 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)' }} /><input type="color" value={textColor} onChange={(e) => applyTextColor(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" /></label></div></div>
                  </div>
                )}
              </section>
              <Separator />
              <section className="rounded-lg bg-muted/50 p-4"><h4 className="mb-2 text-xs font-semibold text-foreground">સૂચનાઓ</h4><ul className="space-y-1.5 text-xs text-muted-foreground"><li>• લખાણ ખસેડવા માટે ક્લિક કરીને ખેંચો</li><li>• મોટું/નાનું કરવા ખૂણા ખેંચો</li><li>• ફેરવવા ઉપરનું નિશાન ઘુમાવો</li><li>• ફોન્ટ બદલવા લખાણ પર ક્લિક કરો</li></ul></section>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}
