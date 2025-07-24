"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  // Função para autenticar
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (!data.success) {
        setErro(data.error || "Erro ao fazer login");
        setLoading(false);
        return;
      }
      // Redireciona conforme o tipo
      if (data.user.tipo === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/user-dashboard");
      }
    } catch (err) {
      setErro("Erro interno. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18122B] via-[#393053] to-[#635985]">
      {/* Player iPod */}
      <div className="relative flex flex-col items-center justify-center bg-[#232136] rounded-3xl shadow-2xl p-8 w-[320px] h-[500px]">
        <div className="mb-8">
          <div className="text-xl font-bold text-white">Conexão U N K</div>
          <div className="text-sm text-[#b8b8ff]">Fuderosa Systems</div>
        </div>
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="w-20 h-20 bg-gradient-to-br from-[#a084e8] to-[#8be8e5] rounded-full flex items-center justify-center mb-4">
            <button
              aria-label="Entrar"
              onClick={() => setShowLogin(true)}
              className="w-16 h-16 bg-[#232136] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition"
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path
                  d="M8 5v14l11-7L8 5z"
                  fill="#a084e8"
                />
              </svg>
            </button>
          </div>
          <div className="text-xs text-[#b8b8ff]">Clique no botão para entrar</div>
        </div>
        {/* Controles circulares */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-2 border-[#a084e8] flex flex-col items-center justify-center relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[#b8b8ff] text-xs">MENU</div>
            <div className="flex items-center justify-between w-full px-6 absolute top-1/2 -translate-y-1/2">
              <span className="text-[#b8b8ff] text-xl">&#9664;&#9664;</span>
              <span className="text-[#b8b8ff] text-xl">&#9654;&#9654;</span>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#b8b8ff] text-xs">SELECT</div>
            <button
              aria-label="Entrar"
              onClick={() => setShowLogin(true)}
              className="w-12 h-12 bg-gradient-to-br from-[#a084e8] to-[#8be8e5] rounded-full flex items-center justify-center shadow-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  d="M8 5v14l11-7L8 5z"
                  fill="#232136"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Login */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <form
            onSubmit={handleLogin}
            className="bg-[#232136] rounded-2xl p-8 w-[320px] flex flex-col gap-4 shadow-2xl"
          >
            <div className="text-lg font-bold text-white mb-2">Login</div>
            <input
              type="email"
              placeholder="E-mail"
              className="p-2 rounded bg-[#393053] text-white outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="p-2 rounded bg-[#393053] text-white outline-none"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
            {erro && <div className="text-red-400 text-sm">{erro}</div>}
            <button
              type="submit"
              className="bg-gradient-to-br from-[#a084e8] to-[#8be8e5] text-[#232136] font-bold py-2 rounded mt-2 hover:scale-105 transition"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <button
              type="button"
              className="text-[#b8b8ff] text-xs mt-2 hover:underline"
              onClick={() => setShowLogin(false)}
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
