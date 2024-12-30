"""
stores configuration information in easily accessible scopes and methods
> this implementation may change as actual integrations are created
"""

import copy

from .constants import DB_TYPES, DB_CREDENTIAL_KEYS

[KEY_DB_USER, KEY_DB_PASSWORD, KEY_DB_HOST, KEY_DB_PORT] = DB_CREDENTIAL_KEYS
[INDX_DB_USER, INDX_DB_PASSWORD, INDX_DB_HOST, INDX_DB_PORT] = list(
    map(
        lambda credKey: DB_CREDENTIAL_KEYS.index(credKey),
        [KEY_DB_USER, KEY_DB_PASSWORD, KEY_DB_HOST, KEY_DB_PORT],
    )
)
[KEY_ARANGO, KEY_MARIA, KEY_POSTGRES] = DB_TYPES
CREDENTIALS_ARANGO = ("root", "root", "localhost", "8529")
CREDENTIALS_MARIA = ("username", "root", "localhost", "3666")
CREDENTIALS_POSTGRES = ("postgres", "root", "localhost", "5432")
DB_CONF_DEFAULT_VALUES = {
    "CREDENTIALS": {
        KEY_ARANGO: CREDENTIALS_ARANGO,
        KEY_MARIA: CREDENTIALS_MARIA,
        KEY_POSTGRES: CREDENTIALS_POSTGRES,
    }
}
DB_CONF = copy.deepcopy(DB_CONF_DEFAULT_VALUES)


class DownQuarkDatabaseConfiguration:
    @staticmethod
    def clear():
        DB_CONF["CREDENTIALS"] = {}

    @staticmethod
    def develop():  # `PUT`
        DB_CONF["CREDENTIALS"] = copy.deepcopy(DB_CONF_DEFAULT_VALUES["CREDENTIALS"])

    @staticmethod
    def update(key_arr, val):  # `PATCH`
        """
        This may need a refactor depending on how the data is being set (.env/directly from code/etc
        Will most likely be updated as we determine use cases within upcoming projects
        """
        k = ""
        update_obj = DB_CONF["CREDENTIALS"]
        for k in key_arr:
            update_obj = update_obj[k] if k in update_obj else {k: None}
        update_obj = val
        DB_CONF["CREDENTIALS"][k] = update_obj
