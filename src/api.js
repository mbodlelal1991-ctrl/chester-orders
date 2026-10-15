import { getToken } from "./auth";

const API = import.meta.env.VITE_API_URL;

async function call(path, options = {}) {
  const res = await fetch(`${API}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

async function authHeaders() {
  const token = await getToken();
  if (!token) throw new Error("Please log in again");
  return { "Content-Type": "application/json", Authorization: token };
}

export function getProducts() {
  return call("/products");
}

export async function placeOrder(order) {
  return call("/orders", {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(order),
  });
}

export async function getOrders(status = "new") {
  return call(`/orders?status=${encodeURIComponent(status)}`, {
    headers: await authHeaders(),
  });
}

export async function updateOrder(customerId, orderId, status) {
  return call("/orders", {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify({ customerId, orderId, status }),
  });
}
