import { useEffect, useState } from "react";
import { getProducts, placeOrder } from "./api";

const card = { border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 10 };
const btn = { width: 36, height: 36, fontSize: 18, borderRadius: 8, border: "1px solid #999", background: "#fff" };
const field = { display: "block", width: "100%", padding: 10, marginBottom: 10, boxSizing: "border-box" };

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
        <h1>Order placed</h1>
        <p>Thank you. Chester Butchery has received your order.</p>
        <h3>Total: R{Number(done.total).toFixed(2)}</h3>
        <button style={{ padding: 12, width: "100%" }} onClick={() => setDone(null)}>
          Place another order
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
      <h1>Chester Butchery</h1>

      {products.filter(p => p.available !== false).map(p => (
        <div key={p.productId} style={card}>
          <strong>{p.name}</strong>
          <div>
            R{p.price} {p.pricingType === "per_kg" ? "per kg" : `per ${p.packSize} pack`}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            <button style={btn} onClick={() => change(p, -1)}>-</button>
            <span>
              {qty[p.productId] || 0} {p.pricingType === "per_kg" ? "kg" : "pack(s)"}
            </span>
            <button style={btn} onClick={() => change(p, 1)}>+</button>
          </div>
        </div>
      ))}

      <h2>Your order</h2>
      {lines.length === 0 && <p>Nothing added yet.</p>}
      {lines.map(l => (
        <div key={l.productId}>{l.name} x {l.qty}: R{l.total.toFixed(2)}</div>
      ))}
      <h3>Total: R{total.toFixed(2)}</h3>

      <label>Delivery date</label>
      <input style={field} type="date" min={today} value={deliveryDate}
        onChange={e => setDeliveryDate(e.target.value)} />
      <textarea style={field} rows={3} placeholder="Notes (optional)" value={notes}
        onChange={e => setNotes(e.target.value)} />

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <button style={{ padding: 12, width: "100%" }} disabled={placing} onClick={submit}>
        {placing ? "Placing order..." : "Place order"}
      </button>
    </div>
  );
}
