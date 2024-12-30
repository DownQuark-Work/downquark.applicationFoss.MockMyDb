"""DownQuark Database Utilities"""

from DownQuarkDatabase.Utils import arguments as cli_args
from DownQuarkDatabase.Common import configuration
# from Databases.activate import ActiveDatabases

configDqDb = configuration.DownQuarkDatabaseConfiguration


def required_before_run():
    # currently running it with: `MARIA do query "Query One" "Query Two" "I am frog man!" -D` for development

    # translate CLI args (if exist) to variables for use with module initializing
    cli_conf_values = cli_args.init_args()
    # sanity check to remove any leftover cached values [should never be needed]
    configDqDb.clear()

    print("cli_conf_values", cli_conf_values)
    print("apply cli_conf_values to configuration")
    print("use catalog to verify authentication from configuration")
    print("then you are already in the catalog world, so finish up the query-ing")
    print("that will probably be the easiest part with the groundwork in place.")

    # """Initializes and verifies connections to specified database"""
    # print("all required data has been retrieved, parsed, and handled")
    # print(
    #     "what we were looking for to make the demo: https://github.com/swyxio/uuid-list"
    # )
    # # # configDqDb.develop() # sets back to _all_ databases having localhost connections
    # # # configDqDb.update(['ARANGO'],('bob','dole','a','x')) # sets back to _all_ databases having localhost connections
    #
    # # clearing and adding only what is needed helps for development
    # # TODO: make dynamic when ready
    # configDqDb.clear()
    # # POC: `arango_config_credentials` below results in the same configuration as running: `configDqDb.develop()` (without needing to run the `update` method)
    # arango_config_credentials = configuration.DB_CONF_DEFAULT_VALUES["CREDENTIALS"].get(
    #     "MARIA"
    # )
    # configDqDb.update(["MARIA"], arango_config_credentials)
    #
    # # the `update` usage will vary with different implementations so will most likely need to be
    # #  refactored as we determine use cases with the upcoming projects
    # # the line below proves it working concept
    # # print("update with non test vals", DB_CONF)
    # # pass
    # ActiveDatabases.activate()


if __name__ == "__main__":
    required_before_run()
    print("DB_CONFIG_DEFAULT_VALUES", configuration.DB_CONF)

# https://github.com/faif/python-patterns/blob/master/patterns/behavioral/catalog.py
