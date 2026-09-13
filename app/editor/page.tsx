'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const W = 1080;
const H = 1080;

export default function EditorPage(){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [headline, setHeadline] = useState('તહેવારની શુભેચ્છા');
  const [sub, setSub] = useState('સૌને શુભ દીપાવલી');
  const [name, setName] = useState('તમારું નામ');
  const [mobile, setMobile] = useState('મો: ૯૮૦૫૪૩૨૧૦');
  const [from, setFrom] = useState('');
  const photoRef = useRef<HTMLImageElement | null>(null);

  const draw = () => {
    const c = canvasRef.current;
    if(!c) return;
    const ctx = c.getContext('2d');
    if(!ctx) return;
    
    // background gradient
    const grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0,'#1a1a2e');
    grad.addColorStop(1,'#0f3460');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,W,H);
    
    // top/bottom border
    ctx.fillStyle = '#e8783c';
    ctx.fillRect(0,0,W,14);
    ctx.fillRect(0,H-14,W,14);

    // photo if any
    if(photoRef.current){
      ctx.save();
      ctx.beginPath();
      ctx.arc(W/2, H/2, 160, 0, Math.PI*2);
      ctx.clip();
      ctx.drawImage(photoRef.current, W/2-160, H/2-160, 320, 320);
      ctx.restore();
      ctx.strokeStyle = '#e8783c';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(W/2, H/2, 164, 0, Math.PI*2);
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;

    // HEADLINE - 130px એકદમ મોટું
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 130px "Noto Sans Gujarati", sans-serif`;
    ctx.fillText(headline, W/2, 220);

    // SUB - 90px
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold 90px "Noto Sans Gujarati", sans-serif`;
    ctx.fillText(sub, W/2, 360);

    // NAME - 85px
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 85px "Noto Sans Gujarati", sans-serif`;
    ctx.fillText(name, W/2, 820);

    // MOBILE - 55px
    ctx.font = `600 55px "Noto Sans Gujarati", sans-serif`;
    ctx.fillText(mobile, W/2, 910);

    // FROM
    if(from){
      ctx.font = `500 50px "Noto Sans Gujarati", sans-serif`;
      ctx.fillText(`- પ્રેષક: ${from}`, W/2, 990);
    }
  };

  useEffect(()=>{ draw(); }, [headline, sub, name, mobile, from]);

  const onPhoto = (e:any) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const img = new Image();
    img.onload = () => { photoRef.current = img; draw(); };
    img.src = URL.createObjectURL(file);
  };

  const download = () => {
    const url = canvasRef.current?.toDataURL('image/jpeg', 1.0);
    if(!url) return;
    const a = document.createElement('a');
    a.href = url; a.download = `poster-${Date.now()}.jpg`; a.click();
  };

  return (
    <div style={{display:'flex', height:'100vh', flexDirection:'column', background:'#f5f5f5'}}>
      <div style={{padding:'12px', background:'#fff', display:'flex', justifyContent:'space-between', borderBottom:'1px solid #ddd'}}>
        <Link href="/">⬅️ ઘર</Link>
        <button onClick={download} style={{background:'#e8783c', color:'#fff', padding:'8px 18px', borderRadius:'8px', fontWeight:'bold'}}>⬇️ ડાઉનલોડ</button>
      </div>
      <div style={{display:'flex', flex:1, flexDirection:'row', flexWrap:'wrap'}}>
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px'}}>
          <canvas ref={canvasRef} width={W} height={H} style={{width:'100%', maxWidth:'540px', aspectRatio:'1/1', boxShadow:'0 10px 30px rgba(0,0,0,0.3)'}} />
        </div>
        <div style={{width:'100%', maxWidth:'360px', background:'#fff', padding:'16px', borderLeft:'1px solid #ddd'}}>
          <h3>લખાણ બદલો</h3>
          <label>મથાળું</label><input value={headline} onChange={e=>setHeadline(e.target.value)} style={{width:'100%', padding:'8px', marginBottom:'10px', border:'1px solid #ccc', borderRadius:'6px'}} />
          <label>પેટા-મથાળું</label><input value={sub} onChange={e=>setSub(e.target.value)} style={{width:'100%', padding:'8px', marginBottom:'10px', border:'1px solid #ccc', borderRadius:'6px'}} />
          <label>તમારું નામ</label><input value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', padding:'8px', marginBottom:'10px', border:'1px solid #ccc', borderRadius:'6px'}} />
          <label>મોબાઈલ</label><input value={mobile} onChange={e=>setMobile(e.target.value)} style={{width:'100%', padding:'8px', marginBottom:'10px', border:'1px solid #ccc', borderRadius:'6px'}} />
          <label>From</label><input value={from} onChange={e=>setFrom(e.target.value)} style={{width:'100%', padding:'8px', marginBottom:'10px', border:'1px solid #ccc', borderRadius:'6px'}} />
          <hr style={{margin:'16px 0'}} />
          <label>ફોટો ઉમેરો</label><input type="file" accept="image/*" onChange={onPhoto} />
        </div>
      </div>
    </div>
  );
}
