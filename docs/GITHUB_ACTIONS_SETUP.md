# Configuração do GitHub Actions — NΞØ Smart Mint Protocol

O workflow de **Health Check** funciona sem configuração adicional, mas para habilitar a verificação completa do ecossistema (incluindo o repositório `neo-smart-factory`), você pode opcionalmente configurar um token de acesso.

## 1. Gerar o Personal Access Token (PAT) (Opcional)

Este token permite que o GitHub Actions do `smart-ui` "enxergue" o repositório `neo-smart-factory` para verificações completas do ecossistema. **Se não configurado, o workflow ainda funcionará, mas sem acesso ao repositório neo-smart-factory.**

1. Acesse seu GitHub e vá em: **Settings** (do perfil) > **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
2. Clique em **Generate new token (classic)**.
3. **Note**: Nomeie como `NEO_ECOSYSTEM_ACTION_TOKEN`.
4. **Expiration**: Escolha uma data de expiração ou "No expiration" (conforme sua política de segurança).
5. **Scopes**: Selecione apenas o escopo **`repo`** (Full control of private repositories).
6. Clique em **Generate token**.
7. **IMPORTANTE**: Copie o token gerado agora. Você não conseguirá vê-lo novamente.

## 2. Configurar o Secret no Repositório `smart-ui`

Agora, adicione esse token como uma variável segura no repositório da interface:

1. Vá para a página do seu repositório **`smart-ui`** no GitHub.
2. Clique na aba **Settings** (do repositório).
3. No menu lateral, vá em **Secrets and variables** > **Actions**.
4. Clique em **New repository secret**.
5. **Name**: `NEO_ECOSYSTEM_TOKEN` (Deve ser exatamente este nome).
6. **Value**: Cole o token que você copiou no passo anterior.
7. Clique em **Add secret**.

## 3. Verificação

Após a configuração (ou sem ela):
- O próximo **Push** ou **Pull Request** disparará automaticamente o workflow `.github/workflows/protocol-health.yml`.
- Você poderá acompanhar o status na aba **Actions** do repositório.
- **Nota**: Se o token `NEO_ECOSYSTEM_TOKEN` não estiver configurado, o checkout do repositório `neo-smart-factory` será ignorado, mas o workflow continuará e será bem-sucedido.

---

### Diagnóstico Local
Para testar a saúde do ecossistema na sua máquina local antes de enviar para o GitHub, utilize:

```bash
make health
```

Isso verificará se os repositórios `smart-core` e `smart-cli` estão corretamente vinculados nos diretórios vizinhos.
