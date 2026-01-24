# Feature Flags Configuration

Este diretório contém a configuração de **Feature Flags** do NΞØ Smart Factory.

## 📋 Estrutura

- `features.js` - Configuração principal de features por fase
- `../hooks/useFeatures.js` - Hook React para usar features nos componentes

## 🚀 Como Usar

### Em Componentes React

```jsx
import useFeatures from '../hooks/useFeatures';

function MyComponent() {
  const { isEnabled, currentPhase, phaseInfo } = useFeatures();
  
  // Verificar se uma feature está habilitada
  if (isEnabled('phase2', 'web3')) {
    return <WalletConnect />;
  }
  
  // Mostrar mensagem de feature bloqueada
  return (
    <div>
      <p>Esta feature estará disponível em {phaseInfo?.estimatedRelease}</p>
    </div>
  );
}
```

### Verificação Direta

```javascript
import { isFeatureEnabled } from './config/features';

if (isFeatureEnabled('phase1', 'dashboard')) {
  // Feature disponível
}
```

## 🔧 Override em Desenvolvimento

Você pode sobrescrever features via variáveis de ambiente (apenas em dev):

```bash
# .env.local
VITE_FEATURE_PHASE2_WEB3=true
```

## 📚 Documentação Completa

Veja `docs/NEXT_STEPS.md` para o roadmap completo e estratégia de lançamento por fases.
