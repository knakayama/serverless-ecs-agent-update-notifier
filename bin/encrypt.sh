#!/usr/bin/env bash

key_id="$1"
plain_text="$2"

aws kms encrypt \
  --key-id "$key_id" \
  --plaintext "$plain_text"
