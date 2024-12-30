import mysql.connector
from mysql.connector.abstracts import MySQLConnectionAbstract

cnxn: MySQLConnectionAbstract | None = None
crsr = None

database_connection_cursor = [cnxn, crsr]

# IMPORTANT: There is a known version mismatch with Maria Charset and what Python is currently able to handle:
# https://tecadmin.net/resolved-unknown-collation-utf8mb4_0900_ai_ci/
# make sure to account for this:
#####
# Edit the database backup file in text editor and replace “utf8mb4_0900_ai_ci” with “utf8mb4_general_ci” and “CHARSET=utf8mb4” with “CHARSET=utf8“.
#
# Replace the below string:
# ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
# With:
# ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
# -and here as well
# https://dev.mysql.com/doc/connector-python/en/connector-python-example-connecting.html
###
# or if using docker compose (or the like) just specify a version that works  e.g.: image: mariadb:10.6.19


def create_mysql_connection(pw="root"):
    cntx = mysql.connector.connect(
        host="localhost",
        user="root",
        password=pw,
        port="3666",
    )
    return cntx


def dyn_connect_cursor():
    if database_connection_cursor[0] is None:
        database_connection_cursor[0] = create_mysql_connection()
    if database_connection_cursor[1] is None:
        database_connection_cursor[1] = database_connection_cursor[0].cursor()


def no_print_db():
    """for use when no local db is running"""
    print("running locally without database")
    print("allow option to accept mock data as a prop and retern it as-is")
    print(
        "can then pseudo hit the db - and would probably help with automated testing a lot"
    )


def print_dbs():
    dyn_connect_cursor()
    # database_connection_cursor[1].execute("CREATE DATABASE mydatabase")
    # database_connection_cursor[1].execute("CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))")
    database_connection_cursor[1].execute("SHOW SCHEMAS")
    for db in database_connection_cursor[1]:
        print(db)
