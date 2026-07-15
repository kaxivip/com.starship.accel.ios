import { useState, useEffect, useRef } from 'react';

const C = {
  bg:'#080c18', card:'#111827', cardL:'#1a2236',
  cyan:'#00C8FF', purple:'#6C5CE7', green:'#10B981',
  gold:'#F5A623', red:'#EF4444', white:'#F1F5F9',
  gray:'#64748B', grayD:'#334155', grayL:'#CBD5E1',
  border:'rgba(51,65,85,0.5)',
};
type Page='splash'|'privacy'|'home'|'connecting'|'connected'|'vip'|'login'|'profile'|'settings'|'about'|'help'|'ppolicy'|'sagree'|'pagree'|'deregister'|'uikit';

const css=`
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;scrollbar-width:none}
*::-webkit-scrollbar{display:none}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes slideInRight{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes twinkle{0%,100%{opacity:.15}50%{opacity:.9}}
@keyframes rocketFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes rocketLaunch{0%{transform:translateY(0)}100%{transform:translateY(-18px)}}
@keyframes flameFlicker{0%,100%{transform:scaleY(1);opacity:.8}50%{transform:scaleY(1.35);opacity:1}}
@keyframes speedLines{0%{transform:translateY(-100px);opacity:0}30%{opacity:.7}100%{transform:translateY(700px);opacity:0}}
@keyframes ringPulse{0%{transform:scale(1);opacity:.35}100%{transform:scale(1.5);opacity:0}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(0,200,255,.2)}50%{box-shadow:0 0 40px rgba(0,200,255,.45)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes btnShine{0%{transform:translateX(0)}100%{transform:translateX(600%)}}
@keyframes ctaShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
@keyframes checkFlash{0%,100%{box-shadow:0 0 0 0 rgba(0,200,255,0)}50%{box-shadow:0 0 0 6px rgba(0,200,255,.35)}}
@keyframes sparkFall{0%{transform:translateY(0);opacity:1}100%{transform:translateY(30px);opacity:0}}
@keyframes ringRotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes btnGlow{0%,100%{box-shadow:0 4px 20px rgba(0,200,255,.35),0 0 40px rgba(108,92,231,.2)}50%{box-shadow:0 4px 30px rgba(0,200,255,.55),0 0 60px rgba(108,92,231,.3)}}
`;

