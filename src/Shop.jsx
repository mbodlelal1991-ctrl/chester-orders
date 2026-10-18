import { useEffect, useState } from "react";
import { getProducts, placeOrder } from "./api";

const NAVY = "#1b2a6b";
const RED = "#d62828";

const card = {
background: "#fff",
border: `2px solid ${NAVY}`,
borderRadius: 12,
padding: 12,
boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
};
const panel = {
background: "#fff",
border: `2px solid ${NAVY}`,
borderRadius: 12,
padding: 16,
boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
};
const btn = { width: 36, height: 36, fontSize: 18, borderRadius: 8, border: `1px solid ${NAVY}`, background: NAVY, color: "#fff", cursor: "pointer" };
const field = { display: "block", width: "100%", padding: 10, marginBottom: 10, boxSizing: "border-box", border: "2px solid #c9d1e6", borderRadius: 8 };
const mainBtn = { padding: 12, width: "100%", background: RED, color: "#fff", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" };

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
<h1>Order placed</h1>
<p>Thank you. Chester Butchery has received your order.</p>
<h3>Total: R{Number(done.total).toFixed(2)}</h3>
<button style={mainBtn} onClick={() => setDone(null)}>
Place another order
</button>
</div>
</div>
);
}

return (
<div style={{ maxWidth: 1100, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
<h1>Chester Butchery</h1>

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
<strong>{https://www.google.com/url?q=http://p.name&source=gmail&ust=1792402907852000&sa=E}</strong>
<div>
R{p.price} {p.pricingType === "per_kg" ? "per kg" : `per ${p.packSize} pack`}
</div>
<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 8 }}>
<button style={btn} onClick={() => change(p, -1)}>-</button>
<span>
{qty[p.productId] || 0} {p.pricingType === "per_kg" ? "kg" : "pack(s)"}
</span>
<button style={btn} onClick={() => change(p, 1)}>+</button>
</div>
</div>
))}
</div>

<div style={{ ...panel, flex: "1 1 300px", maxWidth: 360, position: "sticky", top: 12 }}>
<h2 style={{ marginTop: 0 }}>Your order</h2>
{lines.length === 0 && <p>Nothing added yet.</p>}
{lines.map(l => (
<div key={l.productId}>{https://www.google.com/url?q=http://l.name&source=gmail&ust=1792402907852000&sa=E} x {l.qty}: R{l.total.toFixed(2)}</div>
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
);
}