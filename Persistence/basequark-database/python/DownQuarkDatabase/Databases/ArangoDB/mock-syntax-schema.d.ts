/* syntax notes:
  1. There are (currently) 4 reserved "specialty" keys.
    1. `$_ACCESSOR`
    1. `$_ALIAS`
    1. `$_CURRENT`
    1. `$_ENUM`
    1. `$_NOTE`
    1. `$_ON_MOCK_COMPLETE`

  1. `$_ACCESSOR`
    - can only be used at the top level of the other "specialty" keys
      - specifies _quick\_key_ to reference that object
      - The full name of the "specialty key" (e.g.: `$_ALIAS` and `$_ENUM`) will _always_ work regardless of `$_ACCESSOR` value
  1. `$_ALIAS`
    - can be specified
      - at the top level
      - at any point within a schema object
        - both implementations are shown below
  1. `$_CURRENT`
    - readonly field that allows access to the currently populating set of objects
      - when using this key you must start at the top most level when scoping to the desired value
        - no other "specialty keys" will be recognized when this is being utilized
  1. `$_ENUM`
    - should be a single object specified only at the top level
    - all children key/value of the object inherit this as well
    - in these instances - do not use typings, define the actual values
  1. `$_NOTE`
    - can be specified
      - at the top level
        - the top level `$_NOTE` will be considered the **Project Note** and is where any front matter should be placed
          - not implemented yet, but hopefully in a future version.
      - at any point within a schema object
        - both implementations are shown below
    - cannot be specified
      - in an ``$_ALIAS` object
    - this will not affect output in any way, use it however you see fit.
  1. $_ON_MOCK_COMPLETE
    - this is an object that will be exposed when the mocking has completed for arango.
      - it will be used to transfer any data that should not persist from the current step of the process to the next
        - e.g. - an aggregated list of events that will be a query run by the pub sub system when your application is fully ready.

 2. keys or values inside `<caret_brackets>` contain a dynamic value that will be replaced with mocked content
  - `<int>` Primitives will be replaced with faker/random data, or user specified content if it exists
    - `<fkr:name>` - you can choose Faker fields to populate certain keys with the previous syntax
    - `<fkr:date:past(years=10,refDate='2020-01-01T00:00:00.000Z')>` - selections can be extended using colon separated syntax - with options defined as function args
      - even if`<fkr>` is specified, any user uploaded content will take priority
      - a list of all options can be found [here](https://fakerjs.dev/api/)
 3. There are some special rules here as well
      - `<<int>-_-<string>>` nested carets allow us to aggregate data
        - `13-_-banana` could be a result here
      - `<<int>[+]<int>_<string>+<string>` any native numerical operators (`+`,`-`,'/','*',etc) will be treated as such when wrapped in square brackets. no escape is needed if it is to be treated as a string
        - `32_squirrel+lamp` could be a result here
    - the amount of opening brackets determines the numerical relationship between the objects
      - `<uuid>` [default] many-to-many : references to _both_ values can appear multiple times in each collection/document/etc
      - `<<uuid>` one-to-many : current object can be created multiple times using the same value for the specified key
        - [!NOTE] -by default, the one-to-many will not be applied if being used on a field being aggregated
          - `<<<string> <string>>` use 3 opening brackets if that is the case (still only 2 closing)
      - `<>uuid>` many-to-one : current object can be referenced multple times on the key of the specified object
      - `<-uuid>` one-to-one: both of the above rules may be applied to the current and/or specified object
        - [!NOTE] - for fields utilizing the one-to-one constaint, if there is a difference in the amount of records that exist the source with the fewest items will take precedence and the duplication of the fields will cease as soon as all values from the smaller object has been parsed.
        - [!NOTE] - there is no recursive checking - if you have conflicting rules on the current and specified object they will both be applied with no notification

    - `<~:bridge.path.to.previously.mocked.db>` BRIDGE_EXTERNAL_CONTENT This will ensure the values between the two databases are consistent.
      - <-~:mockmydb_pg.users.id>` the above numerical relations still apply as well - this would apply a one-to-one mapping for bridged values
        - NOTE: the path _must_ exist **AND** have a value or an error will be thrown
      - We can also make _pointers_ to internal objects
        - NOTE: unlike above, the Collection being referenced (below) does not yet have to exist
    - <$:CollectionName[_key]>` REFERENCE_COLLECTION Data current VALUE will set to the value of a random `_key` from the specified collection
      - <$:CollectionName>` if no `[key]` is specified then this basically happens: `(clxn = Object.keys[CollectionName], clxn[Math.floor(Math.random()*clxn.length])` and a random object key is returned as a string
     - <$:CollectionName[]>` returns an iterator of _all_ values of ``_key` on the specified collection
      - `<$:CollectionName[_key].modifications.stats.ATK>` that equivalence allows us to specify nested values
      - `<+$:CollectionName[_key].modifications.stats.ATK>` the above numerical relations still apply as well
      - `<$:CollectionName[_id:13].modifications.stats.ATK>` only look up values for a specific key (the `_id` field at index 13 in this instance)
      - `<$:CollectionName[_id:13].modifications.stats.ATK>`
      - `<$:CollectionName[_key:'13'].modifications.stats.ATK>` same as above except quoted value in the brackets means return the object where the `_id` field's _value_ equals the quoted string
      - `<$:CollectionName[_key:<$:AnotherCollection._key>]>` equivalent to the above - passing in a dynamic value returns the object where the specified key equals the dynamic return value
          - NOTE: the above will check for **both of the following**: `_id === '13'` AND  `_id === 13`
      - `<$:CollectionName[_key:13].modifications.stats.[ATK|HP]>` randomly chooses to copy the value from either `ATK` or `HP`
      - `<$:CollectionName[_key:*].modifications.stats>` loops through _all_ documents in the specified collection, making new entries for each loop that each contain the reference to the nested `stats` object
    - `<^:Field.In.CurrentCollection.Document>` basically a `self` equivalent.
      - For instance, when aggregating data:
        - `{full_name:<<^:first_name> <^:last_name>>}`
        - `{year_bill:<<^:semester>+<^:second_semester>>}]`
      - When `<^:self>` is not specified the current object's values will not be used
        - `{entwinements: [<$:Entwinements[_from:<^:_id>]>]}` - will return Entwinements object of currently populating TradingCard
        - `{entwinements: [<$:Entwinements[_from:<$:TradingCard:[_id]{1,5}>]>]}` - will return Entwinements object of random TradingCards where the currently populating value will never be chosen
          - one final shorthand exists (as seen below) to allow aggregation to be applied on an object with unknown lengths
          - `{avg_test_score:<<students[tests:*][+].result>[/]<students[tests:*][+]>>
            - this:
                1. `<<` Aggregate this value:
                2. `[tests:*]` loops through all tests
                3. `[+]` and recursively SUMS the VALUE of the specified key to itself
                4. `[/]`which it then divides by
                5. [tests:*] the result of looping through the tests
                6. `[+]` and recursively SUMS the AMOUNT of KEYS returned
                7. `>>` since there no other value being associated
                8. (and return the result - which is the average score of the tests taken)
    - For any of the square bracket implementations above, we can enforce a range on what is returned by using syntax similar to regex curly bracket syntax
      - `<$:CollectionName[{2}]>` - returns 2 random collection values of `_key`
      - `<$:CollectionName[_key:{0,5}]>` - May return an empty array, if not, there will be no more than 5 randomly selected objects `_key` objects inside
      - `<~:mockmydb_pg[users:42{1,3}].user_name>` - will return the `user_name` of the 42nd row of the external database anywhere from 1 to 3 times
---
 Practical Example:
 The following is being used in the current demo:
 - `{id: <-~:mockmydb_pg.[users:*].id>}`
 Some what complex but walking through it we see:
 1. `<-` make a one-to-one mapping
 2. `~` that references pre-existing, pre-populated information
 3. `:` referenced by the identifier
  - `mockmydb_pg`
 4.`[users:*]` for every **users** value that exists
 5. `.id` I should obtain the value of the **id** key
 6. `>` and return it
---
 > long story short:
 > we have just populated a new database with every pre-existing user contained on  a completely isolated source.object
 > > even though the data is fake, running sb queries will return consistent results



*/
const AQL_PROJECT_NAME = {
  $_NOTE: {
    $_ACCESSOR:n$,
    $n: "MockMyDb is a concept to help developers quickly validate semi-complex database schemas"
  }
  $_ALIAS: {
    $_ACCESSOR:@$,
    V1:<$:E$.INVENTORY.v1>,
    B_TREE:[
      [[<$:Entwinements_PlayerMap[3]._key>]],
      [[<$:Entwinements_PlayerMap[1]._key>,<$:Entwinements_PlayerMap[5]._key>]]
      [[<$:Entwinements_PlayerMap[0]._key>,<$:Entwinements_PlayerMap[2]._key>],[<$:Entwinements_PlayerMap[4]._key>,<$:Entwinements_PlayerMap[6]._key>]],
    ],
    RANDOM_INVENTORY: {
      <-$:@$V1.GEAR[]>:<-$:@$V1.[modifier:<-$:@$V1.GEAR[]>{0,3}]>
      <-$:@$V1.ITEM[]>:<-$:@$V1.[modifier:<-$:@$V1.ITEM[]>{0,3}]>
    },
  RANDOM_STATS{
    <-$:E$.STATS[{0,3}]>:<fkr:int(min=-3,max=4)>
  },
  $_ENUM: {
    $_ACCESSOR:E$,
    INVENTORY:{
      v1:{
        ITEM: ['GOLD', 'ALE', 'DUCK'],
        GEAR: ['SWORD', 'SHIELD', 'MACE', 'GERBIL'],
        modifier: {ALE: {HP: -2}, GERBIL: {ATK: -1, MP: 5}},
      }
    },
    STATS:{ HP:12, MP:4, ATK:6, DEF:8 },
  },
// if not an ENUM then the top-level key will become the collection name
  PlayerMap:{
    id: <-~:mockmydb_pg[users:*].id>,
    lookup: <-~:mockmydb_pg.[lookup_user:*].uuid>,
    name:{
      full: <<-~:mockmydb_pg[users:*].first_name> <-~:mockmydb_pg[users:*].last_name>>,
      user: <-~:mockmydb_pg[users:*].user_name>,
    },
    stats:{
      modifications:{
        <-$:E$.STATS[]>:<-$:E$.[STATS]>,
        n$:'This sets the `modifications` key to the specified enum strings `STATS[]` and set the initial value to what is defined in the enum'
      },
    },
    aggregates:{
      entwinement:{
        generations:{ btree:<$:@$.B_TREE> }
      },
      skirmishes{
        record:{
          winLoss:[
            <<$:Skirmishes[_key:*][_from:<^:id>][victor:<^:id>][+]>[+]<$:Skirmishes[_key:*][_to:<^:id>][victor:<^:id>][+]>>,
            <<$:Skirmishes[_key:*][+]>[-]<<^:aggregates.skirmishes.record[winLoss:0][+]>>
          ],
          percent:
            <<^:aggregates.skirmishes.record[winLoss:0][+]>>
            [/]
            <<^:aggregates.skirmishes.record[winLoss:1][+]>>,
        },
      },
    },
    inventory:{
      gear: {<-$:@$V1.GEAR[]>:<-$:@$V1.[modifier:<-$:@$V1.GEAR[]>]>i}
      items: {<-$:@$V1.ITEMS[]>:<-$:@$V1.[modifier:<-$:@$V1.ITEMS[]>]>}
    },
  },
//////
TradingCard:{
  owner_id:<$:PlayerMap[_key]>,
  lookup:UUID(),
  name:<fkr:name>, # populated by faker/specified from doc
  generated: {
    on:<fkr:date:past(years=1)>,
    by:[<$:TradingCard:[_id]{1,5}>]
  },
  modifications:{
    <-$:E$.STATS[]>:0,
    n$:'This sets the `modifications` key to the specified enum strings `STATS[]` and set the default VALUE to `0'
  },
  events: {
    $n:'arrays below contain all events that the currently populating TradingCard has participated in',
    entwinements: [
      <$:Entwinements[_from:<^:_key>:*]._key>,
      <$:Entwinements[_to:<^:_key>:*]._key>,
    ],
    skirmishes: [
      <$:Skirmishes[_from:<^:_key>:*]._key>,
      <$:Skirmishes[_to:<^:_key>:*]._key>,
    ],
  }
},
  Entwinements:{
    _from:<$:$_CURRENT.TradingCard[_key]>,
      on: <fkr:date:past(years=1)>,
    _to:<$:TradingCard[_key]>,
  },
  Entwinements_PlayerMap:{
    edge_key:<$:$_CURRENT.Entwinements[_key]>
    lookup:UUID(),
    $n:'lookups are used for values that may be queried or read by the client',
    cost:<$:@$RANDOM_INVENTORY>,
    acquire:<$:@$RANDOM_INVENTORY>,
 },
  Skirmishes:{
    _from:<$:$_CURRENT.TradingCard[_key]>,
      on: <fkr:date:past(years=1)>,
      victor: [<$:$_CURRENT.TradingCard[_key]>|<^_to>],
    _to:<$:TradingCard[_key]>,
  },
  Skirmishes_PlayerMap:{
    spoils:[
      <$:@$RANDOM_INVENTORY>,
      <$:@$RANDOM_STATS>,
     ] # optional extra for winning the skirmish
#     cost:[<^:spoils>{0,1}],
#     result:['WIN'|'LOSS'{1}],
  },
  $_ON_MOCK_COMPLETE:{
    $n: 'this object is never entered into arango - it is deleted upon finalization of the current step. It exists to give the next step any information required'
    LookupsByPlayer:{
      player_id: <$:PlayerMap[lookup:*]>,
      cards: <$:TradingCard.[owner_id:<$:PlayerMap[_key:*]].lookup>,
      stats:<$:PlayerMap[lookup:*].stats.modifications>
      events:<$:PlayerMap[lookup:*].aggregates>
      inventory:<$:PlayerMap[lookup:*].inventory>
    }
  }
}


