import { useEffect, useState } from "react";
import { getEmail, getIsOwner, signOut } from "./auth";
import AuthPanel from "./AuthPanel";
import Shop from "./Shop";
import Dashboard from "./Dashboard";

export default function App() {
  const [email, setEmail] = useState(null);
  const [owner, setOwner] = useState(false);
  const [view, setView] = useState("dashboard");
  const [ready, setReady] = useState(false);

  const refresh = async () => {
    setEmail((await getEmail()) || null);
    setOwner(await getIsOwner());
    setReady(true);
  };
  useEffect(() => { refresh(); }, []);

  if (!ready) return <p style={{ padding: 16 }}>Loading...</p>;
  if (!email) return <AuthPanel onLoggedIn={refresh} />;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "8px 16px", background: "#f4f4f4", fontFamily: "sans-serif" }}>
        <span>{email}{owner ? " (owner)" : ""}</span>
        <span>
          {owner && (
            <button style={{ marginRight: 8 }} onClick={() => setView(view === "dashboard" ? "shop" : "dashboard")}>
              {view === "dashboard" ? "View shop" : "View orders"}
            </button>
          )}
          <button onClick={() => { signOut(); setEmail(null); setOwner(false); }}>Log out</button>
        </span>
      </div>
      {owner && view === "dashboard" ? <Dashboard /> : <Shop />}
    </div>
  );
}
