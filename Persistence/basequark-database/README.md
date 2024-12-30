# Database

## Start Up

1. MariaDB
   > shutdown with:
   >
   > > `pkill -f mariadb`
   >
   > full options
   >
   > > `mariadbd --verbose --help`

- `/opt/homebrew/bin/mariadbd-safe --datadir=/opt/homebrew/var/mysql --port 3366`

2. ArangoDB

`docker run -d -p 8529:8529 -e ARANGO_RANDOM_ROOT_PASSWORD=1 --name arangodb-downquark arangodb`

Choosing an authentication method:

The ArangoDB image provides several authentication methods which can be specified via environment variables (`-e`) when using docker run

`ARANGO_RANDOM_ROOT_PASSWORD=1`

- Generate a random root password when starting. The password will be printed to stdout (may be inspected later using docker logs)

`ARANGO_NO_AUTH=1`

- Disable authentication. Useful for testing.
- WARNING Doing so in production will expose all your data. Make sure that ArangoDB is not directly accessible from the internet!

`ARANGO_ROOT_PASSWORD=somepassword`

- Specify your own root password.
- Note: this way of specifying logins only applies to single server installations. With clusters you have to provision the users via the root user with empty password once the system is up.

### Resources

For detailed information see downquark knowledge base:

- [Documentation](https://github.com/DownQuark-Work/downquark.ventureCore.KnowledgeBase/tree/main/src/Persistence/ArangoDB/docs)
- [Tutorials](https://github.com/DownQuark-Work/downquark.ventureCore.KnowledgeBase/tree/main/src/Persistence/ArangoDB/development/_tutorials)

- https://docs.arangodb.com/3.11/aql/
- https://docs.arangodb.com/3.11/get-started/start-using-aql/#learn-the-query-language

- https://university.arangodb.com/
  1. https://university.arangodb.com/courses/getting-started-with-arangodb/
  1. https://university.arangodb.com/courses/graph-course-for-beginners/
  1. https://university.arangodb.com/courses/coming-from-sql/
  1. https://university.arangodb.com/courses/aql-fundamentals/
  1. https://university.arangodb.com/courses/python-driver-tutorial/
