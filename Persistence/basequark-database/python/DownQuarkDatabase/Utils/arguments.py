"""parses arguments from the command line to allow idempotence between the CLI and module implementations"""

import argparse
# import sys

from DownQuarkDatabase.Common.constants import DB_TYPES

parser = argparse.ArgumentParser()


def init_args():
    parser.add_argument(
        "db_type",
        choices=DB_TYPES,
        type=str,
        help="Data Persists to DataBase of this type",
    )
    # Currentlyu this will _always_ be out of scope .. but keeping in case a future implementation use case presents itself
    # parser.add_argument(
    #     "callback_location",
    #     nargs="?",
    #     type=argparse.FileType("w"),
    #     const=sys.stdout,
    #     default=sys.stdout,
    #     help="the cli currently only supports writing the response to the command line",
    # )
    parser.add_argument(
        "-c",
        "--credentials",
        type=str,
        help="Credentials used when connecting to the db-type. Not all values may be required. Expected in the order of: [user, password, host, port]",
        metavar='"admin_user secret_pw 127.0.0.1 1342"',
    )

    subparsers = parser.add_subparsers(
        help="content handling for (non-)?development mode"
    )
    non_development_mode = subparsers.add_parser(
        "query",
        help="defines queries to run on db_type",
        description='Example Usage: `% __main__.py MARIA -c "bobby paswurd loqalhost 1313" mock -p "{cool value: bro}"`',
    )
    development_mode = subparsers.add_parser(
        "mock",
        help="specifies mock process data for development.",
        description='Example Usage: `% __main__.py MARIA -c "bobby paswurd loqalhost 1313" mock -p "{cool value: bro}"`',
    )

    # non_development_mode
    non_development_mode.add_argument(
        "-f",
        "--file",
        type=argparse.FileType("r"),
        # default=sys.stdin,
        help="optional file to use for source of db-type queries",
    )

    non_development_mode.add_argument(
        "query_strings",
        action="extend",
        nargs="+",
        type=str,
        help="space separated list of strings to be queried by db-type. They will run sequentially",
        metavar='"SELECT * FROM ....", "INSERT INTO ...."',
    )
    non_development_mode.add_argument(
        "-D", "--Dev", action="store_true", help=argparse.SUPPRESS
    )  # prevent non-dev from seeing this via help menu

    # development_mode
    development_mode.add_argument(
        "--Dev", action="store_const", const=True, default=True, help=argparse.SUPPRESS
    )
    development_mode.add_argument(
        "-p",
        "--process",
        type=str,
        help="A mock implementation of what would be returned after all queries and processing had completed. No database call or connection will actually occur. Only available in development mode",
        metavar='{ "query_response" : "mock_data" : {} }',
    )
    parser.print_help()
    non_development_mode.print_help()
    development_mode.print_help()
    #
    parser.print_usage()
    non_development_mode.print_usage()
    development_mode.print_usage()

    args = parser.parse_args()

    # for arg in args:
    print("->", args)
    return args


# https://docs.python.org/3/library/argparse.html
# https://docs.python.org/3/howto/argparse.html#argparse-tutorial
