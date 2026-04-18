const ITEMS = [
  { t:"NEXT.JS",hi:false},{t:"·",hi:true},{t:"GSAP",hi:false},{t:"·",hi:true},
  {t:"THREE.JS",hi:false},{t:"·",hi:true},{t:"FASTAPI",hi:true},{t:"·",hi:true},
  {t:"NETWORKING",hi:false},{t:"·",hi:true},{t:"CREATIVE DIRECTION",hi:true},{t:"·",hi:true},
  {t:"FORMULA EV",hi:false},{t:"·",hi:true},{t:"TYPESCRIPT",hi:false},{t:"·",hi:true},
];
export default function Marquee() {
  const d = [...ITEMS,...ITEMS];
  return (
    <div className="marquee-outer">
      <div className="marquee-track">
        {d.map((item,i) => <span key={i} className={`marquee-item${item.hi?" hi":""}`}>{item.t}</span>)}
      </div>
    </div>
  );
}
