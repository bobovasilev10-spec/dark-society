import {Link} from 'react-router-dom'; import {mediaUrl} from '../api';
export default function ProductCard({product:p}){const slug=p.slug||p.id;const image=p.video||p.mp4||p.webp||p.image||p.images?.find(i=>String(i?.image_path||i).toLowerCase().endsWith('.mp4'))?.image_path||p.images?.[0]?.image_path||p.images?.[0];
const isVideo=typeof image==="string"&&image.toLowerCase().endsWith(".mp4");const price=Number(p.price||p.current_price||0);return <article className="product-card"><Link to={`/product/${slug}`} className="product-media">
{isVideo?(
<video
src={mediaUrl(image)}
autoPlay
muted
loop
playsInline
preload="metadata"
className="w-full h-full object-cover"
/>
):(
<img src={mediaUrl(image)} alt={p.name}/>
)}
{p.badge&&<span className="badge">{p.badge}</span>}
</Link><div className="product-info"><Link to={`/product/${slug}`}><h3>{typeof p.name==='object'?(p.name.bg||Object.values(p.name)[0]):p.name}</h3></Link><span>€{price.toFixed(2)}</span></div></article>}
