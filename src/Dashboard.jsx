import { useEffect, useState } from "react";
import { getOrders, updateOrder } from "./api";

const NAVY = "#10206b";
const BLUE = "#1f2a7c";
const RED = "#d62828";

const box = {
  background: "#fff",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  color: NAVY,
  marginBottom: 14,
  textAlign: "left",
};
const boxHead = {
  background: BLUE,
  color: "#fff",
  padding: "10px 14px",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: 6,
};
const tab = (active) => ({
  padding: "10px 18px",
  marginRight: 8,
  border: `2px solid ${RED}`,
  borderRadius: 999,
  background: active ? BLUE : "#fff",
  color: active ? "#fff" : BLUE,
  fontWeight: 700,
  cursor: "pointer",
});
const linkBtn = {
  display: "inline-block",
  padding: "10px 16px",
  background: BLUE,
  color: "#fff",
  border: `2px solid ${RED}`,
  borderRadius: 999,
  fontWeight: 800,
  textDecoration: "none",
};
const mainBtn = {
  padding: 12,
  width: "100%",
  background: BLUE,
  color: "#fff",
  border: `2px solid ${RED}`,
  borderRadius: 999,
  fontWeight: 800,
  cursor: "pointer",
};

const showPhone = (p) => (p && p.startsWith("27") ? "0" + p.slice(2) : p);

const waLink = (o) => {
  const text = `Hi ${o.customerName || "there"}, this is Chester Butchery about your order for ${o.deliveryDate} (total R${Number(o.total).toFixed(2)}).`;
  return `https://wa.me/${o.customerPhone}?text=${encodeURIComponent(text)}`;
};

export default function Dashboard() {
  const [status, setStatus] = useState("new");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setOrders(await getOrders(status));
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [status]);

  const move = async (o) => {
    const next = o.status === "new" ? "done" : "new";
    setBusyId(o.orderId);
    setError("");
    try {
      await updateOrder(o.customerId, o.orderId, next);
      setOrders(list => list.filter(x => x.orderId !== o.orderId));
    } catch (e) {
      setError(e.message);
    }
    setBusyId("");
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
      <h1 style={{ color: NAVY }}>Orders</h1>
      <div style={{ marginBottom: 14 }}>
        <button style={tab(status === "new")} onClick={() => setStatus("new")}>New</button>
        <button style={tab(status === "done")} onClick={() => setStatus("done")}>Done</button>
        <button style={tab(false)} onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No {status} orders.</p>}

      {orders.map(o => (
        <div key={o.orderId} style={box}>
          <div style={boxHead}>
            <strong>{o.customerName || "(no name)"}</strong>
            <span style={{ fontSize: 13 }}>{o.customerEmail}</span>
          </div>
          <div style={{ padding: 14 }}>
            <div>Placed: {new Date(o.createdAt).toLocaleString()}</div>
            <div>Delivery: <strong>{o.deliveryDate}</strong></div>

            {o.customerPhone ? (
              <div style={{ margin: "10px 0" }}>
                <div>Phone: <strong>{showPhone(o.customerPhone)}</strong></div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                  <a style={linkBtn} href={waLink(o)} target="_blank" rel="noreferrer">WhatsApp</a>
                  <a style={linkBtn} href={`tel:+${o.customerPhone}`}>Call</a>
                </div>
              </div>
            ) : (
              <div style={{ margin: "10px 0", opacity: 0.7 }}>No phone number (older order)</div>
            )}

            <ul>
              {o.items.map(i => (
                <li key={i.productId}>
                  {i.name}: {i.quantity} {i.pricingType === "per_kg" ? "kg" : "pack(s)"} @ R{i.priceAtOrder}
                </li>
              ))}
            </ul>
            {o.notes && <div>Notes: {o.notes}</div>}
            <h3>Total: R{Number(o.total).toFixed(2)}</h3>
            <button
              style={mainBtn}
              disabled={busyId === o.orderId}
              onClick={() => move(o)}
            >
              {busyId === o.orderId
                ? "Saving..."
                : o.status === "new" ? "Mark as done" : "Move back to new"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}