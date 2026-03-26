FROM clickhouse/clickhouse-server:22.12.6.22-alpine@sha256:087a732eb6e3efb062a05192e47ee4519c60f4b5b087ea767de4a2a0194208cb

# Enable to generate sample cost items.
ADD sample-db/* /docker-entrypoint-initdb.d/
ADD bootstrap/* /docker-entrypoint-initdb.d/

RUN chmod +x /docker-entrypoint-initdb.d/*.sh
