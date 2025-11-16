import React from "react";

export default function App() {
  const launch = () => {
    window.location.href = "https://neo-smart-factory.app/"; // futuramente seu Nuxt PWA
  };

  return (
    <div className="w-full min-h-screen bg-night text-zincsoft">
      
      {/* HERO */}
      <section className="h-screen flex flex-col justify-center px-10">
        <h1 className="text-6xl font-bold tracking-tighter">
          NΞØ<br />SMART FACTORY
        </h1>

        <p className="mt-6 max-w-2xl text-xl opacity-80">
          A fábrica descentralizada que transforma intenção em protocolo.
          Crie tokens, contratos, dApps e economias em minutos.
        </p>

        <button
          onClick={launch}
          className="mt-10 px-10 py-4 bg-neo text-night font-bold text-lg rounded-lg hover:opacity-80 transition"
        >
          LAUNCH APP
        </button>
      </section>

      {/* FEATURES */}
      <section className="px-10 py-32 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            title: "Token Builder",
            desc: "Gere tokens completos com preço fixo, supply e manifesto."
          },
          {
            title: "Contract Factory",
            desc: "Templates auditados, seguros, e preparados para Polygon."
          },
          {
            title: "Rituais e Ecosistemas",
            desc: "Simule, valide e publique economias inteiras."
          }
        ].map((b, i) => (
          <div key={i} className="p-6 border border-zinc-800 rounded-xl">
            <h2 className="text-2xl font-bold">{b.title}</h2>
            <p className="mt-2 opacity-70">{b.desc}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="px-10 pb-10 opacity-40">
        <p>NΞØ Protocol — PATCH v0.5.1 IGNIÇÃO</p>
      </footer>

    </div>
  );
}

