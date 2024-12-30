# IMPORTANT

All files containing sensitive information should _never_ be included within a repository.

Files which contain `.secret` as part of the file name will be omitted from the repository when stored in this directory

A mock example of a way these files _could_ be structured is included below:

```
# DATABASE
## ARANGO
DATABASE_ARANGO_PASS = 'MY_PASS_ARANGO'
DATABASE_ARANGO_USER = 'ME_ARANGO'
## MARIA
DATABASE_MARIA_PASS = 'MY_PASS_MARIA'
DATABASE_MARIA_USER = 'ME_MARIA'
```

Saving the previous file as either of the below would ensure it would not be committed to the repository

- env/prod.database.secret
- env/dev.secret.database
