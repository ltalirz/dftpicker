#!/bin/bash
set -euo pipefail

# 1. Download raw.json from materialscloud-org/acwf-verification at latest commit
curl -L https://raw.githubusercontent.com/materialscloud-org/acwf-verification/8433049076bdd6afa0b977dfe197b32fe024ce92/src/data/data.json -o src/data/raw.json

# 2. Download codes.json from ltalirz/atomistic-software at latest commit
curl -L https://raw.githubusercontent.com/ltalirz/atomistic-software/6d75151c3126c8c818c3c96a66f9e3b24093a339/src/data/codes.json -o src/data/codes.json

