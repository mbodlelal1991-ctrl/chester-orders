import { useEffect, useState } from "react";
import { getProducts, placeOrder } from "./api";

const NAVY = "#10206b";
const RED = "#d62828";
const YELLOW = "#f9b61a";
const ORANGE = "#f5a623";

const card = {
background: "#fff",
borderRadius: 12,
overflow: "hidden",
boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
color: NAVY,
display: "flex",
flexDirection: "column",
};
const cardTitle = { background: ORANGE, color: NAVY, fontWeight: 800, padding: "8px 10px", fontSize: 15 };
const cardBody = { padding: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 };
const priceTag = { background: NAVY, color: "#fff", borderRadius: 8, padding: "4px 10px", fontWeight: 700, fontSize: 13 };
const btn = { width: 32, height: 32, fontSize: 18, fontWeight: 700, borderRadius: 8, border: `2px solid ${NAVY}`, background: "#fff", color: NAVY, cursor: "pointer", padding: 0 };
const btnPlus = { ...btn, background: RED, border: `2px solid ${RED}`, color: "#fff" };
const panel = {
background: "#fff",
borderRadius: 12,
overflow: "hidden",
boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
color: NAVY,
};
const panelTitle = { background: RED, color: "#fff", fontWeight: 800, letterSpacing: 1, padding: "10px 14px", fontSize: 18, textTransform: "uppercase" };
const field = { display: "block", width: "100%", padding: 10, marginBottom: 10, boxSizing: "border-box", border: "2px solid #c9d1e6", borderRadius: 8, background: "#fff", color: NAVY };
const mainBtn = { padding: 12, width: "100%", background: RED, color: "#fff", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer" };

export default function Shop() {
const [products, setProducts] = useState([]);
const [qty, setQty] = useState({});
const [deliveryDate, setDeliveryDate] = useState("");
const [notes, setNotes] = useState("");
const [error, setError] = useState("");
const [placing, setPlacing] = useState(false);
const [done, setDone] = useState(null);

useEffect(() => {
getProducts().then(setProducts).catch(e => setError(e.message));
}, []);

const change = (p, dir) => {
const step = p.pricingType === "per_kg" ? 0.5 : 1;
setQty(q => ({
...q,
[p.productId]: Math.max(0, +((q[p.productId] || 0) + dir * step).toFixed(1)),
}));
};

const lines = products
.filter(p => qty[p.productId] > 0)
.map(p => ({ ...p, qty: qty[p.productId], total: p.price * qty[p.productId] }));
const total = lines.reduce((s, l) => s + l.total, 0);
const today = new Date().toISOString().slice(0, 10);

const submit = async () => {
setError("");
if (lines.length === 0) return setError("Add at least one item.");
if (!deliveryDate) return setError("Choose a delivery date.");
setPlacing(true);
try {
const res = await placeOrder({
deliveryDate,
notes,
items: lines.map(l => ({ productId: l.productId, quantity: l.qty })),
});
setDone(res);
setQty({});
setNotes("");
setDeliveryDate("");
} catch (e) {
setError(e.message);
}
setPlacing(false);
};

if (done) {
return (
<div style={{ maxWidth: 520, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
<div style={panel}>
<div style={panelTitle}>Order placed</div>
<div style={{ padding: 16 }}>
<p>Thank you. Chester Butchery has received your order.</p>
<h3>Total: R{Number(done.total).toFixed(2)}</h3>
<button style={mainBtn} onClick={() => setDone(null)}>
Place another order
</button>
</div>
</div>
</div>
);
}

return (
<div style={{ maxWidth: 1100, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
<div style={{ textAlign: "center", marginBottom: 18 }}>
<h1 style={{ color: "#fff", margin: 0, fontSize: 38, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, textShadow: "2px 3px 0 rgba(0,0,0,0.35)" }}>
Chester Butchery
</h1>
<div style={{ display: "inline-block", background: RED, color: YELLOW, fontWeight: 900, fontSize: 18, letterSpacing: 2, padding: "4px 22px", transform: "skewX(-10deg)", marginTop: 8 }}>
<span style={{ display: "inline-block", transform: "skewX(10deg)" }}>ORDER ONLINE</span>
</div>
</div>

<div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
<div
style={{
flex: "1 1 520px",
display: "grid",
gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
gap: 12,
}}
>
{products.filter(p => p.available !== false).map(p => (
<div key={p.productId} style={card}>
<div style={cardTitle}>{https://www.google.com/url?q=http://p.name&source=gmail&ust=1792404012027000&sa=E}</div>
<div style={cardBody}>
<span style={priceTag}>
R{Number(p.price).toFixed(2)} {p.pricingType === "per_kg" ? "per kg" : `per ${p.packSize} pack`}
</span>
<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
<button style={btn} onClick={() => change(p, -1)}>-</button>
<span style={{ minWidth: 50, fontWeight: 700, fontSize: 13 }}>
{qty[p.productId] || 0} {p.pricingType === "per_kg" ? "kg" : "pack(s)"}
</span>
<button style={btnPlus} onClick={() => change(p, 1)}>+</button>
</div>
</div>
</div>
))}
</div>

<div style={{ ...panel, flex: "1 1 300px", maxWidth: 360, position: "sticky", top: 12 }}>
<div style={panelTitle}>Your order</div>
<div style={{ padding: 16 }}>
{lines.length === 0 && <p style={{ marginTop: 0 }}>Nothing added yet.</p>}
{lines.map(l => (
<div key={l.productId}>{https://www.google.com/url?q=http://l.name&source=gmail&ust=1792404012027000&sa=E} x {l.qty}: R{l.total.toFixed(2)}</div>
))}
<h3>Total: R{total.toFixed(2)}</h3>

<label>Delivery date</label>
<input style={field} type="date" min={today} value={deliveryDate}
onChange={e => setDeliveryDate(e.target.value)} />
<textarea style={field} rows={3} placeholder="Notes (optional)" value={notes}
onChange={e => setNotes(e.target.value)} />

{error && <p style={{ color: "crimson" }}>{error}</p>}
<button style={{ ...mainBtn, opacity: placing ? 0.6 : 1 }} disabled={placing} onClick={submit}>
{placing ? "Placing order..." : "Place order"}
</button>
</div>
</div>
</div>
</div>
);
}
}