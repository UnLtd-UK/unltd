#!/bin/bash

# Setup script to generate .npmrc from template with environment variable

# Load from .dev.vars if it exists
if [ -f .dev.vars ]; then
  export $(cat .dev.vars | xargs)
fi

if [ -z "$FONTAWESOME_NPM_AUTH_TOKEN" ]; then
  echo "Error: FONTAWESOME_NPM_AUTH_TOKEN not found"
  echo "Please add it to your .dev.vars file or set the environment variable:"
  echo "  export FONTAWESOME_NPM_AUTH_TOKEN='your-token-here'"
  exit 1
fi

# Generate .npmrc from template, substituting environment variables
envsubst < .npmrc.template > .npmrc
echo "✓ .npmrc generated successfully from .npmrc.template with FONTAWESOME_NPM_AUTH_TOKEN"