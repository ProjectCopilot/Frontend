#!/bin/bash
set -eo pipefail

BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CONFIG=$BASEDIR/.env

echo "What hostname do you want to run the app on?"
read HOST
echo "What port do you want to run the listener on?"
read PORT
echo "What is the mailroom's hostname?"
read MAILROOM_HOSTNAME
echo "What is the mailroom's port?"
read MAILROOM_PORT

cat <<EOF > $CONFIG
HOSTNAME=$HOST
PORT=$PORT
MAILROOM_HOSTNAME=$MAILROOM_HOSTNAME
MAILROOM_PORT=$MAILROOM_PORT
EOF
