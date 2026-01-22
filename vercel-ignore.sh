#!/bin/bash
git diff --quiet HEAD^ HEAD . && exit 0 || [ "$(git diff --name-only HEAD^ HEAD | grep -v '^landing/' | grep -v '^nuxt-app/')" ]
