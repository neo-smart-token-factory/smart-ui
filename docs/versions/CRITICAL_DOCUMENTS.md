# 📋 Versionamento de Documentos Críticos

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Política  
**Audiência:** Todos

Este documento rastreia versões de documentos críticos do projeto.

---

## 📌 Documentos Críticos Versionados

### Architecture Decision Records (ADRs)

| ADR | Título | Versão | Data | Status |
|-----|--------|--------|------|--------|
| [0001](../adr/0001-smart-ui-backend-boundary.md) | Smart UI Backend Boundary | 1.0.0 | 2026-01-21 | ✅ Aceito |
| [0002](../adr/0002-ui-as-demo-and-intent-layer.md) | UI as Demo and Intent Layer | 1.0.0 | 2026-01-21 | ✅ Aceito |
| [0003](../adr/0003-wallet-extensions-mpc-automation-posture.md) | Wallet Extensions & MPC Automation | 1.0.0 | 2026-01-21 | ✅ Aceito |
| [0004](../adr/0004-kyc-governance-strategy.md) | KYC & Governance Strategy | 1.0.0 | 2026-01-21 | ✅ Aceito |

### Documentos Arquiteturais

| Documento | Versão | Data | Status | Mudanças Principais |
|-----------|--------|------|--------|---------------------|
| [ui-status.md](../ui-status.md) | 1.0.0 | 2026-01-24 | ✅ Ativo | Status oficial do Smart UI |
| [ARCHITECTURAL_ADDENDUMS.md](../ARCHITECTURAL_ADDENDUMS.md) | 1.0.0 | 2026-01-24 | ✅ Ativo | Adendos arquiteturais fundamentais |
| [REPOSITORY_VISIBILITY_POLICY.md](../REPOSITORY_VISIBILITY_POLICY.md) | 1.0.0 | 2026-01-22 | ✅ Ativo | Política de visibilidade de repositórios |
| [NEO_STRATEGIC_PLAN_V1.md](../NEO_STRATEGIC_PLAN_V1.md) | 1.0.0 | 2026-01-24 | ✅ Ativo | Plano estratégico de arquitetura |

### Documentação de API

| Documento | Versão | Data | Status |
|-----------|--------|------|--------|
| [openapi.yaml](../api/openapi.yaml) | 1.0.0 | 2026-01-24 | ✅ Ativo |
| [API_MARKETING_ROUTES.md](../api/API_MARKETING_ROUTES.md) | 1.0.0 | 2026-01-24 | ✅ Ativo |

---

## 📝 Política de Versionamento

### Quando Versionar

Documentos críticos devem ser versionados quando:
- Há mudanças que afetam decisões arquiteturais
- Há mudanças em políticas ou padrões
- Há mudanças em contratos de API
- Há mudanças que impactam múltiplos sistemas

### Formato de Versão

Seguimos [Semantic Versioning](https://semver.org/):
- **MAJOR** (X.0.0): Mudanças incompatíveis
- **MINOR** (0.X.0): Novas funcionalidades compatíveis
- **PATCH** (0.0.X): Correções e ajustes

### Histórico de Versões

Para documentos com múltiplas versões, manter histórico:

```markdown
## Changelog

### v1.1.0 (2026-XX-XX)
- Adicionada nova seção X
- Atualizada política Y

### v1.0.0 (2026-01-24)
- Versão inicial
```

---

## 🔄 Processo de Atualização

1. **Identificar necessidade de atualização**
2. **Criar nova versão** (se necessário)
3. **Atualizar este documento** com nova versão
4. **Atualizar data** no header do documento
5. **Commit** com mensagem clara sobre mudanças

---

## 📚 Referências

- [Semantic Versioning](https://semver.org/)
- [ADR Template](../adr/)
- [Documentation Standard](../.DOCUMENTATION_STANDARD.md)
