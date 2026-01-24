#!/bin/bash

# Script para verificar se o Dashboard precisa de rebuild
# Exit 1 = build SHOULD run (mudanças detectadas)
# Exit 0 = skip build (sem mudanças relevantes)

# Lista de arquivos/pastas que disparam rebuild do Dashboard
DASHBOARD_PATHS=(
  "src/"
  "public/"
  "api/"
  "lib/"
  "index.html"
  "vite.config.js"
  "tailwind.config.cjs"
  "postcss.config.cjs"
  "tsconfig.json"
  "package.json"
  "eslint.config.js"
  ".vercelignore"
)

# Verifica se algum arquivo do Dashboard foi modificado
for path in "${DASHBOARD_PATHS[@]}"; do
  if git diff --name-only HEAD~1 HEAD | grep -q "^$path"; then
    echo "✅ Dashboard changes detected in '$path' - proceeding with build"
    exit 1  # Exit 1 = build SHOULD run
  fi
done

# Verifica se houve mudanças apenas em landing/ ou nuxt-app/
ONLY_SUBPROJECTS=$(git diff --name-only HEAD~1 HEAD | grep -v "^landing/\|^nuxt-app/\|^docs/\|^\.github/" | wc -l)

if [ "$ONLY_SUBPROJECTS" -eq 0 ]; then
  echo "❌ Only landing/mobile/docs changes - skipping dashboard build"
  exit 0  # Exit 0 = skip build
fi

# Se chegou aqui, há outras mudanças (ex: scripts, Makefile, etc.)
# Por segurança, fazemos rebuild
echo "✅ Other changes detected - proceeding with build"
exit 1
