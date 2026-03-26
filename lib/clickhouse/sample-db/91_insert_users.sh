set -e

# Early out if unset.
if [ $SAMPLE_DB_SCALE == 0 ]
then
  exit 0
fi

clickhouse client --database=highlander -n <<-EOSQL
SET max_insert_threads=32;
SET max_memory_usage=2147483648;

INSERT INTO users
SELECT
    concat('us_', toString(number)) AS id,
    toInt64(number) AS ch_id,
    NULL AS do_not_sell,
    NULL AS deleted
FROM
    numbers(100)
EOSQL
