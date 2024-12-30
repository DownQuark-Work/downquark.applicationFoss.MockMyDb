# TODO: dupe template for MockMyDB

> This file is related to that applicaiton only
>
> > would be beneficial to have the Python Persistence utils in place before cloning the template.
>
> remove file form BaseQuark template repo when the above has occured.

## POC

> Virtual TCG

## 10k'

### Postgresql

1. initial round of "cards" are created
2. on generation a JSON object is output
3. the object has values the end user needs to see
   - but also `meta` values that could potentially give players an unfair advantage if they were to crack the algorithm that uses the `metadata` to generate "_children_" cards.
   - internally, the `metadata` must be kept though
     - (obviously all data and content is gibberish for th POC but may as well make some interesting key names)
4. since JSON will be parsed there is an attempt to gain some efficiencies by using `auto-increment`ed primary keys on the database that holds the stores the json object
   - however, every `pk` that is a prime number creates an additional _buff_ on the card associated with it
     - so we need to keep that info away from the user as well

### Arango

1. To create new cards players may "_entwine_" from 2-5 of their cards.
2. _entwining_ does not adjust any values or stats on the cards involved
3. the more cards _entwined_ the stonger the generated card
4. however, the cards that were _entwined_ will be unable to perform that act again until the generated card has a number of descendants equal to amount of cards _entwined_ minus one
   > - e.g. 2 cards _entwined_ ... when the generated card has a single descendant the _entwined_ cards can repeat the action
   > - 5 cards _entwined_ ... the generated card must have 4 descendants before the original cards are available to _entwine_ again.
   > - NOTE: These _do **NOT**_ have to be **direct** descendants
5. _that's_ why we need a graphDB

- good example because the generated card (and their auto-increment `pk`) will have to exist in postgres _before_ the connection can be made in arango

### Maria

> the aggregate

1. The user does not need many details to play the game. Nor should they have access to any that could potentially skew fairness
2. Maria will be a read only aggregate db
3. the cards `pk` will be a `UUID` (or some other generated type)
4. from the generated JSON data only the `atk`, `def`, and `smell` (or whatever) keys will be stored
   - they will be extracted into their own columns (or star schema or whatever we make)
   - all other (meta)data remains secure in the PostGres Db
5. a `boolean` column (or star schema or whatever) will list whether the cards are capable of _entwining_ (no other data is necessary)
6. and maybe just for fun a column that lists how many total "_descendants_" the card's \_entwining_s have been responsible for creating
   - (fancy way of saying count the roots on the family tree)

> will decide on [structure](https://www.geeksforgeeks.org/difference-between-star-schema-and-snowflake-schema/)/etc as we go

---

> reference

- https://www.uuidgenerator.net/
  - https://github.com/mdipierro/ulid
  - https://crates.io/crates/ulid%20%7C%20https://github.com/dylanhart/ulid-rs
  - https://github.com/lukeed/hexoid
