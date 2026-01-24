# 🎯 Integração de Marketing no Frontend - Resumo

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** API  
**Audiência:** Desenvolvedores

> ✅ **Integrado e Funcional**

---

## 📋 O Que Foi Implementado

### 1. **Session ID Management**

- Geração automática de `session_id` no primeiro load
- Armazenado em `localStorage` como `neosmart_session_id`
- Persiste entre recarregamentos da página

### 2. **Lead Creation (Primeira Visita)**

- Cria lead automaticamente quando usuário visita a página
- Captura: `user_agent`, `referrer`, UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`)
- Status inicial: `visitor`
- Registra evento `page_view`

### 3. **Event Tracking**
Eventos registrados automaticamente:

| Evento | Quando | Dados Coletados |
|--------|--------|-----------------|
| `page_view` | Primeira visita | page, timestamp |
| `cta_click` | Clica em "Open Smart Mint" | cta name |
| `form_start` | Entra no step 2 (formulário) | - |
| `form_step_1`, `form_step_2`, etc. | Progresso no form | step, fields_filled |
| `wallet_connect` | Conecta wallet | provider |
| `form_abandon` | Fecha página/abandona | step_reached, time_spent |
| `token_created` | Cria token | contract_address, network, tx_hash |

### 4. **Session Tracking**

- Cria/atualiza sessão ao preencher formulário
- Salva `form_data_snapshot` (o que usuário preencheu)
- Rastreia `step_reached` (qual step alcançou)
- `conversion_funnel` com timestamps de cada step

### 5. **Lead Status Updates**

Status atualizado automaticamente:

```
visitor → engaged → wallet_connected → draft_started → token_created
```

### 6. **Abandonment Detection**
- Detecta quando usuário fecha a página (`beforeunload`)
- Usa `navigator.sendBeacon` para garantir envio
- Marca sessão como `abandoned_at`
- Registra evento `form_abandon`

### 7. **Draft Integration**
- Linka `drafts` com `lead_id` e `session_id`
- Permite recuperação de rascunho mesmo sem wallet

### 8. **Deploy Integration**
- Linka `deploys` com `lead_id` e `session_id`
- Permite análise de conversão completa

---

## 🔄 Fluxo Completo Integrado

```
1. Usuário visita página
   → Cria lead (status: 'visitor')
   → Registra evento 'page_view'

2. Usuário clica "Open Smart Mint"
   → Registra evento 'cta_click'
   → Atualiza lead (status: 'engaged')
   → Cria sessão

3. Usuário entra no formulário (step 2)
   → Registra evento 'form_start'
   → Atualiza sessão (step_reached: 1)

4. Usuário preenche form (auto-save a cada 2s)
   → Atualiza sessão com form_data_snapshot
   → Registra eventos 'form_step_2', 'form_step_3', etc.
   → Atualiza step_reached

5. Usuário conecta wallet
   → Atualiza lead (wallet_address, status: 'wallet_connected')
   → Registra evento 'wallet_connect'

6. Usuário cria token
   → Registra em deploys (com lead_id e session_id)
   → Atualiza lead (status: 'token_created')
   → Marca sessão como completed_at
   → Registra evento 'token_created'

7. Se usuário abandona
   → beforeunload detecta
   → Marca sessão como abandoned_at
   → Registra evento 'form_abandon'
   → Lead disponível para recuperação!
```

---

## 📊 Dados Coletados

### Lead (Criado na primeira visita)
- `session_id` (único por navegador)
- `email` (opcional, se fornecer)
- `wallet_address` (quando conectar)
- `user_agent`, `referrer`
- `utm_source`, `utm_medium`, `utm_campaign`
- `conversion_status` (visitor → token_created)

### Session (Criada ao entrar no form)
- `step_reached` (1-4)
- `form_data_snapshot` (tudo que preencheu)
- `conversion_funnel` (timestamps de cada step)
- `abandoned_at` ou `completed_at`

### Events (Registrados automaticamente)
- Tipo de evento
- Dados específicos (JSONB)
- Timestamp

---

## 🎯 Benefícios para Marketing

### 1. **Prospecção Completa**
- ✅ Captura TODOS os visitantes (não só com wallet)
- ✅ Email para follow-up (se fornecer)
- ✅ Tracking de origem (UTM)

### 2. **Recuperação de Usuários**
- ✅ Identifica quem abandonou
- ✅ Sabe onde parou (qual step)
- ✅ Tem dados do que preencheu
- ✅ Pode enviar email personalizado

### 3. **Analytics Detalhado**
- ✅ Funnel completo de conversão
- ✅ Identifica gargalos
- ✅ Mede eficácia de campanhas

### 4. **Segmentação**
- ✅ Por origem (UTM)
- ✅ Por comportamento (onde abandonou)
- ✅ Por tempo (abandonou há X horas)
- ✅ Por dados preenchidos

---

## 🧪 Como Testar

### 1. Testar Localmente (com vercel dev)

```bash
make dev-vercel
```

Acesse: `http://localhost:3000`

**Verificar no console do navegador:**
- Session ID criado
- Lead criado
- Eventos registrados

**Verificar no banco (Neon Console):**
```sql
-- Ver leads criados
SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;

-- Ver eventos
SELECT * FROM conversion_events ORDER BY occurred_at DESC LIMIT 10;

-- Ver sessões
SELECT * FROM user_sessions ORDER BY created_at DESC LIMIT 5;
```

### 2. Testar Abandono

1. Abra a página
2. Clique em "Open Smart Mint"
3. Preencha alguns campos
4. Feche a página (sem criar token)

**Verificar:**
```sql
-- Ver leads abandonados
SELECT * FROM abandoned_leads LIMIT 5;
```

### 3. Testar Conversão Completa

1. Abra a página
2. Clique em "Open Smart Mint"
3. Conecte wallet
4. Preencha form
5. Crie token

**Verificar:**
```sql
-- Ver funnel
SELECT * FROM conversion_funnel;

-- Ver lead convertido
SELECT * FROM leads WHERE conversion_status = 'token_created';
```

---

## 📡 APIs Utilizadas

| API | Uso |
|-----|-----|
| `POST /api/leads` | Criar/atualizar lead |
| `POST /api/events` | Registrar eventos |
| `POST /api/sessions` | Criar/atualizar sessão |
| `POST /api/drafts` | Salvar draft (linkado com lead) |
| `POST /api/deploys` | Registrar deploy (linkado com lead) |

---

## ✅ Checklist de Funcionalidades

- [x] Session ID gerado automaticamente
- [x] Lead criado na primeira visita
- [x] Eventos registrados (page_view, cta_click, form_start, etc.)
- [x] Sessão criada ao entrar no form
- [x] Form snapshot salvo (auto-save)
- [x] Lead atualizado ao conectar wallet
- [x] Abandono detectado (beforeunload)
- [x] Status atualizado ao criar token
- [x] Drafts linkados com lead_id
- [x] Deploys linkados com lead_id

---

## 🚀 Próximos Passos (Opcional)

1. **Captura de Email:**
   - Adicionar formulário opcional para email
   - Salvar em `leads.email`
   - Criar registro em `email_subscriptions`

2. **Recuperação Automática:**
   - Quando usuário volta com mesmo session_id
   - Carregar dados do que preencheu
   - Mostrar mensagem: "Continue de onde parou?"

3. **Analytics Dashboard:**
   - Criar página admin para ver analytics
   - Usar `/api/analytics?type=funnel`
   - Mostrar gráficos de conversão

---

**Status:** ✅ **Integração Completa e Funcional!**

Todas as APIs de marketing estão integradas no frontend e funcionando automaticamente. 🎉
