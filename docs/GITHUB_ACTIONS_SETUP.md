# Configuração do GitHub Actions — NΞØ Smart Mint Protocol

Para que o workflow de **Health Check** funcione corretamente no GitHub, você precisa configurar um token de acesso para permitir a comunicação entre repositórios da NΞØ Ecosystem.

## 1. Gerar o Personal Access Token (PAT)

Este token permite que o GitHub Actions do `smart-ui` "enxergue" o repositório `neo-smart-factory`.

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

Após a configuração:
- O próximo **Push** ou **Pull Request** disparará automaticamente o workflow `.github/workflows/protocol-health.yml`.
- Você poderá acompanhar o status na aba **Actions** do repositório.

---

### Diagnóstico Local
Para testar a saúde do ecossistema na sua máquina local antes de enviar para o GitHub, utilize:

```bash
make health
```

Isso verificará se os repositórios `smart-core` e `smart-cli` estão corretamente vinculados nos diretórios vizinhos.
