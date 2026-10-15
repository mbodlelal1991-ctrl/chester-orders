import { useEffect, useState } from "react";
import { getOrders, updateOrder } from "./api";

const box = { border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 12 };
const tab = (active) => ({
  padding: "10px 16px",
  marginRight: 8,
  border: "1px solid #999",
  borderRadius: 8,
  background: active ? "#222" : "#fff",
  color: active ? "#fff" : "#222",
});

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
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
      <h1>Orders</h1>
      <div style={{ marginBottom: 12 }}>
        <button style={tab(status === "new")} onClick={() => setStatus("new")}>New</button>
        <button style={tab(status === "done")} onClick={() => setStatus("done")}>Done</button>
        <button style={{ padding: 10 }} onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No {status} orders.</p>}

      {orders.map(o => (
        <div key={o.orderId} style={box}>
          <strong>{o.customerName || "(no name)"}</strong> &middot; {o.customerEmail}
          <div>Placed: {new Date(o.createdAt).toLocaleString()}</div>
          <div>Delivery: {o.deliveryDate}</div>
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
            style={{ padding: 12, width: "100%" }}
            disabled={busyId === o.orderId}
            onClick={() => move(o)}
          >
            {busyId === o.orderId
              ? "Saving..."
              : o.status === "new" ? "Mark as done" : "Move back to new"}
          </button>
        </div>
      ))}
    </div>
  );
}
