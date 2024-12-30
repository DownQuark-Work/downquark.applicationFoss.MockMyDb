# Overview

## Currently Supported

### Base Languages

1. python
1. rust

### Database Types

1. postgresql
1. mariadb
1. arangodb

### 10'k view

Each _Base Language_ can interact with each _Database Type_.
The interactions will include only the most basic abilities such as:

1. connecting to the Database
1. querying the Database
1. allowing for optional callbacks with any returned data

The code included within this directory is not meant to be much more than an opinionated task library. - And a _very_ light one at that.

# Base Languages

The most simplistic way to see how to implement the languages is to view the code inside each of the nested directories that are applicable to your current implementation's needs.

# Database

## Start Up

> NOTE: this is intentionally ephemeral information.
> _**DO NOT**_ use for real development. Data will be lost if containers are destroyed.

### Dev Container Start Up

> run `% docker compose up` for now.
> containers will be forthcoming
>
> > note: mariadb is accessible on `3666` - allows for that port as well as `3366` to be developed on
> > postgres is available on default `5432`
> > arango is available at: `http://localhost:8529/` or from the _docker terminal_ with `% arangosh`

### Manual Start Up

1. Postgres

```
docker run -p 5432:5432 --name PostgresDq --hostname=c794b66677c8 --mac-address=02:42:ac:11:00:02 --env=POSTGRES_PASSWORD=DownQuarkPostGres --env=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/lib/postgresql/17/bin --env=GOSU_VERSION=1.17 --env=LANG=en_US.utf8 --env=PG_MAJOR=17 --env=PG_VERSION=17.0-1.pgdg120+1 --env=PGDATA=/var/lib/postgresql/data --volume=/var/lib/postgresql/data --network=bridge --restart=no --runtime=runc -d postgres:latest
```

2. MariaDB
   > shutdown with:
   >
   > > `pkill -f mariadb`
   >
   > full options
   >
   > > `mariadbd --verbose --help`

- `/opt/homebrew/bin/mariadbd-safe --datadir=/opt/homebrew/var/mysql --port 3366`

3. ArangoDB

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

1. https://docs.arangodb.com/3.11/graphs/
