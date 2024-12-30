"""Currently a _very_ lightweight wrapper. As it is implemented in future contexts there will be updates to make it act more like a customized ORM"""


class DatabaseCatalog:
    """catalog of multiple static methods that are executed depending on an init parameter"""

    # def activate: # move activation calls here
    # def develop: # allows local/testing implementation that does not require an active database
    # -- optional mock data can be passed as an argument which will be returned exactly as the database query result would be from the `process` method
    # def query: # applies the query string to the desired database and returns the results to the `process` function
    # -- should probably be chainable: `query("INSERT INTO...").query("SELECT * FROM...").process()`
    # ---- https://github.com/faif/python-patterns/blob/master/patterns/behavioral/chaining_method.py <- would need to be implemented in each `Databases/*`
    # def process: # will format the output from the query, then run the callback function (if exists) passing the formatted result(s) as `*args`

    # REMEMBER: any sort of customized logic is out of scope for this implementation
    # -- `query("INSERT INTO...").MUTATING_RESULTS_IS_OUT_OF_SCOPE().query("SELECT * FROM...").process()
    # ---- any number of queries with any type of result values can be chained, but this implementation runs them all in isolation.
    # ---- this results in:
    # ------ _only_ the value of the **final** query being passed to`process`
    # ------ _no_ query will have any knowledge of the result from the previous query
    # -- `process(); ANYTHING_ELSE_AFTERWARDS_IS_OUT_OF_SCOPE()
    # ---- `process` executes a single callback function (if exists) - and that is it.
    # ---- Any additional pipeline logic related to CQRS/event-sourcing/aggregations/etc (iterations, pub/sub, queue) is handled downstream and would require a new instance of this persistence module.
