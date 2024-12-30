"""DEVELOPMENT STUB FILE: DELETE when no longer needed"""

from DownQuarkDatabase.Common import configuration
from DownQuarkDatabase.Databases.MariaDB import relationaldb


class ActiveDatabases:
    @staticmethod
    def determine_active_dbs():
        print("configuration.DB_CONF", configuration.DB_CONF)
        relationaldb.print_dbs()

    @classmethod
    def activate(cls):
        print("initialize_active_databases")
        # class method for potential future scalability
        cls.determine_active_dbs()
