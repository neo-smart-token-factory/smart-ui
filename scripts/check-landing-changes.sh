#!/bin/bash

# Script para verificar se a Landing Page precisa de rebuild
# Exit 1 = build SHOULD run (mudanças detectadas)
# Exit 0 = skip build (sem mudanças relevantes)

# Lista de arquivos/pastas que disparam rebuild da Landing
LANDING_PATHS=(
  "landing/"
)

# Verifica se algum arquivo da Landing foi modificado
for path in "${LANDING_PATHS[@]}"; do
  if git diff --name-only HEAD~1 HEAD | grep -q "^$path"; then
    echo "✅ Landing changes detected in '$path' - proceeding with build"
    exit 1  # Exit 1 = build SHOULD run
  fi
done

# Se não há mudanças na landing/, pula o build
echo "❌ No landing changes detected - skipping landing build"
exit 0  # Exit 0 = skip build
