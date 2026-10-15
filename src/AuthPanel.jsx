import { useState } from "react";
import { signUp, confirmSignUp, signIn } from "./auth";

const input = { display: "block", width: "100%", padding: 10, marginBottom: 10, boxSizing: "border-box" };
const main = { padding: 12, width: "100%", marginBottom: 8 };

export default function AuthPanel({ onLoggedIn }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (fn) => {
    setBusy(true);
    setMsg("");
    try { await fn(); } catch (e) { setMsg(e.message || "Something went wrong"); }
    setBusy(false);
  };

  const doLogin = () => run(async () => { await signIn(email, password); onLoggedIn(); });
  const doRegister = () => run(async () => {
    if (!name.trim()) throw new Error("Please enter your business name");
    await signUp(email, password, name.trim());
    setMode("confirm");
    setMsg("We emailed you a code. Enter it below.");
  });
  const doConfirm = () => run(async () => {
    await confirmSignUp(email, code);
    await signIn(email, password);
    onLoggedIn();
  });

  return (
    <div style={{ maxWidth: 380, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
      <h1>Chester Butchery</h1>
      <h3>{mode === "login" ? "Log in" : mode === "register" ? "Register your business" : "Confirm your email"}</h3>

      {mode === "register" && (
        <input style={input} placeholder="Business name" value={name}
          onChange={(e) => setName(e.target.value)} />
      )}

      <input style={input} type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} />

      {mode !== "confirm" && (
        <input style={input} type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} />
      )}
      {mode === "confirm" && (
        <input style={input} placeholder="6-digit code" value={code}
          onChange={(e) => setCode(e.target.value)} />
      )}

      {msg && <p style={{ color: "crimson" }}>{msg}</p>}

      {mode === "login" && (
        <>
          <button style={main} disabled={busy} onClick={doLogin}>Log in</button>
          <button style={main} onClick={() => setMode("register")}>Create account</button>
        </>
      )}
      {mode === "register" && (
        <>
          <p style={{ fontSize: 13 }}>Password: at least 8 characters, with upper and lower case, a number and a symbol.</p>
          <button style={main} disabled={busy} onClick={doRegister}>Register</button>
          <button style={main} onClick={() => setMode("login")}>Back to log in</button>
        </>
      )}
      {mode === "confirm" && (
        <button style={main} disabled={busy} onClick={doConfirm}>Confirm and log in</button>
      )}
    </div>
  );
}
