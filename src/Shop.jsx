import { useEffect, useState } from "react";
import { getProducts, placeOrder } from "./api";

// Fill these in. Leave a value as "" to hide that button.
const CONTACT = {
  whatsapp: "", // e.g. "27623299889" (no plus sign, no spaces)
  phone: "",    // e.g. "0623299889"
  email: "",    // e.g. "orders@example.com"
};

const NAVY = "#10206b";
const BLUE = "#1f2a7c";
const RED = "#d62828";
const YELLOW = "#f9b61a";
const ORANGE = "#f5a623";

const card = {
  background: "#fff",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  color: NAVY,
  display: "flex",
  flexDirection: "column",
};
const cardTitle = { background: ORANGE, color: NAVY, fontWeight: 800, padding: "8px 10px", fontSize: 15 };
const cardBody = { padding: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 };
const priceTag = { background: BLUE, color: "#fff", borderRadius: 8, padding: "4px 10px", fontWeight: 700, fontSize: 13 };
const btn = { width: 32, height: 32, fontSize: 18, fontWeight: 700, borderRadius: 999, border: `2px solid ${RED}`, background: BLUE, color: "#fff", cursor: "pointer", padding: 0 };
const panel = {
  background: "#fff",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  color: NAVY,
};
const panelTitle = { background: RED, color: "#fff", fontWeight: 800, letterSpacing: 1, padding: "10px 14px", fontSize: 18, textTransform: "uppercase" };
const field = { display: "block", width: "100%", padding: 10, marginBottom: 10, boxSizing: "border-box", border: "2px solid #c9d1e6", borderRadius: 8, background: "#fff", color: NAVY };
const mainBtn = { padding: 12, width: "100%", background: BLUE, color: "#fff", border: `2px solid ${RED}`, borderRadius: 999, fontSize: 16, fontWeight: 800, cursor: "pointer" };
const linkBtn = { display: "inline-block", padding: "10px 18px", background: BLUE, color: "#fff", border: `2px solid ${RED}`, borderRadius: 999, fontWeight: 800, textDecoration: "none" };

function Contact() {
  if (!CONTACT.whatsapp && !CONTACT.phone && !CONTACT.email) return null;
  const waText = encodeURIComponent("Hi, I have a question about my order.");
  return (
    <div style={{ ...panel, marginTop: 24, textAlign: "center" }}>
      <div style={panelTitle}>Need help? Contact us</div>
      <div style={{ padding: 16, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {CONTACT.whatsapp && (
          <a style={linkBtn} href={`https://wa.me/${CONTACT.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        )}
        {CONTACT.phone && (
          <a style={linkBtn} href={`tel:${CONTACT.phone}`}>
            Call {CONTACT.phone}
          </a>
        )}
        {CONTACT.email && (
          <a style={linkBtn} href={`mailto:${CONTACT.email}`}>
            Email us
          </a>
        )}
      </div>
    </div>
  );
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [qty, setQty] = useState({});
  const [deliveryDate, setDeliveryDate] = useState("");
  const [phone, setPhone] = useState("");
  const [placedPhone, setPlacedPhone] = useState("");
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
    const cleanPhone = phone.replace(/[\s()-]/g, "");
    if (!/^(\+?27|0)\d{9}$/.test(cleanPhone)) {
      return setError("Enter a valid phone number, for example 0623299889.");
    }
    setPlacing(true);
    try {
      const res = await placeOrder({
        deliveryDate,
        notes,
        phone: cleanPhone,
        items: lines.map(l => ({ productId: l.productId, quantity: l.qty })),
      });
      setDone(res);
      setPlacedPhone(cleanPhone);
      setQty({});
      setNotes("");
      setPhone("");
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
            <p>We will contact you on <strong>{placedPhone}</strong> to confirm.</p>
            <h3>Total: R{Number(done.total).toFixed(2)}</h3>
            <button style={mainBtn} onClick={() => setDone(null)}>
              Place another order
            </button>
          </div>
        </div>
        <Contact />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            background: `repeating-conic-gradient(from 0deg at 50% 50%, #263592 0deg 10deg, ${BLUE} 10deg 20deg)`,
            borderRadius: 14,
            padding: "26px 12px",
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ display: "inline-block", border: `5px solid ${RED}`, borderRadius: 999, padding: "6px clamp(20px, 6vw, 44px) 10px" }}>
            <h1 style={{ margin: 0, color: "#fff", fontSize: "clamp(36px, 9vw, 54px)", lineHeight: 1.05, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>
              Chester
            </h1>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.4em", paddingLeft: "0.4em", textTransform: "uppercase" }}>
              Butchery
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-block", background: RED, color: YELLOW, fontWeight: 900, fontSize: 18, letterSpacing: 2, padding: "4px 22px", transform: "skewX(-10deg)", marginTop: 10 }}>
            <span style={{ display: "inline-block", transform: "skewX(10deg)" }}>ORDER ONLINE</span>
          </div>
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
              <div style={cardTitle}>{p.name}</div>
              <div style={cardBody}>
                <span style={priceTag}>
                  R{Number(p.price).toFixed(2)} {p.pricingType === "per_kg" ? "per kg" : `per ${p.packSize} pack`}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button style={btn} onClick={() => change(p, -1)}>-</button>
                  <span style={{ minWidth: 50, fontWeight: 700, fontSize: 13 }}>
                    {qty[p.productId] || 0} {p.pricingType === "per_kg" ? "kg" : "pack(s)"}
                  </span>
                  <button style={btn} onClick={() => change(p, 1)}>+</button>
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
              <div key={l.productId}>{l.name} x {l.qty}: R{l.total.toFixed(2)}</div>
            ))}
            <h3>Total: R{total.toFixed(2)}</h3>

            <label>Delivery date</label>
            <input style={field} type="date" min={today} value={deliveryDate}
              onChange={e => setDeliveryDate(e.target.value)} />

            <label>Your phone / WhatsApp number</label>
            <input style={field} type="tel" placeholder="e.g. 0623299889" value={phone}
              onChange={e => setPhone(e.target.value)} />
            <div style={{ fontSize: 12, marginTop: -6, marginBottom: 10 }}>
              Used only to contact you about this order.
            </div>

            <textarea style={field} rows={3} placeholder="Notes (optional)" value={notes}
              onChange={e => setNotes(e.target.value)} />

            {error && <p style={{ color: "crimson" }}>{error}</p>}
            <button style={{ ...mainBtn, opacity: placing ? 0.6 : 1 }} disabled={placing} onClick={submit}>
              {placing ? "Placing order..." : "Place order"}
            </button>
          </div>
        </div>
      </div>

      <Contact />
    </div>
  );
}