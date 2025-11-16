import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    tokenSupply: '',
    tokenPrice: '',
    network: 'polygon',
    purpose: ''
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Gerar preview
    const previewData = {
      ...formData,
      estimatedGas: '2,500,000',
      estimatedCost: '150 USD',
      timestamp: new Date().toISOString()
    };
    
    setPreview(previewData);
    
    // Salvar em localStorage
    localStorage.setItem('neo-token-preview', JSON.stringify(previewData));
  };

  return (
    <div className="container">
      <Head>
        <title>NΞØ SMART FACTORY — Criar Token</title>
        <meta name="description" content="Fábrica descentralizada de protocolos" />
      </Head>

      <main>
        <h1>NΞØ SMART FACTORY</h1>
        <p className="subtitle">A Fábrica Descentralizada de Protocolos do Futuro</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Nome do Token</label>
            <input
              type="text"
              name="tokenName"
              value={formData.tokenName}
              onChange={handleChange}
              required
              placeholder="Ex: Watermellow"
            />
          </div>

          <div className="form-group">
            <label>Símbolo</label>
            <input
              type="text"
              name="tokenSymbol"
              value={formData.tokenSymbol}
              onChange={handleChange}
              required
              maxLength={10}
              placeholder="Ex: WML"
            />
          </div>

          <div className="form-group">
            <label>Supply Total</label>
            <input
              type="number"
              name="tokenSupply"
              value={formData.tokenSupply}
              onChange={handleChange}
              required
              min="1"
              placeholder="Ex: 1000000"
            />
          </div>

          <div className="form-group">
            <label>Preço Fixo (ETH/MATIC)</label>
            <input
              type="number"
              name="tokenPrice"
              value={formData.tokenPrice}
              onChange={handleChange}
              required
              step="0.001"
              min="0"
              placeholder="Ex: 0.05"
            />
          </div>

          <div className="form-group">
            <label>Rede</label>
            <select
              name="network"
              value={formData.network}
              onChange={handleChange}
            >
              <option value="polygon">Polygon</option>
              <option value="amoy">Amoy (Testnet)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Propósito</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows={4}
              placeholder="Descreva o propósito do token..."
            />
          </div>

          <button type="submit" className="btn-primary">
            Gerar Preview
          </button>
        </form>

        {preview && (
          <div className="preview">
            <h2>Preview do Token</h2>
            <pre>{JSON.stringify(preview, null, 2)}</pre>
            <a href={`/preview?data=${encodeURIComponent(JSON.stringify(preview))}`}>
              Ver Preview Completo
            </a>
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-weight: bold;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .btn-primary {
          padding: 1rem;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }
        .preview {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f5f5f5;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

