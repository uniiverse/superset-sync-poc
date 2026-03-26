#!/bin/bash

set -e

DASHBOARDS_PARENT_PATH="${DASHBOARDS_PARENT_PATH:-./}"
DASHBOARDS_FOLDER="${DASHBOARDS_FOLDER:-universe-dashboards}"
ROLES_PATH="${ROLES_PATH:-./universe-tools/universe-roles.json}"

API_USER_EMAIL="${API_USER_EMAIL:-superset-api@universe.com}"
API_USER_PASSWORD="${API_USER_PASSWORD:-password}"

TEST_USER_EMAIL="${TEST_USER_EMAIL:-superset-test@universe.com}"
TEST_USER_PASSWORD="${API_USER_PASSWORD:-password}"

echo "[Starting] Import roles"
superset fab import-roles --path $ROLES_PATH
echo "[Complete] Import roles"

echo "[Starting] Create users"
superset fab create-user \
    --username ApiUser \
    --firstname Api \
    --lastname User \
    --email $API_USER_EMAIL \
    --role ApiRole \
    --password $API_USER_PASSWORD

superset fab create-user \
    --username TestUser \
    --firstname Test \
    --lastname User \
    --email $TEST_USER_EMAIL \
    --role TestRole \
    --password $TEST_USER_PASSWORD
echo "[Complete] Create users"