const fmt=(s:number)=>`${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

const Stars=({n=35}:{n?:number})=><>{Array.from({length:n},(_,i)=><div key={i} style={{position:'absolute',left:`${(i*37+13)%100}%`,top:`${(i*23+7)%100}%`,width:(i%3)+1,height:(i%3)+1,borderRadius:'50%',background:C.white,opacity:.2+(i%5)*.12,animation:`twinkle ${2+i%4}s ease-in-out infinite ${i*.15}s`}}/>)}</>;

// ── Rocket with Gauge SVG (大气版) ──
const RocketGauge=({state,size=220}:{state:'idle'|'connecting'|'connected';size?:number})=>{
  const arcColor=state==='idle'?'#3B4A66':state==='connecting'?C.cyan:C.green;
  const glowColor=state==='idle'?C.cyan:state==='connecting'?C.cyan:C.green;
  const showFlame=state!=='idle';
  const launch=state==='connected';
  const progress=state==='idle'?240:state==='connecting'?300:360;
  return(
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" style={{filter:`drop-shadow(0 0 ${size/8}px ${glowColor}40)`,overflow:'visible'}}>
      <defs>
        <linearGradient id="noseG" x1="120" y1="38" x2="120" y2="105" gradientUnits="userSpaceOnUse"><stop stopColor="#F1F5F9"/><stop offset=".5" stopColor="#CBD5E1"/><stop offset="1" stopColor="#64748B"/></linearGradient>
        <linearGradient id="bodyG" x1="96" y1="90" x2="144" y2="170" gradientUnits="userSpaceOnUse"><stop stopColor="#E2E8F0"/><stop offset=".5" stopColor="#94A3B8"/><stop offset="1" stopColor="#475569"/></linearGradient>
        <linearGradient id="bodyShine" x1="100" y1="90" x2="115" y2="170" gradientUnits="userSpaceOnUse"><stop stopColor="#FFFFFF" stopOpacity=".5"/><stop offset="1" stopColor="#FFFFFF" stopOpacity="0"/></linearGradient>
        <linearGradient id="finG" x1="80" y1="148" x2="95" y2="175" gradientUnits="userSpaceOnUse"><stop stopColor="#94A3B8"/><stop offset="1" stopColor="#334155"/></linearGradient>
        <linearGradient id="finGR" x1="145" y1="148" x2="130" y2="175" gradientUnits="userSpaceOnUse"><stop stopColor="#94A3B8"/><stop offset="1" stopColor="#334155"/></linearGradient>
        <linearGradient id="flame1" x1="120" y1="165" x2="120" y2="225" gradientUnits="userSpaceOnUse"><stop stopColor="#FDE68A"/><stop offset=".3" stopColor="#F5A623"/><stop offset=".7" stopColor="#EF4444"/><stop offset="1" stopColor="transparent"/></linearGradient>
        <linearGradient id="flame2" x1="120" y1="168" x2="120" y2="210" gradientUnits="userSpaceOnUse"><stop stopColor="#FFFFFF"/><stop offset=".4" stopColor="#FDE68A"/><stop offset="1" stopColor="transparent"/></linearGradient>
        <radialGradient id="portG"><stop stopColor={C.cyan} stopOpacity="1"/><stop offset=".5" stopColor={C.cyan} stopOpacity=".4"/><stop offset="1" stopColor={C.cyan} stopOpacity="0"/></radialGradient>
        <radialGradient id="haloG" cx=".5" cy=".5" r=".5"><stop stopColor={glowColor} stopOpacity=".18"/><stop offset=".7" stopColor={glowColor} stopOpacity=".04"/><stop offset="1" stopColor={glowColor} stopOpacity="0"/></radialGradient>
      </defs>
      {/* Ambient halo */}
      <circle cx="120" cy="128" r="105" fill="url(#haloG)"/>
      {/* Outer gauge ring - 180° symmetric */}
      <path d={describeArc(120,130,102,180,360)} stroke={arcColor} strokeWidth="1" strokeLinecap="round" fill="none" opacity=".2"/>
      {/* Inner gauge track - 180° symmetric */}
      <path d={describeArc(120,130,90,180,360)} stroke="#1E293B" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".8"/>
      {/* Active gauge progress */}
      <path d={describeArc(120,130,90,180,progress)} stroke={arcColor} strokeWidth="5" strokeLinecap="round" fill="none" style={{transition:'all .6s ease-out',filter:`drop-shadow(0 0 6px ${glowColor}80)`}}/>
      {/* Tick marks - 3 levels, 180° symmetric (-180° to 0°, 37 ticks) */}
      {Array.from({length:37},(_,i)=>{const a=(-180+i*5)*Math.PI/180;const r1=98;const isMajor=i%6===0;const isMid=i%3===0&&!isMajor;const len=isMajor?11:isMid?6:3;const cx=120+Math.cos(a)*r1;const cy=130+Math.sin(a)*r1;const ix=120+Math.cos(a)*(r1-len);const iy=130+Math.sin(a)*(r1-len);return<line key={i} x1={cx} y1={cy} x2={ix} y2={iy} stroke={arcColor} strokeWidth={isMajor?1.5:.8} opacity={isMajor?.9:isMid?.55:.3}/>})}
      {/* Rotating outer ring dots (connecting) */}
      {state==='connecting'&&<g style={{transformOrigin:'120px 130px',animation:'ringRotate 4s linear infinite'}}>
        {[0,60,120,180,240,300].map(a=>{const rad=a*Math.PI/180;return<circle key={a} cx={120+Math.cos(rad)*108} cy={130+Math.sin(rad)*108} r="2" fill={C.cyan} opacity=".6"/>})}
      </g>}
      {/* Rocket group */}
      <g style={{transform:launch?'translateY(-24px)':'translateY(0)',transition:'transform .8s cubic-bezier(.34,1.56,.64,1)'}}>
      <g style={{animation:'rocketFloat 3s ease-in-out infinite'}}>
        {/* Fins (mint triangular, LOGO style) */}
        <path d="M100 148 L82 178 L100 170 Z" fill="#5FEBD9" stroke="#F1F5F9" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M140 148 L158 178 L140 170 Z" fill="#5FEBD9" stroke="#F1F5F9" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Rocket body - two-tone bullet shape */}
        {/* Left half - white */}
        <path d="M120 44 Q100 64 100 108 L100 156 Q100 170 111 174 L120 174 Z" fill="#F1F5F9"/>
        {/* Right half - mint cyan */}
        <path d="M120 44 Q140 64 140 108 L140 156 Q140 170 129 174 L120 174 Z" fill="#5FEBD9"/>
        {/* Body outline */}
        <path d="M120 44 Q100 64 100 108 L100 156 Q100 170 111 174 L129 174 Q140 170 140 156 L140 108 Q140 64 120 44 Z" fill="none" stroke="#F1F5F9" strokeWidth="1.8" strokeLinejoin="round"/>
        {/* Center split line */}
        <line x1="120" y1="50" x2="120" y2="172" stroke="#F1F5F9" strokeWidth="1" opacity=".55"/>
        {/* Bottom nozzle cone */}
        <path d="M112 174 L120 190 L128 174 Z" fill="#5FEBD9" stroke="#F1F5F9" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Nose tip highlight */}
        <circle cx="120" cy="48" r="1.8" fill="#FFFFFF" opacity=".9"/>
        {/* Porthole with cyan glow */}
        <circle cx="120" cy="108" r="11" fill="#0a1628" stroke="#F1F5F9" strokeWidth="1.8"/>
        <circle cx="120" cy="108" r="8" fill="url(#portG)" opacity={state==='idle'?.65:1}/>
        <circle cx="117" cy="105" r="2" fill="#FFFFFF" opacity=".85"/>
        <circle cx="122" cy="110" r=".8" fill={C.cyan}/>
        {/* Flame */}
        {showFlame&&<g style={{animation:'flameFlicker .3s ease-in-out infinite',transformOrigin:'120px 190px'}}>
          <ellipse cx="120" cy="216" rx="18" ry="30" fill="url(#flame1)" opacity=".7"/>
          <ellipse cx="120" cy="210" rx="11" ry="22" fill="url(#flame1)" opacity=".9"/>
          <ellipse cx="120" cy="202" rx="6" ry="15" fill="url(#flame2)"/>
          <ellipse cx="120" cy="195" rx="3" ry="7" fill="#FFFFFF" opacity=".9"/>
          {/* Spark particles */}
          {[0,1,2,3,4].map(i=><circle key={i} cx={110+i*5} cy={224+((i*7)%10)} r=".8" fill="#FDE68A" opacity=".8" style={{animation:`sparkFall ${.6+i*.15}s linear infinite ${i*.1}s`}}/>)}
        </g>}
        {/* Speed lines when connected */}
        {state==='connected'&&[0,1,2,3].map(i=><g key={i}>
          <line x1={70-i*6} y1={135+i*10} x2={70-i*6} y2={158+i*10} stroke={C.green} strokeWidth="1.5" opacity={.5-i*.1} style={{animation:`speedLines ${.7+i*.15}s linear infinite ${i*.12}s`}}/>
          <line x1={170+i*6} y1={135+i*10} x2={170+i*6} y2={158+i*10} stroke={C.green} strokeWidth="1.5" opacity={.5-i*.1} style={{animation:`speedLines ${.7+i*.15}s linear infinite ${i*.12}s`}}/>
        </g>)}
      </g>
      </g>
    </svg>
  );
};

function describeArc(cx:number,cy:number,r:number,startAngle:number,endAngle:number){
  const s=startAngle*Math.PI/180,e=endAngle*Math.PI/180;
  const sx=cx+r*Math.cos(s),sy=cy+r*Math.sin(s),ex=cx+r*Math.cos(e),ey=cy+r*Math.sin(e);
  const large=endAngle-startAngle>180?1:0;
  return`M${sx},${sy} A${r},${r} 0 ${large} 1 ${ex},${ey}`;
}

const Ico=({d,s=20,c=C.gray}:{d:string;s?:number;c?:string})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;

const BrandLogo=({size=64,glow=false}:{size?:number;glow?:boolean})=>(
  <img src="/logo.png" alt="星舟加速器" width={size} height={size} style={{width:size,height:size,objectFit:'contain',display:'block',filter:glow?'drop-shadow(0 0 12px rgba(0,200,255,.4)) drop-shadow(0 0 22px rgba(108,92,231,.28))':undefined}}/>
);
const IC={
  bolt:'M13 2L3 14h9l-1 10 10-12h-9l1-10z',
  crown:'M2 17l3-9 5 4 2-8 2 8 5-4 3 9H2z',
  user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
};

export default function App(){
  const [page,setPage]=useState<Page>('splash');
  const [mode,setMode]=useState<'smart'|'global'>('smart');
  const [dur,setDur]=useState(0);
  const [selPlan,setSelPlan]=useState(2);
  const [notif,setNotif]=useState(true);
  const [loginTab,setLoginTab]=useState<'sms'|'one'>('sms');
  const [phone,setPhone]=useState('');
  const [code,setCode]=useState('');
  const [cd,setCd]=useState(0);
  const [progress,setProgress]=useState(0);
  const [agreeVIP,setAgreeVIP]=useState(false);
  const [showCompare,setShowCompare]=useState(false);
  const [ctaShake,setCtaShake]=useState(false);
  const [logged,setLogged]=useState(false);
  const [isVip,setIsVip]=useState(false);
  const [vipExpiry,setVipExpiry]=useState('');
  const [helpTab,setHelpTab]=useState<'speed'|'vip'>('speed');
  const [openFaq,setOpenFaq]=useState<number>(-1);
  const [dereConfirm,setDereConfirm]=useState(false);
  const [dereInput,setDereInput]=useState('');
  const timerRef=useRef<any>(null);

  useEffect(()=>{if(page==='splash'){const t=setTimeout(()=>setPage('privacy'),2800);return()=>clearTimeout(t)}},[page]);
  useEffect(()=>{if(page==='connected'){timerRef.current=setInterval(()=>setDur(d=>d+1),1000);return()=>clearInterval(timerRef.current)}else{setDur(0)}},[page]);
  useEffect(()=>{if(page==='connecting'){setProgress(0);const iv=setInterval(()=>{setProgress(p=>{if(p>=100){clearInterval(iv);setPage('connected');return 100}return p+1.5})},30);return()=>clearInterval(iv)}},[page]);
  useEffect(()=>{if(cd>0){const t=setTimeout(()=>setCd(c=>c-1),1000);return()=>clearTimeout(t)}},[cd]);

  const go=(p:Page)=>setPage(p);
  const ChevL=({to}:{to:Page})=><div onClick={()=>go(to)} style={{width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg></div>;
  const connState:('idle'|'connecting'|'connected')=page==='connected'?'connected':page==='connecting'?'connecting':'idle';

  const StatusBar=()=><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'4px 22px 0',fontSize:11,color:C.white,fontWeight:600,marginTop:32,position:'relative',zIndex:5}}>
    <div style={{display:'flex',alignItems:'center',gap:4}}>
      <svg width="16" height="10" viewBox="0 0 16 10"><rect x="0" y="6" width="3" height="4" rx=".5" fill={C.white}/><rect x="4.5" y="4" width="3" height="6" rx=".5" fill={C.white}/><rect x="9" y="2" width="3" height="8" rx=".5" fill={C.white}/><rect x="13.5" y="0" width="3" height="10" rx=".5" fill={C.grayD}/></svg>
      <span style={{fontSize:10,marginLeft:2}}>5G</span>
    </div>
    <span style={{letterSpacing:1}}>9:41</span>
    <svg width="22" height="11" viewBox="0 0 22 11"><rect x=".5" y=".5" width="18" height="10" rx="2" stroke={C.white} fill="none" strokeWidth="1"/><rect x="2" y="2" width="15" height="7" rx="1" fill={C.white}/><rect x="19.5" y="3.5" width="2" height="4" rx=".5" fill={C.white} opacity=".4"/></svg>
  </div>;

  const TabBar=({active}:{active:number})=><div style={{position:'absolute',bottom:0,left:0,right:0,height:88,background:'rgba(8,12,24,0.95)',borderTop:`0.5px solid ${C.border}`,backdropFilter:'blur(20px)',zIndex:20}}>
    <div style={{display:'flex',justifyContent:'space-around',paddingTop:8}}>
      {([{d:IC.bolt,l:'加速',p:'home' as Page,c:C.cyan},{d:IC.crown,l:'会员',p:'vip' as Page,c:C.gold},{d:IC.user,l:'我的',p:'profile' as Page,c:C.purple}]).map((t,i)=>(
        <div key={i} onClick={()=>go(i===0&&page==='connected'?'connected':t.p)} style={{cursor:'pointer',textAlign:'center',width:80}}>
          <Ico d={t.d} s={22} c={i===active?t.c:C.gray}/>
          <div style={{fontSize:10,color:i===active?t.c:C.gray,fontWeight:i===active?600:400,marginTop:3,lineHeight:1.4}}>{t.l}</div>
        </div>
      ))}
    </div>
    <div style={{display:'flex',justifyContent:'center',marginTop:6}}><div style={{width:134,height:5,borderRadius:3,background:'rgba(255,255,255,0.55)'}}/></div>
  </div>;

  const statusBadge=()=>{
    if(page==='connected') return <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(16,185,129,0.1)',border:`1px solid rgba(16,185,129,0.3)`,borderRadius:20,padding:'6px 16px'}}>
      <div style={{width:7,height:7,borderRadius:'50%',background:C.green,animation:'pulse 1.5s infinite'}}/><span style={{fontSize:12,color:C.green,fontWeight:600}}>加速中 {fmt(dur)}</span>
    </div>;
    if(page==='connecting') return <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(0,200,255,0.08)',border:`1px solid rgba(0,200,255,0.25)`,borderRadius:20,padding:'6px 16px'}}>
      <div style={{width:7,height:7,borderRadius:'50%',background:C.cyan,animation:'pulse 1s infinite'}}/><span style={{fontSize:12,color:C.cyan,fontWeight:600}}>连接中...</span>
    </div>;
    return <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(0,200,255,0.06)',border:`1px solid rgba(0,200,255,0.2)`,borderRadius:20,padding:'6px 16px'}}>
      <div style={{width:7,height:7,borderRadius:'50%',background:C.cyan}}/><span style={{fontSize:12,color:C.cyan,fontWeight:500}}>准备就绪</span>
    </div>;
  };

  const faqs={
    speed:[
      {q:'如何开启加速？',a:'打开 App 后点击首页中央的火箭按钮即可一键连接。首次使用需授予 VPN 权限（系统会自动弹窗）。'},
      {q:'智能模式和全局模式有什么区别？',a:'· 智能模式：仅加速游戏/常用应用，节省电量与流量；\n· 全局模式：对所有网络请求进行加速，适合多应用同时使用。'},
      {q:'加速效果不理想怎么办？',a:'依次尝试：\n1. 切换至《全局模式》；\n2. 在节点列表里选择延迟更低的节点；\n3. 检查本地 Wi-Fi/4G信号是否稳定；\n4. 重启 App 后重新连接。'},
      {q:'为什么连接失败？',a:'常见原因：\n· 未授予 VPN 权限（可在设置重新授权）；\n· 本地网络异常；\n· 节点临时拥堵，请尝试切换其他节点。'},
      {q:'加速会消耗额外流量吗？',a:'加速本身不产生额外流量。仅对您原本产生的流量进行智能路由优化，不会重复计费。'},
      {q:'后台运行时会断连吗？',a:'不会。iOS 系统级 VPN 保证后台持续加速，销屏后仍可稳定运行。'},
    ],
    vip:[
      {q:'如何购买 VIP 会员？',a:'进入《会员中心》选择套餐，勾选协议后点击开通。支持 Apple ID 支付，首月仅需 ¥6（新人限首次订阅）。'},
      {q:'首月 ¥6 所有套餐都有吗？',a:'仅 1 个月套餐支持首月 ¥6 新人价，仅限首次订阅。\n6个月、1年套餐为打包优惠价（日均更低）。'},
      {q:'如何取消自动续订？',a:'在 iPhone《设置 - Apple ID - 订阅》中找到星舟 VIP，点击取消订阅。已扣费周期内会员权益依旧保留至到期。'},
      {q:'如何申请退款？',a:'iOS 内购退款需通过 Apple 官方申请：\nreportaproblem.apple.com\n提供订单号及退款理由，Apple 审核后直接退回原付款。'},
      {q:'VIP 权益包含哪些？',a:'· 解锁 50+ 全球节点\n· 低于 20ms 延迟优先通道\n· 游戏、流媒体定向加速\n· AES-256 银行级加密\n· 去除广告'},
      {q:'换手机后 VIP 还有效吗？',a:'VIP 权益与 Apple ID 绑定，在新手机登录相同 Apple ID 后，进入会员中心点击《恢复购买》即可重新启用。'},
    ],
  };

  const renderPage=()=>{switch(page){
  case 'splash': return <div style={{width:'100%',height:'100%',background:'linear-gradient(180deg,#050a14 0%,#080c18 40%,#0d1528 70%,#080c18 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',animation:'fadeIn 1s'}}>
    <Stars n={50}/>
    <div style={{animation:'slideUp 1.2s ease-out',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div style={{animation:'rocketFloat 3s ease-in-out infinite'}}><BrandLogo size={150} glow/></div>
      <div style={{marginTop:18,fontSize:26,fontWeight:800,background:'linear-gradient(135deg,#00C8FF,#6C5CE7)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',letterSpacing:2,paddingRight:6,paddingLeft:2,display:'inline-block',lineHeight:1.3,textAlign:'center'}}>星舟加速器</div>
      <div style={{marginTop:10,fontSize:12,color:C.gray,letterSpacing:3,paddingRight:5,fontWeight:300,textAlign:'center'}}>星际穿梭 · 极速畅游</div>
      <div style={{display:'flex',gap:8,marginTop:24}}>{['装机必备','出国必装','海外常备'].map((t,i)=><div key={i} style={{fontSize:10,color:C.grayL,padding:'4px 10px',borderRadius:10,background:'rgba(0,200,255,0.06)',border:`0.5px solid rgba(0,200,255,0.15)`}}>{t}</div>)}</div>
      <div style={{marginTop:32,width:32,height:2,borderRadius:1,background:C.grayD,overflow:'hidden'}}><div style={{width:'100%',height:'100%',background:`linear-gradient(90deg,transparent,${C.cyan},transparent)`,backgroundSize:'200% 100%',animation:'shimmer 1.5s linear infinite'}}/></div>
    </div>
  </div>;

  case 'privacy': return <div style={{width:'100%',height:'100%',background:C.bg,position:'relative',animation:'fadeIn .4s'}}>
    <Stars n={20}/><div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.55)',backdropFilter:'blur(8px)'}}/>
    <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:300,background:'#141c2e',borderRadius:20,padding:'28px 24px',border:`0.5px solid rgba(0,200,255,0.2)`,boxShadow:'0 20px 60px rgba(0,0,0,.5)',animation:'slideUp .4s ease-out'}}>
      <div style={{display:'flex',justifyContent:'center',marginBottom:14}}><BrandLogo size={54} glow/></div>
      <div style={{fontSize:16,fontWeight:700,color:C.white,textAlign:'center',marginBottom:4}}>隐私政策与服务协议</div>
      <div style={{fontSize:11,color:C.gray,textAlign:'center',marginBottom:16}}>请阅读并同意以下条款</div>
      <div style={{position:'relative',marginBottom:20}}>
        <div style={{maxHeight:220,overflowY:'auto',fontSize:11,color:C.gray,lineHeight:'20px',background:'rgba(0,0,0,.2)',borderRadius:12,padding:'16px 16px 28px',border:`0.5px solid ${C.border}`}}>
          尊敬的用户，感谢您使用星舟加速器。我们重视您的隐私保护，本应用将严格遵守《个人信息保护法》《网络安全法》等相关法律法规。<br/><br/>
          <span style={{color:C.grayL,fontWeight:500}}>1. 信息收集</span><br/>我们仅收集提供服务所必需的最少信息。<br/><br/>
          <span style={{color:C.grayL,fontWeight:500}}>2. 信息使用</span><br/>您的信息仅用于提供和优化加速服务。<br/><br/>
          <span style={{color:C.grayL,fontWeight:500}}>3. 信息安全</span><br/>我们采用 AES-256 加密技术保护您的数据。<br/><br/>
          <span style={{color:C.grayL,fontWeight:500}}>4. 信息共享</span><br/>未经同意不会向第三方共享信息。
        </div>
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:32,background:'linear-gradient(transparent,rgba(0,0,0,.5))',borderRadius:'0 0 12px 12px',pointerEvents:'none'}}/>
      </div>
      <div onClick={()=>go('home')} style={{background:`linear-gradient(135deg,${C.cyan},${C.purple})`,borderRadius:12,padding:'13px 0',textAlign:'center',fontSize:14,fontWeight:700,color:C.white,cursor:'pointer',letterSpacing:1,boxShadow:`0 4px 20px rgba(0,200,255,.25)`}}>同意并继续</div>
      <div onClick={()=>go('splash')} style={{textAlign:'center',fontSize:12,color:C.gray,marginTop:14,cursor:'pointer'}}>不同意</div>
    </div>
  </div>;

  case 'home':
  case 'connecting':
  case 'connected': {
    const rState:'idle'|'connecting'|'connected'=page==='home'?'idle':page as any;
    const isIdle=page==='home';
    const isConnecting=page==='connecting';
    const isConnected=page==='connected';
    const btnBg=isConnected?'linear-gradient(135deg,#F59E0B,#F97316)':isConnecting?'linear-gradient(135deg,#334155,#1E293B)':`linear-gradient(135deg,${C.cyan},${C.purple})`;
    const btnShadow=isConnected?'0 4px 24px rgba(245,158,11,.35)':isConnecting?'0 4px 20px rgba(0,200,255,.15)':'0 4px 24px rgba(0,200,255,.4),0 0 40px rgba(108,92,231,.2)';
    const btnLabel=isConnected?'停止加速':isConnecting?`正在连接··· ${Math.round(progress)}%`:'立即提速';
    const btnAction=()=>{if(isIdle)go('connecting');else if(isConnecting)go('home');else go('home')};
    return <div style={{width:'100%',height:'100%',background:C.bg,position:'relative',animation:'fadeIn .3s',overflow:'hidden'}}>
    <Stars n={30}/><StatusBar/>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 22px'}}>
      <div style={{fontSize:16,fontWeight:800,background:`linear-gradient(135deg,${C.cyan},${C.purple})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',letterSpacing:1.5,paddingRight:4,display:'inline-block',lineHeight:1.3}}>星舟加速器</div>
      <div onClick={()=>{if(navigator.share)navigator.share({title:'星舟加速器',text:'星际穿梭·极速畅游',url:'https://apps.apple.com'}).catch(()=>{})}} style={{width:32,height:32,borderRadius:'50%',background:'rgba(255,255,255,.06)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
      </div>
    </div>
    <div style={{display:'flex',justifyContent:'center',marginTop:14}}>{statusBadge()}</div>
    {/* Rocket zone — 高度加大 1/3 (210 to 280) */}
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:18,marginBottom:22,position:'relative',height:280}}>
      {/* Speed background lines when connecting */}
      {isConnecting&&Array.from({length:8},(_,i)=><div key={i} style={{position:'absolute',left:`${12+i*10}%`,top:0,width:.5,height:'100%',overflow:'hidden',opacity:.4,pointerEvents:'none'}}><div style={{width:'100%',height:'40px',background:`linear-gradient(180deg,transparent,${C.cyan}70,transparent)`,animation:`speedLines ${1.2+i*.12}s linear infinite ${i*.08}s`}}/></div>)}
      <div style={{position:'absolute',width:260,height:260,borderRadius:'50%',border:`1px solid rgba(0,200,255,.06)`,animation:'ringPulse 3s ease-out infinite',pointerEvents:'none'}}/>
      <RocketGauge state={rState} size={280}/>
    </div>
    {/* Main action button (三态) */}
    <div style={{display:'flex',justifyContent:'center',marginTop:0}}>
      <div onClick={btnAction} style={{width:'85%',height:56,borderRadius:16,background:btnBg,display:'flex',alignItems:'center',justifyContent:'center',gap:8,cursor:'pointer',boxShadow:btnShadow,fontSize:15,fontWeight:700,color:C.white,letterSpacing:2,transition:'all .4s',animation:isIdle?'btnGlow 2.4s ease-in-out infinite':'none',position:'relative',overflow:'hidden'}}>
        {isConnecting&&<div style={{position:'absolute',left:0,top:0,bottom:0,width:`${progress}%`,background:`linear-gradient(90deg,${C.cyan}40,${C.purple}40)`,transition:'width .05s linear'}}/>}
        <div style={{position:'relative',display:'flex',alignItems:'center',gap:8}}>
          {isIdle&&<Ico d={IC.bolt} s={18} c={C.white}/>}
          {isConnecting&&<div style={{width:14,height:14,border:`2px solid rgba(255,255,255,.3)`,borderTopColor:C.white,borderRadius:'50%',animation:'spin 1s linear infinite'}}/>}
          {isConnected&&<svg width="16" height="16" viewBox="0 0 24 24" fill={C.white} stroke="none"><rect x="6.5" y="5" width="3.5" height="14" rx="1.2"/><rect x="14" y="5" width="3.5" height="14" rx="1.2"/></svg>}
          {btnLabel}
        </div>
      </div>
    </div>
    {/* Mode switch (不同于主按钮颜色) — 黑底+边框选中 */}
    <div style={{display:'flex',justifyContent:'center',marginTop:26,opacity:isIdle?1:.5,pointerEvents:isIdle?'auto':'none'}}>
      <div style={{display:'flex',width:220,borderRadius:22,padding:3,background:'rgba(10,14,25,.85)',border:`0.5px solid ${C.border}`,gap:2}}>
        <div onClick={()=>setMode('smart')} style={{flex:1,textAlign:'center',padding:'7px 0',fontSize:12,background:mode==='smart'?'rgba(0,200,255,.14)':'transparent',color:mode==='smart'?C.cyan:C.gray,fontWeight:mode==='smart'?700:400,cursor:'pointer',transition:'all .3s',borderRadius:20,border:mode==='smart'?`1px solid ${C.cyan}60`:'1px solid transparent'}}>⚡ 智能模式</div>
        <div onClick={()=>setMode('global')} style={{flex:1,textAlign:'center',padding:'7px 0',fontSize:12,background:mode==='global'?'rgba(108,92,231,.16)':'transparent',color:mode==='global'?'#A29BFE':C.gray,fontWeight:mode==='global'?700:400,cursor:'pointer',transition:'all .3s',borderRadius:20,border:mode==='global'?`1px solid ${C.purple}80`:'1px solid transparent'}}>🌐 全局模式</div>
      </div>
    </div>
    {/* Ad slot */}
    <div style={{margin:'26px 20px 0',borderRadius:12,background:'linear-gradient(135deg,rgba(26,34,54,.7),rgba(17,24,39,.5))',border:`0.5px dashed ${C.grayD}`,padding:'16px 14px',display:'flex',alignItems:'center',gap:12,position:'relative'}}>
      <div style={{position:'absolute',top:6,right:8,fontSize:8,color:C.grayD,letterSpacing:.5,padding:'1px 5px',border:`0.5px solid ${C.grayD}`,borderRadius:3}}>AD</div>
      <div style={{width:44,height:44,borderRadius:10,background:'rgba(0,200,255,.08)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.grayD} strokeWidth="1.2" strokeDasharray="3 2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15l4-4 4 4 6-6 4 4"/></svg>
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:12,color:C.grayL,fontWeight:500}}>广告位预留</div>
        <div style={{fontSize:9,color:C.grayD,marginTop:3}}>Banner Ad · 320×60 / 320×100</div>
      </div>
    </div>
    <TabBar active={0}/>
  </div>;
  }

  case 'vip': {
    const plans=[
      {id:0,m:'1个月',p:6,orig:30,save:0,tag:'新人价',daily:'次月起 ¥30/月',period:'1个月',isTrial:true},
      {id:1,m:'6个月',p:120,orig:180,save:60,tag:'推荐',daily:'日均 ¥0.67',period:'6个月'},
      {id:2,m:'年度',p:198,orig:360,save:162,tag:'最划算',daily:'日均 ¥0.54',period:'12个月'},
    ];
    const cur=plans[selPlan]||plans[1];
    const handleCta=()=>{
      if(!agreeVIP){setCtaShake(true);setTimeout(()=>setCtaShake(false),500);return;}
      if(!logged){go('login');return;}
      const days=cur.period==='12个月'?365:cur.period==='6个月'?180:30;
      const d=new Date(Date.now()+days*86400000);
      setVipExpiry(`${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`);
      setIsVip(true);
      go('profile');
    };
    return <div style={{width:'100%',height:'100%',background:C.bg,position:'relative',animation:'fadeIn .3s'}}>
    <div style={{position:'absolute',top:0,left:0,right:0,bottom:88,overflowY:'auto',paddingBottom:12}}>
    <StatusBar/>
    {/* Header */}
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 22px 4px'}}>
      <div style={{fontSize:17,fontWeight:700,color:C.white,letterSpacing:1}}>会员中心</div>
    </div>
    {/* VIP 横幅 - 精简 */}
    <div onClick={()=>{setIsVip(!isVip);if(!isVip)setVipExpiry('2026.12.31');}} style={{margin:'6px 20px 0',borderRadius:14,padding:'14px 16px',background:'linear-gradient(135deg,#1a0e3a,#2D1B69 40%,#1a2a5e)',border:`0.5px solid rgba(245,166,35,.28)`,position:'relative',overflow:'hidden',cursor:'pointer'}}>
      <div style={{position:'absolute',top:-20,right:-20,width:80,height:80,background:'radial-gradient(circle,rgba(245,166,35,.12),transparent 70%)',borderRadius:'50%'}}/>
      {isVip?
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',position:'relative'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Ico d={IC.crown} s={20} c={C.gold}/>
          <span style={{fontSize:15,fontWeight:800,color:C.gold}}>星舟 VIP</span>
          <span style={{fontSize:10,color:C.green,fontWeight:600}}>已开通</span>
        </div>
        <span style={{fontSize:11,color:C.grayL}}>{vipExpiry||'2026.12.31'} 到期</span>
      </div>
      :
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',position:'relative'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Ico d={IC.crown} s={20} c={C.gold}/>
          <span style={{fontSize:15,fontWeight:800,color:C.gold}}>星舟 VIP</span>
        </div>
        <div style={{display:'flex',gap:12}}>
          {[{v:'50+',l:'节点'},{v:'20ms',l:'延迟'},{v:'AES-256',l:'加密'}].map((s,i)=>(
            <div key={i} style={{textAlign:'center'}}>
              <div style={{fontSize:11,fontWeight:800,color:C.white,fontFamily:'ui-monospace,monospace'}}>{s.v}</div>
              <div style={{fontSize:9,color:C.gray}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      }
    </div>
    {/* 限时提示 */}
    <div style={{padding:'14px 22px 0',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
      <div style={{width:6,height:6,borderRadius:'50%',background:C.gold,animation:'pulse 2s infinite'}}/>
      <span style={{fontSize:10,color:C.gold,fontWeight:600}}>新人限时优惠 · 首月仅 ¥6</span>
    </div>
    {/* 选择套餐 */}
    <div style={{padding:'20px 20px 16px',fontSize:13,fontWeight:600,color:C.white,display:'flex',alignItems:'baseline',justifyContent:'space-between'}}>
      <span>选择套餐</span>
      <span style={{fontSize:10,color:C.gold,fontWeight:500}}>订阅越长越划算 ✨</span>
    </div>
    <div style={{display:'flex',gap:8,padding:'0 20px',alignItems:'stretch'}}>
      {plans.map((p,i)=>{
        const isBest=p.tag==='最划算';
        const sel=selPlan===i;
        const borderC=sel?(isBest?C.gold:C.cyan):C.border;
        return(
        <div key={i} onClick={()=>setSelPlan(i)} style={{flex:isBest?1.15:1,background:sel?(isBest?'rgba(245,166,35,.12)':'rgba(0,200,255,.12)'):'rgba(26,34,54,.6)',borderRadius:14,padding:isBest?'16px 4px 12px':'14px 4px 10px',textAlign:'center',border:sel?`1.5px solid ${borderC}`:`0.5px solid ${C.border}`,position:'relative',cursor:'pointer',transition:'all .25s',boxShadow:sel?(isBest?'0 4px 20px rgba(245,166,35,.25)':'0 4px 16px rgba(0,200,255,.18)'):'none'}}>
          {p.tag&&<div style={{position:'absolute',top:-9,left:'50%',transform:'translateX(-50%)',background:p.tag==='最划算'?`linear-gradient(135deg,${C.gold},#F7DC6F)`:p.tag==='新人价'?`linear-gradient(135deg,#FF6B6B,#FF8E53)`:`linear-gradient(135deg,${C.cyan},${C.purple})`,borderRadius:10,padding:'3px 9px',fontSize:9,color:p.tag==='最划算'?'#1a1a2e':C.white,fontWeight:400,whiteSpace:'nowrap',letterSpacing:.5,boxShadow:p.tag==='最划算'?'0 2px 8px rgba(245,166,35,.35)':p.tag==='新人价'?'0 2px 8px rgba(255,107,107,.35)':'none'}}>{p.tag}</div>}
          <div style={{fontSize:11,color:C.gray,fontWeight:500,marginTop:p.tag?4:0}}>{p.m}</div>
          <div style={{fontSize:isBest?26:22,fontWeight:800,color:sel&&isBest?C.gold:C.white,margin:'4px 0 2px',letterSpacing:-.5}}>¥{p.p}</div>
          {p.save>0?
            <div style={{fontSize:9,color:C.gold,fontWeight:600}}>省 ¥{p.save}</div>:
            p.isTrial?<div style={{fontSize:9,color:'#FF8E53',fontWeight:700}}>限首次订阅</div>:
            <div style={{fontSize:9,color:C.grayD,height:12}}> </div>
          }
          <div style={{fontSize:9,color:C.gray,marginTop:3}}>{p.daily}</div>
          {p.orig>p.p&&<div style={{fontSize:8,color:C.grayD,textDecoration:'line-through',marginTop:1}}>原价 ¥{p.orig}</div>}
          {sel&&<div style={{position:'absolute',top:6,right:6,width:14,height:14,borderRadius:'50%',background:isBest?C.gold:C.cyan,display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
        </div>
      )})}
    </div>
    {/* CTA 按钮 */}
    <div onClick={handleCta} style={{margin:'24px 20px 0',background:`linear-gradient(135deg,${C.gold},#F7DC6F)`,borderRadius:14,padding:'15px 0',textAlign:'center',cursor:'pointer',boxShadow:'0 4px 24px rgba(245,166,35,.35)',position:'relative',overflow:'hidden',animation:ctaShake?'ctaShake .5s':'btnGlow 3s infinite'}}>
      <div style={{position:'absolute',top:0,left:'-30%',width:'30%',height:'100%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent)',animation:'btnShine 4s linear infinite',pointerEvents:'none'}}/>
      <div style={{fontSize:15,fontWeight:800,color:'#1a1a2e',letterSpacing:1,position:'relative'}}>立即开通 · ¥{cur.p}{cur.isTrial?' 首月':` / ${cur.period}`}</div>
      {(cur.save>0||cur.isTrial)&&<div style={{fontSize:9,color:'#5a3a00',marginTop:3,fontWeight:600,position:'relative'}}>{cur.isTrial?`次月起 ¥${cur.orig}/月，可随时取消`:`立省 ¥${cur.save}，${cur.daily}`}</div>}
    </div>
    {/* 社会证明 */}
    <div style={{textAlign:'center',padding:'10px 0 6px',fontSize:9,color:C.grayD}}>已有 28,000+ 用户开通会员</div>
    {/* 协议勾选 */}
    <div style={{display:'flex',alignItems:'flex-start',gap:8,padding:'0 22px 8px',cursor:'pointer'}} onClick={()=>setAgreeVIP(!agreeVIP)}>
      <div style={{width:15,height:15,borderRadius:4,border:`1.5px solid ${agreeVIP?C.cyan:(ctaShake?C.gold:C.grayD)}`,background:agreeVIP?C.cyan:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1,transition:'all .2s',animation:ctaShake?'checkFlash .5s':'none'}}>
        {agreeVIP&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      <div style={{fontSize:10.5,color:ctaShake?C.gold:C.gray,lineHeight:1.55,transition:'color .2s'}}>
        已阅读并同意
        <span onClick={e=>e.stopPropagation()} style={{color:C.cyan}}>《付费协议》</span>
        <span onClick={e=>e.stopPropagation()} style={{color:C.cyan}}>《服务协议》</span>
        <span onClick={e=>e.stopPropagation()} style={{color:C.cyan}}>《隐私政策》</span>
      </div>
    </div>
    {/* 订阅说明 - 精简 */}
    <div style={{margin:'14px 20px 0',padding:'12px 14px',borderRadius:10,background:'rgba(17,24,39,.4)',border:`0.5px solid ${C.border}`}}>
      <div style={{fontSize:9,color:C.grayD,lineHeight:1.7}}>
        <div>· 订阅内容：星舟 VIP · {cur.period} | 计费：通过 Apple ID 扣款</div>
        <div>· 自动续订：到期前24h自动续期，可在《iPhone设置-Apple ID-订阅》取消</div>
        <div>· <span style={{color:C.cyan,cursor:'pointer'}}>恢复购买</span>：更换设备后可恢复已购会员权益</div>
      </div>
    </div>
    </div>
    <TabBar active={1}/>
  </div>;
  }

  case 'login': return <div style={{width:'100%',height:'100%',background:C.bg,position:'relative',animation:'fadeIn .3s'}}>
    <Stars n={20}/><StatusBar/>
    <div style={{padding:'8px 16px',position:'relative',zIndex:5}}><ChevL to="home"/></div>
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:18,marginTop:36}}>
      <BrandLogo size={64} glow/>
      <div style={{fontSize:20,fontWeight:700,color:C.white,marginTop:6}}>欢迎来到星舟</div>
      <div style={{fontSize:12,color:C.gray}}>登录后享受更多加速权益</div>
    </div>
    <div style={{padding:'32px 28px 0',display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',borderRadius:12,overflow:'hidden',background:'rgba(17,24,39,.8)',border:`0.5px solid ${C.border}`}}>
        <div onClick={()=>setLoginTab('sms')} style={{flex:1,textAlign:'center',padding:'10px 0',fontSize:12,background:loginTab==='sms'?`linear-gradient(135deg,${C.cyan},${C.purple})`:'transparent',color:loginTab==='sms'?C.white:C.gray,fontWeight:loginTab==='sms'?600:400,cursor:'pointer',transition:'all .3s',borderRadius:loginTab==='sms'?12:0}}>短信登录</div>
        <div onClick={()=>setLoginTab('one')} style={{flex:1,textAlign:'center',padding:'10px 0',fontSize:12,background:loginTab==='one'?`linear-gradient(135deg,${C.cyan},${C.purple})`:'transparent',color:loginTab==='one'?C.white:C.gray,fontWeight:loginTab==='one'?600:400,cursor:'pointer',transition:'all .3s',borderRadius:loginTab==='one'?12:0}}>一键登录</div>
      </div>
      {loginTab==='sms'&&<div style={{display:'flex',alignItems:'center',background:'rgba(26,34,54,.8)',borderRadius:14,border:`0.5px solid ${C.border}`,padding:'0 16px',height:48}}>
        <span style={{fontSize:14,color:C.grayL,fontWeight:500,marginRight:8}}>+86</span><div style={{width:.5,height:20,background:C.grayD,marginRight:12}}/>
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="请输入手机号" style={{flex:1,background:'transparent',border:'none',outline:'none',color:C.white,fontSize:14}}/>
      </div>}
      {loginTab==='sms'?<div style={{display:'flex',alignItems:'center',background:'rgba(26,34,54,.8)',borderRadius:14,border:`0.5px solid ${C.border}`,padding:'0 16px',height:48}}>
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="请输入验证码" style={{flex:1,background:'transparent',border:'none',outline:'none',color:C.white,fontSize:14}}/>
        <span onClick={()=>{if(cd===0)setCd(60)}} style={{fontSize:12,color:cd>0?C.gray:C.cyan,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>{cd>0?`${cd}s 后重发`:'获取验证码'}</span>
      </div>:<div style={{textAlign:'center',padding:'18px 0',fontSize:13,color:C.white,background:'rgba(26,34,54,.8)',borderRadius:14,border:`0.5px solid ${C.border}`}}><div style={{fontSize:22,fontWeight:800,color:C.white,letterSpacing:1}}>+86 138****8888</div><div style={{fontSize:11,color:C.gray,marginTop:6}}><span style={{color:C.cyan,fontWeight:600}}>天翼认证</span> · 本机号码一键登录</div></div>}
      <div onClick={()=>{if(loginTab==='one'||phone.length>=7){setLogged(true);go('profile');}}} style={{background:`linear-gradient(135deg,${C.cyan},${C.purple})`,borderRadius:14,padding:'14px 0',textAlign:'center',fontSize:15,fontWeight:700,color:C.white,cursor:(loginTab==='one'||phone.length>=7)?'pointer':'default',marginTop:4,letterSpacing:2,boxShadow:`0 4px 20px rgba(0,200,255,.25)`,opacity:(loginTab==='one'||phone.length>=7)?1:.45,transition:'opacity .2s'}}>{loginTab==='one'?'一键登录':'登 录'}</div>
      <div style={{textAlign:'center',fontSize:10,color:C.gray,marginTop:4}}>登录即同意 <span style={{color:C.cyan}}>《用户协议》</span> 和 <span style={{color:C.cyan}}>《隐私政策》</span></div>
    </div>
  </div>;

  case 'profile': return <div style={{width:'100%',height:'100%',background:C.bg,position:'relative',paddingBottom:84,overflowY:'auto',animation:'fadeIn .3s'}}>
    <StatusBar/>
    {logged?
    <div style={{margin:'10px 20px',borderRadius:20,padding:'24px 18px',background:'linear-gradient(135deg,#0d1b3e,#1a1a4e 50%,#2D1B69)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-30,right:-30,width:100,height:100,background:'radial-gradient(circle,rgba(108,92,231,.15),transparent)',borderRadius:'50%'}}/>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <div style={{width:56,height:56,borderRadius:'50%',background:`linear-gradient(135deg,${C.cyan},${C.purple})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 16px rgba(0,200,255,.3)`}}><Ico d={IC.user} s={28} c={C.white}/></div>
        <div><div style={{fontSize:17,fontWeight:700,color:C.white}}>{phone.length>=7?`${phone.slice(0,3)}****${phone.slice(-4)}`:'138****8888'}</div><div style={{fontSize:11,color:C.gray,marginTop:3}}>ID: {phone.length>=6?phone.slice(-6):'100234'}</div></div>
      </div>
      {isVip?
      <div onClick={()=>setIsVip(false)} style={{marginTop:14,display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(245,166,35,.08)',borderRadius:12,padding:'10px 14px',border:'0.5px solid rgba(245,166,35,.3)',cursor:'pointer'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Ico d={IC.crown} s={18} c={C.gold}/>
          <span style={{fontSize:12.5,color:C.gold,fontWeight:700}}>VIP会员</span>
          <span style={{fontSize:11,color:C.grayL}}>{vipExpiry||'2026.12.31'} 到期</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end'}}>
          <div style={{fontSize:9,color:C.grayD}}>DEV</div>
        </div>
      </div>
      :
      <div onClick={e=>{e.stopPropagation();setIsVip(true);setVipExpiry('2026.12.31');}} style={{marginTop:14,display:'flex',alignItems:'center',justifyContent:'space-between',background:`linear-gradient(135deg,rgba(245,166,35,.18),rgba(247,220,111,.08))`,borderRadius:12,padding:'10px 14px',border:`0.5px solid rgba(245,166,35,.45)`,cursor:'pointer',boxShadow:'0 2px 12px rgba(245,166,35,.12)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Ico d={IC.crown} s={18} c={C.gold}/>
          <div>
            <div style={{fontSize:12.5,color:C.gold,fontWeight:700,letterSpacing:.3}}>开通 VIP · 享受专属特权</div>
            <div style={{fontSize:9,color:C.grayL,marginTop:2}}>新人 ¥6 首月 · 随时可取消</div>
          </div>
        </div>
        <div style={{fontSize:9,color:C.grayL,padding:'3px 8px',borderRadius:8,background:'rgba(245,166,35,.15)'}}>DEV</div>
      </div>
      }
    </div>
    :
    <div onClick={()=>go('login')} style={{margin:'10px 20px',borderRadius:20,padding:'24px 18px',background:'linear-gradient(135deg,#0d1b3e,#1a1a4e 50%,#2D1B69)',position:'relative',overflow:'hidden',cursor:'pointer'}}>
      <div style={{position:'absolute',top:-30,right:-30,width:100,height:100,background:'radial-gradient(circle,rgba(108,92,231,.15),transparent)',borderRadius:'50%'}}/>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(255,255,255,.06)',border:`0.5px dashed ${C.grayD}`,display:'flex',alignItems:'center',justifyContent:'center'}}><Ico d={IC.user} s={26} c={C.grayD}/></div>
        <div style={{flex:1}}>
          <div style={{fontSize:17,fontWeight:700,color:C.white}}>点击登录 / 注册</div>
          <div style={{fontSize:11,color:C.gray,marginTop:4}}>登录后享受专属会员权益</div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.grayL} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>
    }
    <div style={{margin:'14px 20px',background:'rgba(26,34,54,.8)',borderRadius:16,border:`0.5px solid ${C.border}`,overflow:'hidden'}}>
      {([{i:IC.bolt,l:'分享好友',c:C.cyan},{i:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',l:'帮助中心',act:()=>go('help'),c:C.green},{i:'M4 3h16a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2zM8 21h8M12 17v4',l:'UI 组件库',act:()=>go('uikit'),c:C.gold},{i:'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',l:'设置',act:()=>go('settings'),c:C.grayL}]).map((item,i,arr)=>(
        <div key={i} onClick={item.act} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 18px',borderBottom:i<arr.length-1?`0.5px solid ${C.border}`:'none',cursor:item.act?'pointer':'default'}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:36,height:36,borderRadius:10,background:`${item.c}15`,display:'flex',alignItems:'center',justifyContent:'center'}}><Ico d={item.i} s={18} c={item.c}/></div>
            <div style={{fontSize:14,color:C.white,fontWeight:500}}>{item.l}</div>
          </div>
          {item.act&&<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.grayD} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>}
        </div>
      ))}
    </div>
    <TabBar active={2}/>
  </div>;

  case 'settings': return <div style={{width:'100%',height:'100%',background:C.bg,position:'relative',overflowY:'auto',animation:'fadeIn .3s'}}>
    <StatusBar/>
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'8px 14px'}}><ChevL to="profile"/><span style={{fontSize:17,fontWeight:700,color:C.white}}>设置</span></div>
    <div style={{padding:'12px 20px',display:'flex',flexDirection:'column',gap:14}}>
      <div style={{background:'rgba(26,34,54,.8)',borderRadius:16,border:`0.5px solid ${C.border}`,overflow:'hidden'}}>
        {[{l:'关于我们',i:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01',c:C.cyan,p:'about'},{l:'隐私政策',i:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',c:C.green,p:'ppolicy'},{l:'服务协议',i:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',c:C.purple,p:'sagree'},{l:'付费协议',i:'M1 4h22v16H1zM1 10h22',c:C.gold,p:'pagree'}].map((item,i,arr)=>(
          <div key={i} onClick={()=>go(item.p as Page)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:i<arr.length-1?`0.5px solid ${C.border}`:'none',cursor:'pointer'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:30,height:30,borderRadius:8,background:`${item.c}15`,display:'flex',alignItems:'center',justifyContent:'center'}}><Ico d={item.i} s={16} c={item.c}/></div><span style={{fontSize:14,color:C.white}}>{item.l}</span></div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.grayD} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        ))}
      </div>
      <div style={{background:'rgba(26,34,54,.8)',borderRadius:16,border:`0.5px solid ${C.border}`,overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:`0.5px solid ${C.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:30,height:30,borderRadius:8,background:`${C.cyan}15`,display:'flex',alignItems:'center',justifyContent:'center'}}><Ico d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" s={16} c={C.cyan}/></div><span style={{fontSize:14,color:C.white}}>消息通知</span></div>
          <div onClick={()=>setNotif(!notif)} style={{width:44,height:24,borderRadius:12,background:notif?C.green:C.grayD,position:'relative',cursor:'pointer',transition:'background .3s'}}>
            <div style={{position:'absolute',left:notif?22:2,top:2,width:20,height:20,borderRadius:'50%',background:C.white,transition:'left .3s',boxShadow:'0 1px 4px rgba(0,0,0,.2)'}}/>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px'}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:30,height:30,borderRadius:8,background:`${C.purple}15`,display:'flex',alignItems:'center',justifyContent:'center'}}><Ico d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" s={16} c={C.purple}/></div><span style={{fontSize:14,color:C.white}}>清除缓存</span></div>
          <div style={{display:'flex',alignItems:'center',gap:6}}><span style={{fontSize:12,color:C.gray}}>23.5MB</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.grayD} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></div>
        </div>
      </div>
      <div style={{background:'rgba(26,34,54,.8)',borderRadius:16,border:`0.5px solid ${C.border}`,overflow:'hidden'}}>
        <div onClick={()=>go('deregister')} style={{padding:'15px 18px',borderBottom:`0.5px solid ${C.border}`,fontSize:14,color:C.red,fontWeight:500,cursor:'pointer',textAlign:'center'}}>注销账户</div>
        <div onClick={()=>{setLogged(false);setIsVip(false);setVipExpiry('');setPhone('');go('profile');}} style={{padding:'15px 18px',fontSize:14,color:C.red,fontWeight:500,cursor:'pointer',textAlign:'center'}}>退出登录</div>
      </div>
      {isVip&&<div onClick={()=>{setIsVip(false);setVipExpiry('');}} style={{textAlign:'center',fontSize:10,color:C.grayD,marginTop:8,cursor:'pointer'}}>[演示] 切换为免费用户</div>}
    </div>
  </div>;

  case 'about': return <div style={{width:'100%',height:'100%',background:C.bg,position:'relative',animation:'fadeIn .3s',display:'flex',flexDirection:'column'}}>
    <StatusBar/>
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'8px 14px'}}><ChevL to="settings"/><span style={{fontSize:17,fontWeight:700,color:C.white}}>关于我们</span></div>
    <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 30px'}}>
      <div style={{animation:'rocketFloat 3s ease-in-out infinite',marginBottom:20}}><BrandLogo size={130} glow/></div>
      <div style={{fontSize:22,fontWeight:800,background:'linear-gradient(135deg,#00C8FF,#6C5CE7)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',letterSpacing:3}}>星舟加速器</div>
      <div style={{fontSize:11,color:C.gray,marginTop:6}}>v1.0.0</div>
      <div style={{fontSize:12,color:C.gray,textAlign:'center',lineHeight:1.9,marginTop:20,maxWidth:280}}>一款专业的网络加速工具，采用全球顶尖加速节点与智能路由技术，为您提供安全、稳定、极速的网络加速服务。</div>
    </div>
    <div style={{padding:'0 30px 40px',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
      <div style={{width:'100%',height:.5,background:C.grayD,marginBottom:16}}/>
      <div style={{fontSize:10,color:C.grayD}}>Inner Mongolia CENJE Electronic CO., LTD.</div>
      <div style={{fontSize:10,color:C.grayD,marginTop:4}}>沪ICP备2021006153号-4</div>
      <div style={{fontSize:9,color:C.grayD,marginTop:6}}>© 2026 All Rights Reserved</div>
    </div>
  </div>;

  case 'help': return <div style={{width:'100%',height:'100%',background:C.bg,position:'relative',overflowY:'auto',animation:'fadeIn .3s'}}>
    <StatusBar/>
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'8px 14px'}}><ChevL to="profile"/><span style={{fontSize:17,fontWeight:700,color:C.white}}>帮助中心</span></div>
    <div style={{padding:'8px 20px 0'}}>
      <div style={{display:'flex',borderRadius:12,overflow:'hidden',background:'rgba(17,24,39,.8)',border:`0.5px solid ${C.border}`}}>
        <div onClick={()=>{setHelpTab('speed');setOpenFaq(-1);}} style={{flex:1,textAlign:'center',padding:'10px 0',fontSize:12,background:helpTab==='speed'?`linear-gradient(135deg,${C.cyan},${C.purple})`:'transparent',color:helpTab==='speed'?C.white:C.gray,fontWeight:helpTab==='speed'?600:400,cursor:'pointer',transition:'all .3s',borderRadius:helpTab==='speed'?12:0}}>加速相关</div>
        <div onClick={()=>{setHelpTab('vip');setOpenFaq(-1);}} style={{flex:1,textAlign:'center',padding:'10px 0',fontSize:12,background:helpTab==='vip'?`linear-gradient(135deg,${C.gold},#F7DC6F)`:'transparent',color:helpTab==='vip'?'#1a1a2e':C.gray,fontWeight:helpTab==='vip'?700:400,cursor:'pointer',transition:'all .3s',borderRadius:helpTab==='vip'?12:0}}>会员相关</div>
      </div>
    </div>
    <div style={{padding:'14px 20px 24px',display:'flex',flexDirection:'column',gap:10}}>
      {(helpTab==='speed'?faqs.speed:faqs.vip).map((f,i)=>(
        <div key={i} onClick={()=>setOpenFaq(openFaq===i?-1:i)} style={{background:'rgba(26,34,54,.8)',borderRadius:14,border:`0.5px solid ${openFaq===i?(helpTab==='vip'?C.gold:C.cyan):C.border}`,padding:'14px 16px',cursor:'pointer',transition:'border-color .2s'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <div style={{fontSize:13.5,color:C.white,fontWeight:500,flex:1,lineHeight:1.4}}>{f.q}</div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={openFaq===i?(helpTab==='vip'?C.gold:C.cyan):C.grayD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:openFaq===i?'rotate(90deg)':'rotate(0)',transition:'transform .25s',flexShrink:0}}><path d="M9 18l6-6-6-6"/></svg>
          </div>
          {openFaq===i&&<div style={{fontSize:12,color:C.grayL,lineHeight:1.75,marginTop:10,paddingTop:10,borderTop:`0.5px solid ${C.border}`,whiteSpace:'pre-line'}}>{f.a}</div>}
        </div>
      ))}
      <div style={{textAlign:'center',fontSize:10,color:C.grayD,marginTop:12}}>未找到想要的答案？<span style={{color:C.cyan,cursor:'pointer'}}> 联系客服</span></div>
    </div>
  </div>;

  case 'ppolicy': return <div style={{width:'100%',height:'100%',background:C.bg,position:'relative',overflowY:'auto',animation:'fadeIn .3s'}}>
    <StatusBar/>
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'8px 14px'}}><ChevL to="settings"/><span style={{fontSize:17,fontWeight:700,color:C.white}}>隐私政策</span></div>
    <div style={{padding:'8px 22px 40px'}}>
      <div style={{fontSize:10,color:C.grayD,marginBottom:16,letterSpacing:.5}}>生效日期：2026 年 7 月 10 日 · 版本 v1.0</div>
      <div style={{background:`${C.cyan}0d`,border:`0.5px solid ${C.cyan}44`,borderRadius:10,padding:'12px 14px',marginBottom:20,fontSize:11,color:C.cyan,lineHeight:1.7}}>重要承诺：星舟加速器作为网络加速工具，不会记录、不会存储您访问的网站地址、浏览内容及加密流量。</div>
      {[
        {t:'一、引言',c:'Inner Mongolia CENJE Electronic CO., LTD.（以下简称《我们》）高度重视您的个人信息与隐私保护。本《隐私政策》说明我们如何收集、使用、存储、共享和保护您在使用星舟加速器 iOS 客户端（以下简称《本服务》）过程中提供的信息。使用本服务即表示您已阅读、理解并同意本政策全部内容。'},
        {t:'二、我们收集的信息',c:'1. 账号信息：手机号码（仅用于登录与账户识别）\n2. 设备信息：设备型号、iOS 系统版本、IDFV 应用商标识符\n3. 使用信息：连接节点、加速时长、异常与崩溃日志\n4. 支付信息：由 Apple 处理，我们仅接收订单验证结果，不接触您的支付账号、密码或银行卡信息'},
        {t:'三、信息使用',c:'· 为您提供加速服务与账户管理\n· 处理 VIP 订阅、支付验证与会员权益开通\n· 优化服务性能、排查技术故障\n· 履行法律法规要求的必要义务'},
        {t:'四、信息共享',c:'· Apple：仅用于内购订单验证\n· 短信服务商：仅用于发送登录验证码\n· 我们承诺：不会向任何无关第三方出售、提供您的个人信息'},
        {t:'五、信息存储',c:'· 存储于中华人民共和国境内合规云服务器\n· 传输与存储全程采用 AES-256 银行级加密\n· 存储期限：账号有效期 + 注销后 6 个月，法律法规另有规定除外'},
        {t:'六、您的权利',c:'· 访问、更正您的个人信息\n· 随时通过《设置 - 注销账户》删除账号与全部信息\n· 撤回已同意的授权\n· 向监管部门投诉与举报'},
        {t:'七、未成年人保护',c:'本服务仅面向 18 周岁以上成年用户。若您为未成年人，请在监护人监护下使用或立即停止使用。'},
        {t:'八、政策更新',c:'本政策如有重大变更，我们将通过 App 内显著位置推送公告，您可选择接受或停止使用本服务。'},
        {t:'九、联系我们',c:'邮箱：sanye.app@outlook.com\n地址：内蒙古自治区'},
      ].map((s,i)=>(
        <div key={i} style={{marginBottom:18}}>
          <div style={{fontSize:13,color:C.white,fontWeight:600,marginBottom:6}}>{s.t}</div>
          <div style={{fontSize:12,color:C.grayL,lineHeight:1.75,whiteSpace:'pre-line'}}>{s.c}</div>
        </div>
      ))}
    </div>
  </div>;

  case 'sagree': return <div style={{width:'100%',height:'100%',background:C.bg,position:'relative',overflowY:'auto',animation:'fadeIn .3s'}}>
    <StatusBar/>
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'8px 14px'}}><ChevL to="settings"/><span style={{fontSize:17,fontWeight:700,color:C.white}}>服务协议</span></div>
    <div style={{padding:'8px 22px 40px'}}>
      <div style={{fontSize:10,color:C.grayD,marginBottom:16,letterSpacing:.5}}>生效日期：2026 年 7 月 10 日 · 版本 v1.0</div>
      <div style={{background:`${C.purple}0d`,border:`0.5px solid ${C.purple}44`,borderRadius:10,padding:'12px 14px',marginBottom:20,fontSize:11,color:C.purple,lineHeight:1.7}}>提示：本协议为您与 Inner Mongolia CENJE Electronic CO., LTD. 之间具有法律约束力的协议，请您仔细阅读，尤其与您权利义务相关的重要条款。</div>
      {[
        {t:'一、协议接受',c:'本《服务协议》是您与 Inner Mongolia CENJE Electronic CO., LTD. 就使用星舟加速器服务所订立的法律协议。您一旦登录或使用本服务，即视为全部接受本协议。如不同意，请您立即停止使用。'},
        {t:'二、服务内容',c:'· 本服务为网络加速与网络优化工具，包含智能模式与全局模式两种运行方式\n· 服务分为免费基础服务与 VIP 会员高级服务，VIP 具体权益以 App 内公布为准\n· 我们保留因业务升级与合规需求调整服务内容、方式与节点的权利'},
        {t:'三、账户注册与使用',c:'· 您可使用手机号或 Apple ID 完成账户登录\n· 一人一号，账号不得转让、出售、出借予他人使用\n· 请妥善保管登录信息，因您个人原因造成的损失由您自行承担'},
        {t:'四、用户行为规范',c:'您承诺不利用本服务从事以下行为：\n1. 违反中华人民共和国法律、行政法规与国家安全规定\n2. 传播未经审核的违法信息、色情、赌博、暴力等内容\n3. 实施黑客攻击、DDoS、爬取与干扰他人网络及服务行为\n4. 商业转售本服务、逆向工程、破解客户端或侵犯知识产权\n一经发现，我们有权即时中止服务，并保留追究您法律责任的权利。'},
        {t:'五、免责声明',c:'在法律允许的范围内，我们不对以下情形造成的服务中断或损失承担责任：\n· 不可抗力、网络故障、系统升级维护\n· 您自身违规使用导致的后果\n· 第三方服务与内容产生的责任'},
        {t:'六、服务变更与终止',c:'· 因业务调整，我们可变更或终止部分服务，将提前 30 日在 App 内公告\n· 如您严重违反本协议，我们有权立即终止为您提供服务，已支付费用不予退还'},
        {t:'七、知识产权',c:'星舟加速器及其包含的文字、图标、UI 设计、代码、加速算法等知识产权均归 Inner Mongolia CENJE Electronic CO., LTD. 或其权利人所有。未经书面许可，不得以任何形式使用、复制、传播。'},
        {t:'八、争议解决',c:'· 本协议适用中华人民共和国法律\n· 发生争议应先友好协商，协商不成的，提交上海仲裁委员会仲裁'},
        {t:'九、协议修改',c:'本协议如有修改，将通过 App 内通知或版本更新形式告知，您继续使用即视为接受修改。'},
        {t:'十、联系方式',c:'邮箱：sanye.app@outlook.com'},
      ].map((s,i)=>(
        <div key={i} style={{marginBottom:18}}>
          <div style={{fontSize:13,color:C.white,fontWeight:600,marginBottom:6}}>{s.t}</div>
          <div style={{fontSize:12,color:C.grayL,lineHeight:1.75,whiteSpace:'pre-line'}}>{s.c}</div>
        </div>
      ))}
    </div>
  </div>;

  case 'pagree': return <div style={{width:'100%',height:'100%',background:C.bg,position:'relative',overflowY:'auto',animation:'fadeIn .3s'}}>
    <StatusBar/>
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'8px 14px'}}><ChevL to="settings"/><span style={{fontSize:17,fontWeight:700,color:C.white}}>付费协议</span></div>
    <div style={{padding:'8px 22px 40px'}}>
      <div style={{fontSize:10,color:C.grayD,marginBottom:16,letterSpacing:.5}}>生效日期：2026 年 7 月 10 日 · 版本 v1.0</div>
      <div style={{background:`${C.gold}12`,border:`0.5px solid ${C.gold}55`,borderRadius:10,padding:'12px 14px',marginBottom:20,fontSize:11,color:C.gold,lineHeight:1.7}}>重要提示：本协议适用于 Apple ID 内购途径，报名前请仔细阅读自动续订、退款与价格调整相关条款。</div>
      {[
        {t:'一、订阅内容',c:'星舟 VIP 会员，订阅后可享受：解锁 50+ 全球节点、低于 20ms 低延迟通道、游戏与流媒体定向加速、AES-256 银行级加密、去除广告等权益。'},
        {t:'二、订阅套餐与价格',c:'· 1 个月：¥30 / 月（新人首月 ¥6，仅限首次订阅）\n· 6 个月：¥120（日均约 ¥0.67）\n· 1 年：¥198（日均约 ¥0.54）\n实际价格以 Apple 支付弹窗显示为准。'},
        {t:'三、计费方式',c:'确认购买后，费用将从您的 Apple ID 账户扣取，当期扣款不可取消。'},
        {t:'四、自动续订（重要）',c:'· 订阅到期前 24 小时内，Apple 将自动从您的 Apple ID 扣取下一个周期费用\n· 若您不需要续订，请至少提前 24 小时手动关闭自动续订\n· 关闭路径：iPhone《设置 - Apple ID - 订阅 - 星舟 VIP》，点击取消订阅\n· 已扣费周期内，会员权益仍保留至到期'},
        {t:'五、新人优惠',c:'· 新人首月 ¥6 仅限首次订阅 1 个月套餐的用户\n· 优惠期结束后自动按 ¥30 / 月标准价续订\n· 同一 Apple ID 仅可享受一次新人优惠'},
        {t:'六、恢复购买',c:'更换设备、重装 App 后，登录相同 Apple ID，在会员中心点击《恢复购买》即可重新启用权益。'},
        {t:'七、退款政策',c:'iOS 内购退款由 Apple 统一处理，您需自行向 Apple 官方申请：\nreportaproblem.apple.com\n提供订单号与退款理由，由 Apple 审核后退回原付款。我们无权直接为您处理退款。'},
        {t:'八、价格调整',c:'如未来套餐价格发生变化，我们将提前 30 日通过 App 内通知告知，您可选择接受新价格或取消自动续订。'},
        {t:'九、争议解决',c:'本协议适用中华人民共和国法律，争议提交上海仲裁委员会仲裁。'},
      ].map((s,i)=>(
        <div key={i} style={{marginBottom:18}}>
          <div style={{fontSize:13,color:C.white,fontWeight:600,marginBottom:6}}>{s.t}</div>
          <div style={{fontSize:12,color:C.grayL,lineHeight:1.75,whiteSpace:'pre-line'}}>{s.c}</div>
        </div>
      ))}
    </div>
  </div>;

  case 'deregister': return <div style={{width:'100%',height:'100%',background:C.bg,position:'relative',animation:'fadeIn .3s',display:'flex',flexDirection:'column'}}>
    <StatusBar/>
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'8px 14px'}}><ChevL to="settings"/><span style={{fontSize:17,fontWeight:700,color:C.white}}>注销账户</span></div>
    <div style={{padding:'28px 24px 0',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div style={{width:56,height:56,borderRadius:'50%',background:`${C.red}18`,border:`1px solid ${C.red}55`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
        <Ico d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" s={28} c={C.red}/>
      </div>
      <div style={{fontSize:15,fontWeight:700,color:C.red,letterSpacing:2,marginBottom:24}}>此操作不可撤销</div>
      {logged&&<div style={{width:'100%',background:'rgba(26,34,54,.6)',border:`0.5px solid ${C.border}`,borderRadius:10,padding:'12px 14px',marginBottom:20,fontSize:11,color:C.grayL,lineHeight:1.8}}>
        <span>账号：{phone.length>=7?`${phone.slice(0,3)}****${phone.slice(-4)}`:'138****8888'}</span><span style={{marginLeft:14,color:isVip?C.gold:C.grayD}}>{isVip?'VIP生效中':'未开通VIP'}</span>
      </div>}
      <div style={{width:'100%',fontSize:12,color:C.grayL,lineHeight:2,marginBottom:28}}>
        <div><span style={{color:C.red}}>·</span> 账号与数据永久删除，无法恢复</div>
        <div><span style={{color:C.red}}>·</span> VIP权益立即失效且不退款</div>
        <div><span style={{color:C.red}}>·</span> 请先关闭自动续订以免继续扣费</div>
      </div>
      {!dereConfirm?
        <div onClick={()=>{if(!logged){go('login');return;}setDereConfirm(true);setDereInput('');}} style={{width:'100%',background:`${C.red}20`,border:`1px solid ${C.red}88`,borderRadius:12,padding:'14px 0',textAlign:'center',fontSize:14,color:C.red,fontWeight:600,cursor:'pointer'}}>{logged?'确认注销':'请先登录'}</div>
      :
        <div style={{width:'100%'}}>
          <div style={{fontSize:11,color:C.grayD,textAlign:'center',marginBottom:12}}>请输入「确认注销」四个字以执行操作</div>
          <input value={dereInput} onChange={e=>setDereInput(e.target.value)} placeholder='确认注销' style={{width:'100%',background:'rgba(26,34,54,.8)',border:`1px solid ${dereInput==='确认注销'?C.red:C.border}`,borderRadius:12,padding:'13px 16px',fontSize:14,color:C.white,outline:'none',marginBottom:14,textAlign:'center',letterSpacing:6}}/>
          <div onClick={()=>{if(dereInput==='确认注销'){setLogged(false);setIsVip(false);setVipExpiry('');setPhone('');setDereConfirm(false);setDereInput('');go('profile');}}} style={{background:dereInput==='确认注销'?C.red:`${C.red}33`,borderRadius:12,padding:'14px 0',textAlign:'center',fontSize:14,color:C.white,fontWeight:700,cursor:dereInput==='确认注销'?'pointer':'default',opacity:dereInput==='确认注销'?1:.45,transition:'all .2s',boxShadow:dereInput==='确认注销'?`0 4px 16px ${C.red}55`:'none',marginBottom:10}}>注销账户</div>
          <div onClick={()=>{setDereConfirm(false);setDereInput('');}} style={{padding:'8px 0',textAlign:'center',fontSize:13,color:C.gray,cursor:'pointer'}}>取消</div>
        </div>
      }
    </div>
  </div>;

  case 'uikit': return <div style={{width:'100%',height:'100%',background:C.bg,position:'relative',overflowY:'auto',animation:'fadeIn .3s'}}>
    <StatusBar/>
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'8px 14px'}}><ChevL to="profile"/><span style={{fontSize:17,fontWeight:700,color:C.white}}>UI 组件库</span></div>
    <div style={{padding:'12px 20px 40px',display:'flex',flexDirection:'column',gap:20}}>
    {/* ── 确认弹窗 A: 经典居中弹窗 ── */}
    <div style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:1}}>▸ 确认弹窗 · 经典居中</div>
    <div style={{background:C.card,borderRadius:16,padding:'24px 20px',border:`0.5px solid ${C.border}`,textAlign:'center'}}>
      <div style={{fontSize:15,fontWeight:700,color:C.white,marginBottom:8}}>确认操作</div>
      <div style={{fontSize:12,color:C.gray,lineHeight:1.7,marginBottom:20}}>您确定要执行此操作吗？\n此操作不可撤销。</div>
      <div style={{display:'flex',gap:10}}>
        <div style={{flex:1,padding:'11px 0',borderRadius:10,background:'rgba(26,34,54,.8)',border:`0.5px solid ${C.border}`,fontSize:13,color:C.gray,fontWeight:500,cursor:'pointer'}}>取消</div>
        <div style={{flex:1,padding:'11px 0',borderRadius:10,background:`linear-gradient(135deg,${C.cyan},${C.purple})`,fontSize:13,color:C.white,fontWeight:600,cursor:'pointer'}}>确认</div>
      </div>
    </div>
    {/* ── 确认弹窗 B: 危险操作 / 红色警告 ── */}
    <div style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:1}}>▸ 确认弹窗 · 危险操作</div>
    <div style={{background:C.card,borderRadius:16,padding:'24px 20px',border:`0.5px solid ${C.red}40`,textAlign:'center'}}>
      <div style={{width:40,height:40,borderRadius:'50%',background:`${C.red}18`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}><Ico d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" s={22} c={C.red}/></div>
      <div style={{fontSize:15,fontWeight:700,color:C.red,marginBottom:8}}>危险操作</div>
      <div style={{fontSize:12,color:C.gray,lineHeight:1.7,marginBottom:20}}>此操作将永久删除您的数据，\n且无法恢复。</div>
      <div style={{display:'flex',gap:10}}>
        <div style={{flex:1,padding:'11px 0',borderRadius:10,background:'rgba(26,34,54,.8)',border:`0.5px solid ${C.border}`,fontSize:13,color:C.gray,fontWeight:500,cursor:'pointer'}}>取消</div>
        <div style={{flex:1,padding:'11px 0',borderRadius:10,background:C.red,fontSize:13,color:C.white,fontWeight:600,cursor:'pointer'}}>删除</div>
      </div>
    </div>
    {/* ── 确认弹窗 C: 成功状态 ── */}
    <div style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:1}}>▸ 确认弹窗 · 成功状态</div>
    <div style={{background:C.card,borderRadius:16,padding:'24px 20px',border:`0.5px solid ${C.green}40`,textAlign:'center'}}>
      <div style={{width:40,height:40,borderRadius:'50%',background:`${C.green}18`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg></div>
      <div style={{fontSize:15,fontWeight:700,color:C.green,marginBottom:8}}>操作成功</div>
      <div style={{fontSize:12,color:C.gray,lineHeight:1.7,marginBottom:20}}>您的会员已成功开通，\n享受专属加速权益。</div>
      <div style={{padding:'11px 0',borderRadius:10,background:C.green,fontSize:13,color:C.white,fontWeight:600,cursor:'pointer'}}>知道了</div>
    </div>
    {/* ── 确认弹窗 D: 底部弹出 ActionSheet ── */}
    <div style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:1}}>▸ ActionSheet · 底部弹出</div>
    <div style={{background:C.card,borderRadius:16,padding:'0',border:`0.5px solid ${C.border}`,overflow:'hidden'}}>
      <div style={{padding:'14px 18px',textAlign:'center',fontSize:14,color:C.cyan,fontWeight:500,borderBottom:`0.5px solid ${C.border}`,cursor:'pointer'}}>复制链接</div>
      <div style={{padding:'14px 18px',textAlign:'center',fontSize:14,color:C.cyan,fontWeight:500,borderBottom:`0.5px solid ${C.border}`,cursor:'pointer'}}>分享到微信</div>
      <div style={{padding:'14px 18px',textAlign:'center',fontSize:14,color:C.red,fontWeight:500,borderBottom:`0.5px solid ${C.border}`,cursor:'pointer'}}>举报</div>
      <div style={{height:6,background:'rgba(0,0,0,.3)'}}/>
      <div style={{padding:'14px 18px',textAlign:'center',fontSize:14,color:C.gray,fontWeight:500,cursor:'pointer'}}>取消</div>
    </div>
    {/* ── Toast 提示 ── */}
    <div style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:1}}>▸ Toast 提示</div>
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(16,185,129,.12)',border:`0.5px solid ${C.green}55`,borderRadius:10,padding:'10px 14px'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg><span style={{fontSize:12,color:C.green,fontWeight:500}}>操作成功</span></div>
      <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(239,68,68,.12)',border:`0.5px solid ${C.red}55`,borderRadius:10,padding:'10px 14px'}}><Ico d="M12 9v4M12 17h.01" s={14} c={C.red}/><span style={{fontSize:12,color:C.red,fontWeight:500}}>网络连接失败，请重试</span></div>
      <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(245,166,35,.12)',border:`0.5px solid ${C.gold}55`,borderRadius:10,padding:'10px 14px'}}><Ico d="M12 9v4M12 17h.01" s={14} c={C.gold}/><span style={{fontSize:12,color:C.gold,fontWeight:500}}>会员即将到期，请及时续费</span></div>
      <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(0,200,255,.08)',border:`0.5px solid ${C.cyan}44`,borderRadius:10,padding:'10px 14px'}}><Ico d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01" s={14} c={C.cyan}/><span style={{fontSize:12,color:C.cyan,fontWeight:500}}>新版本可用，请更新</span></div>
    </div>
    {/* ── Badge 标签 / 状态 ── */}
    <div style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:1}}>▸ Badge 标签</div>
    <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
      <div style={{padding:'4px 10px',borderRadius:10,background:`${C.cyan}18`,border:`0.5px solid ${C.cyan}44`,fontSize:10,color:C.cyan,fontWeight:500}}>低延迟</div>
      <div style={{padding:'4px 10px',borderRadius:10,background:`${C.green}18`,border:`0.5px solid ${C.green}44`,fontSize:10,color:C.green,fontWeight:500}}>已连接</div>
      <div style={{padding:'4px 10px',borderRadius:10,background:`${C.gold}18`,border:`0.5px solid ${C.gold}44`,fontSize:10,color:C.gold,fontWeight:500}}>VIP</div>
      <div style={{padding:'4px 10px',borderRadius:10,background:`${C.red}18`,border:`0.5px solid ${C.red}44`,fontSize:10,color:C.red,fontWeight:500}}>已过期</div>
      <div style={{padding:'4px 10px',borderRadius:10,background:`${C.purple}18`,border:`0.5px solid ${C.purple}44`,fontSize:10,color:C.purple,fontWeight:500}}>新功能</div>
      <div style={{padding:'4px 10px',borderRadius:10,background:`${C.grayD}`,border:`0.5px solid ${C.gray}44`,fontSize:10,color:C.grayL,fontWeight:500}}>离线</div>
    </div>
    {/* ── 按钮样式 ── */}
    <div style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:1}}>▸ 按钮样式</div>
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div style={{padding:'13px 0',borderRadius:12,background:`linear-gradient(135deg,${C.cyan},${C.purple})`,textAlign:'center',fontSize:14,fontWeight:700,color:C.white,letterSpacing:1,boxShadow:`0 4px 20px rgba(0,200,255,.25)`,cursor:'pointer'}}>主要按钮 Primary</div>
      <div style={{padding:'13px 0',borderRadius:12,background:`linear-gradient(135deg,${C.gold},#F7DC6F)`,textAlign:'center',fontSize:14,fontWeight:700,color:'#1a1a2e',letterSpacing:1,cursor:'pointer'}}>购买按钮 CTA</div>
      <div style={{padding:'13px 0',borderRadius:12,background:'transparent',border:`1.5px solid ${C.cyan}`,textAlign:'center',fontSize:14,fontWeight:600,color:C.cyan,letterSpacing:1,cursor:'pointer'}}>次要按钮 Outline</div>
      <div style={{padding:'13px 0',borderRadius:12,background:'rgba(26,34,54,.8)',border:`0.5px solid ${C.border}`,textAlign:'center',fontSize:14,fontWeight:500,color:C.gray,cursor:'pointer'}}>禁用状态 Disabled</div>
      <div style={{padding:'13px 0',borderRadius:12,background:C.red,textAlign:'center',fontSize:14,fontWeight:700,color:C.white,letterSpacing:1,cursor:'pointer'}}>危险按钮 Danger</div>
    </div>
    {/* ── Loading 状态 ── */}
    <div style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:1}}>▸ Loading 状态</div>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16,padding:'16px 0'}}>
      <div style={{width:20,height:20,border:`2px solid ${C.grayD}`,borderTopColor:C.cyan,borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
      <div style={{display:'flex',gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:C.cyan,animation:`pulse 1.2s infinite ${i*.2}s`}}/>)}</div>
      <div style={{width:32,height:3,borderRadius:2,background:C.grayD,overflow:'hidden'}}><div style={{width:'60%',height:'100%',background:`linear-gradient(90deg,${C.cyan},${C.purple})`,borderRadius:2,animation:'shimmer 1.5s linear infinite'}}/></div>
    </div>
    {/* ── 分割线 / 卡片 ── */}
    <div style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:1}}>▸ 卡片样式</div>
    <div style={{background:C.card,borderRadius:14,padding:'16px 16px',border:`0.5px solid ${C.border}`}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:`${C.cyan}15`,display:'flex',alignItems:'center',justifyContent:'center'}}><Ico d={IC.bolt} s={18} c={C.cyan}/></div>
          <div><div style={{fontSize:13,color:C.white,fontWeight:600}}>智能模式</div><div style={{fontSize:10,color:C.gray,marginTop:2}}>自动选择最优节点</div></div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.grayD} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>
    {/* ── 空状态 ── */}
    <div style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:1}}>▸ 空状态页</div>
    <div style={{background:C.card,borderRadius:14,padding:'30px 20px',border:`0.5px solid ${C.border}`,textAlign:'center'}}>
      <div style={{fontSize:32,marginBottom:10}}>:)</div>
      <div style={{fontSize:13,color:C.gray,fontWeight:500}}>暂无数据</div>
      <div style={{fontSize:11,color:C.grayD,marginTop:4}}>暂时没有相关内容，请稍后再试</div>
    </div>
    </div>
  </div>;

  default: return null;
  }};

  return(
    <div style={{width:'100%',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#050810',overflow:'hidden'}}>
      <style>{css}</style>
      <div style={{width:375,height:812,borderRadius:44,border:`3px solid ${C.cardL}`,background:C.bg,overflow:'hidden',position:'relative',boxShadow:'0 0 80px rgba(0,0,0,.8),0 0 0 1px rgba(0,200,255,.05)',transform:'scale(min(1, calc(100vh / 820), calc(100vw / 385)))',transformOrigin:'center center'}}>
        <div style={{position:'absolute',top:10,left:'50%',transform:'translateX(-50%)',width:120,height:28,background:'#000',borderRadius:14,zIndex:40}}/>
        <div style={{width:'100%',height:'100%',overflow:'hidden',position:'relative'}}>{renderPage()}</div>
      </div>
    </div>
  );
}
