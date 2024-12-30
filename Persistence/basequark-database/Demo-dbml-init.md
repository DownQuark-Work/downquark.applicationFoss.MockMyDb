### Far from complete ... but it's a rough start:

```
Project Mockables {
  database_type: 'PostgreSQL'
  note: '''MockMyDb Demo :: TCG'''
}

// //// Docs: https://dbml.dbdiagram.io/docs
// //// -- LEVEL 1
// //// -- Schemas, Tables and References

// //// -- POSTGRES -- //// //
  //// -- TRADING_CARDS
Table mockmydb_pg.cards {
  id int [pk]
  created varchar [default: "now()"]
  name varchar(12)
  initial_stats json [not null, note:'''
    HP, MP, ATK, DEF, ..etc
  ''']
  ipfs json [not null, note:'''
    json object containing content that relates to IP(FS|LD) schema &&|| metadata
    see IPFS Metadata Schema Example below
  ''']

  Note: '''
    on user creation: `Trigger` called to create associated UUID in `lookup_card` table
    on user query: `Trigger` activated to query and obtain associated UUID in `lookup_card` table
  '''
}

  //// -- USERS
Table mockmydb_pg.users {
  id int [pk]
  created varchar [default: "now()"]
  first_name varchar(50)
  last_name varchar(50)
  user_name varchar(12)

  Note: '''
    on user creation: `Trigger` called to create associated UUID in `lookup_user` table
    on user query: `Trigger` activated to query and obtain associated UUID in `lookup_user` table
  '''
}


Table mockmydb_pg.user_cards {
  card_id int [not null, ref: > mockmydb_pg.cards.id]
  user_id int [not null, ref: > mockmydb_pg.users.id]
  buff_nerfs json  [note:'''
    example: {
      "HP":12 # adds 12 to card's Hit Points
      "ATK": -3 # removes 3 units from card's Attack Damage
    } ''']

  Indexes {
    (user_id, card_id) [name:'user_card']
    // unique bc even if user had duplicate card, each card would have a its own identifier
  }
  Note: 'This table maps the user to their "owned" cards'
}

// Specialized Tables //
Table mockmydb_pg.lookup_card {
  id int [unique]
  uuid uuid [pk]

  Note: '''
    No true performance gain here
    - just think it works well for a demo/poc
    -- provides bridge between command id and query uuid
  '''
}
Table mockmydb_pg.lookup_user {
  id int [unique]
  uuid uuid [pk]
  Note: 'Same note as above'
}


// //// -- MARIA -- //// //
////// the response [aggregate] db
Table mockmydb_maria.users {
  uuid uuid [pk, note: 'this uuid is all the enduser ever sees. The `id` values are abstracted away']
  name varchar(100) [note: 'concats first and last name']
  created date [default: "now()"]

  Note: '''
    on user creation: `Trigger` called to create associated UUID in `lookup_user` table
    on user query: `Trigger` activated to query and obtain associated UUID in `lookup_user` table
  '''
}

Table mockmydb_maria.cards {
  uuid uuid [pk, note: 'this uuid is all the enduser ever sees. The `id` values are abstracted away']
  name varchar(100) [note: 'concats first and last name']
  ipfs_url varchar(100) [note: "for image/etc"]

  Note: 'same triggers as `users` table above'
}
Table mockmydb_maria.user_cards {
  uuid_user uuid [not null, ref: > mockmydb_maria.users.uuid]
  uuid_card uuid [not null, ref: > mockmydb_maria.cards.uuid]
  /// for the descendants branches below no extra informatoin about the cards/entwinement should be stored in the aggregate table - only what affects the end user
  can_entwine boolean [default:false] // updated after arango - aggregate db does not need to store the numerical information - only what affects the end user
  amt_descendents_direct tinyint // updated after arango - contains count of cards directly created by the user
  amt_descendents_branched mediumint // updated after arango - contains count of cards created by all descendendant cards of the user
  // for stats below, these will also include any buffs &&|| nerfs gained from generational updates which are stored in the  Arango db
  HP tinyint(3)
  MP tinyint(3)
  //ATK, ...etc

  Note: 'for aggregate db - all stats are listed, with buff/nerfs applied. undefined/null values allowed if stat dne for specific card(s)'
    Indexes {
      (uuid_user, uuid_card) [unique, name:'user_card']
      // unique bc even if user had duplicate card, each card would have a its own identifier
    }
}

/* provides bridge between command id and query uuid */
Ref: mockmydb_pg.cards.id - mockmydb_pg.lookup_card.id
Ref: mockmydb_maria.cards.uuid - mockmydb_pg.lookup_card.uuid
Ref: mockmydb_pg.users.id - mockmydb_pg.lookup_user.id
Ref: mockmydb_maria.users.uuid - mockmydb_pg.lookup_user.uuid

// //----------------------------------------------//
// //----------------------------------------------//
// //----------------------------------------------//
/* IPFS Metadata Schema Example
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "IPFS Metadata",
  "type": "object",
  "properties": {
    "author": {"type": "string"},
    "timestamp": {"type": "integer"},
    "filesize": {"type": "integer"}
  },
  "required": ["author", "timestamp"],
  "additionalProperties": false
}
*/
```
