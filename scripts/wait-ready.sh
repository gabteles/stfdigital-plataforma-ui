#!/usr/bin/env bash
set -e

./shared/scripts/wait-up.sh "https://$1:8443" 600