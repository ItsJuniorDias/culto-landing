import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Logo from "../components/Logo";
import Eyebrow from "../components/Eyebrow";
import Button from "../components/Button";
import Field from "../components/Field";
import { Halftone, Rays, Burst } from "../components/Decor";
import { useAuth, DEMO_HINT } from "../context/AuthContext";
import { completeRegistration, identify } from "../lib/pixel";
import { EASE } from "../lib/motion";

export default function Login() {
  const reduce = useReducedMotion();
  const { login, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dest = location.state?.from || "/dashboard";

  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  const submit = (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) signUp({ name, email, password });
      else login({ email, password });
      // Advanced Matching + CompleteRegistration (só no cadastro).
      const [firstName, ...restName] = name.trim().split(/\s+/);
      identify({ email, firstName, lastName: restName.join(" ") });
      if (isSignup) completeRegistration({ status: true });
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const useDemo = () => {
    setMode("login");
    setEmail(DEMO_HINT.email);
    setPassword(DEMO_HINT.password);
    setError("");
  };

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#19181d_0%,#08080A_60%)] px-6 py-16">
      <Halftone />
      <Rays />
      <Burst pos="tl" />
      <Burst pos="br" />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative z-[2] w-full max-w-[440px] border border-line bg-panel/90 p-8 backdrop-blur-sm sm:p-10"
      >
        <Logo to="/" />

        <div className="mt-7">
          <Eyebrow solo>Área de membros</Eyebrow>
          <h1 className="font-display mt-3 text-[40px] font-black leading-[0.92]">
            {isSignup ? "Crie sua conta" : "Entre no Culto"}
          </h1>
        </div>

        {/* mode tabs */}
        <div className="mt-6 grid grid-cols-2 border border-line">
          {[
            ["login", "Entrar"],
            ["signup", "Criar conta"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => switchMode(key)}
              className={`font-util py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                mode === key ? "bg-blood text-bone" : "text-ash hover:text-bone"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          {isSignup && (
            <Field
              label="Nome"
              value={name}
              onChange={setName}
              placeholder="Seu nome"
              autoComplete="name"
              required
            />
          )}
          <Field
            label="E-mail"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="voce@email.com"
            autoComplete="email"
            required
          />
          <Field
            label="Senha"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
          />

          {error && (
            <p className="border border-blood/40 bg-blood/10 px-3 py-2 text-[13px] text-blood-2">
              {error}
            </p>
          )}

          <Button type="submit" full className="mt-1">
            {isSignup ? "Criar conta ↗" : "Entrar ↗"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[13px] text-faint">
          <Link to="/" className="transition-colors hover:text-bone">
            ← Voltar ao site
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
