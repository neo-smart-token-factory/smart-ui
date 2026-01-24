#!/bin/bash

# Script para verificar se o Mobile App precisa de rebuild
# Exit 1 = build SHOULD run (mudanças detectadas)
# Exit 0 = skip build (sem mudanças relevantes)

# Lista de arquivos/pastas que disparam rebuild do Mobile
MOBILE_PATHS=(
  "nuxt-app/"
)

# Verifica se algum arquivo do Mobile foi modificado
for path in "${MOBILE_PATHS[@]}"; do
  if git diff --name-only HEAD~1 HEAD | grep -q "^$path"; then
    echo "✅ Mobile changes detected in '$path' - proceeding with build"
    exit 1  # Exit 1 = build SHOULD run
  fi
done

# Se não há mudanças no nuxt-app/, pula o build
echo "❌ No mobile changes detected - skipping mobile build"
exit 0  # Exit 0 = skip build
