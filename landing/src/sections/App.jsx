import React from "react";

export default function App() {
  const launch = () => {
    window.location.href = "http://localhost:3000/"; // Nuxt PWA (dev)
    // window.location.href = "https://neosmartfactory.onchain/"; // Production
  };

  return (
    <div className="w-full min-h-screen bg-bg-default text-text-primary">
      
      {/* HERO */}
      <section className="h-screen flex flex-col justify-center px-6 md:px-12">
        <h1 className="text-6xl md:text-7xl font-headline font-extrabold leading-[0.95] tracking-tight uppercase">
          NΞØ<br />SMART FACTORY
        </h1>

        <p className="mt-6 max-w-2xl text-lg md:text-xl text-text-secondary">
          A fábrica descentralizada que transforma intenção em protocolo.
          Crie tokens, contratos, dApps e economias em minutos.
        </p>

        <button
          onClick={launch}
          className="ns-button mt-10"
        >
          LAUNCH APP
        </button>
      </section>

      {/* FEATURES */}
      <section className="px-6 md:px-12 py-16 md:py-32 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
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
          <div key={i} className="ns-card ns-card--elevated">
            <h2 className="text-2xl font-headline font-extrabold uppercase tracking-tight">{b.title}</h2>
            <p className="mt-2 text-text-secondary">{b.desc}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-12 pb-10 opacity-40">
        <p className="text-sm font-headline uppercase tracking-tight">NΞØ Protocol — PATCH v0.5.1 IGNIÇÃO</p>
        <p className="mt-2 text-sm">
          <a 
            href="mailto:team@neosmartfactory.onchain" 
            className="text-text-secondary hover:text-text-primary transition-colors duration-fast underline"
          >
            team@neosmartfactory.onchain
          </a>
        </p>
      </footer>

    </div>
  );
}

