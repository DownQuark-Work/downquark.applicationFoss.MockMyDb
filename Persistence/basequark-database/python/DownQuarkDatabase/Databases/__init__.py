"""configures connections and readies interaction for _only_ db types that have been successfully configured from `../__main__.py`"""

## Below is the dbml output to be used when scaffolding the db
######
# '''
# Project MockMyDb {
#   database_type: 'PostgreSQL'
#   note: '''MockMyDb Demo :: TCG'''
# }
#
# // //// Docs: https://dbml.dbdiagram.io/docs
# // //// -- LEVEL 1
# // //// -- Schemas, Tables and References
# Table mockmydb_pg.config {
#   id int [pk]
#
# }
#
# // //// -- POSTGRES -- //// //
#   //// -- TRADING_CARDS
# Table mockmydb_pg.cards {
#   id int [pk]
#   created varchar [default: "now()"]
#   name varchar(12)
#   ipfs json [not null, note:'''
#     json object containing content that relates to IP(FS|LD) schema &&|| metadata
#     see IPFS Metadata Schema Example below
#   ''']
#
#   Note: '''
#     on user creation: `Trigger` called to create associated UUID in `lookup_card` table
#     on user query: `Trigger` activated to query and obtain associated UUID in `lookup_card` table
#   '''
# }
# Table mockmydb_pg.cards_entwinements {
#   id_card int [pk, ref:- mockmydb_pg.cards.id]
#   id_parent int [ref:> mockmydb_pg.cards.id]
#   Note: '''
#     Maps the parent cards to the created child
#     - generational data exists on arangodb
#   '''
# }
# Table mockmydb_pg.cards_conflicts {
#   id int [pk]
#   when varchar [default: "now()"]
#   id_card_challenger int [ref:> mockmydb_pg.cards.id]
#   id_card_opponent int [ref:> mockmydb_pg.cards.id]
#   id_card_victor int [ref:> mockmydb_pg.cards.id]
#
#   Note: '''
#     Record of card battles, the time, and the winner
#     - hierachical data exists on arangodb
#   '''
# }
# Table mockmydb_pg.cards_stats {
#   id_card int [pk, ref:- mockmydb_pg.cards.id]
#   HP tinyint(3)
#   MP tinyint(3)
#   ATK tinyint(3)
#   DEF tinyint(3)
#   Note: '''
#    stats for card - all are nullable if DNE for specific example
#   '''
# }
#
#   //// -- USERS
# Table mockmydb_pg.users {
#   id int [pk]
#   created varchar [default: "now()"]
#   first_name varchar(50)
#   last_name varchar(50)
#   user_name varchar(12)
#
#   Note: '''
#     on user creation: `Trigger` called to create associated UUID in `lookup_user` table
#     on user query: `Trigger` activated to query and obtain associated UUID in `lookup_user` table
#   '''
# }
#
#
# Table mockmydb_pg.user_cards {
#   card_id int [not null, ref: - mockmydb_pg.cards.id]
#   user_id int [unique, not null, ref: > mockmydb_pg.users.id]
#   buff_nerfs json  [note:'''
#     example: {
#       "HP":12 # adds 12 to card's Hit Points
#       "ATK": -3 # removes 3 units from card's Attack Damage
#     } ''']
#   Note: 'This table maps the user to their "owned" cards'
# }
#
# // Specialized Tables //
# Table mockmydb_pg.lookup_card {
#   id int [unique]
#   uuid uuid [pk]
#
#   Note: '''
#     No true performance gain here
#     - just think it works well for a demo/poc
#     -- provides bridge between command id and query uuid
#   '''
# }
# Table mockmydb_pg.lookup_user {
#   id int [unique]
#   uuid uuid [pk]
#   Note: 'Same note as above'
# }
#
#
# // //// -- MARIA -- //// //
# ////// the response [aggregate] db
# Table mockmydb_maria.users {
#   uuid uuid [pk, note: 'this uuid is all the enduser ever sees. The `id` values are abstracted away']
#   name varchar(100) [note: 'concats first and last name']
#   created date [default: "now()"]
#
#   Note: '''
#     This table and the `user` syntax relates to the "human" USERS
#     on user creation: `Trigger` called to create associated UUID in `lookup_user` table
#     on user query: `Trigger` activated to query and obtain associated UUID in `lookup_user` table
#   '''
# }
#
# Table mockmydb_maria.players {
#   uuid_user uuid [pk, ref: - mockmydb_maria.users.uuid]
#   inventory_join uuid [not null, ref: < mockmydb_maria.join_equipment.uuid_user]
#   statistics uuid [not null, ref: < mockmydb_maria.player_stats_aggregate_sum.uuid_user, note:'''
#     This field references the fully aggregated values to be used in game.
#   ''']
#
#   Note: '''
#     This table and the `player` syntax relates to the  "virtual, online avatars" PLAYERS used for the game
#   '''
# }
#
# Table mockmydb_maria.player_stats_aggregate_sum {
#   uuid_user uuid [pk, ref: - mockmydb_maria.users.uuid]
#   stat_base uuid [not null, ref: <> mockmydb_maria.join_stats.uuid_user]
#   stat_aggregate int [not null, ref: - stat_base, note: 'holds the updated value after applying any positive or negative effects from game play']
#
#   Note: '''
#     in essence, this is just another join field with `AGGREGATE` and `SUM` applied to the value
#   '''
# }
#
#
# Table mockmydb_maria.cards {
#   uuid uuid [pk, note: 'this uuid is all the enduser ever sees. The `id` values are abstracted away']
#   name varchar(100) [note: 'concats first and last name']
#   ipfs_url varchar(100) [note: "for image/etc"]
#
#   Note: 'same triggers as `users` table above'
# }
# Table mockmydb_maria.user_cards {
#   uuid_user uuid [not null, ref: > mockmydb_maria.users.uuid]
#   uuid_card uuid [not null, ref: - mockmydb_maria.cards.uuid]
#   /// for the conflicts below no extra informatoin about the cards/entwinement should be stored in the aggregate table - only what affects the end user
#   amt_conflicts_lost mediumint(4) [not null, default: 0]
#   amt_conflicts_won mediumint(4) [not null, default: 0]
#   /// for the descendants branches below no extra informatoin about the cards/entwinement should be stored in the aggregate table - only what affects the end user
#   can_entwine boolean [default:false] // updated after arango - aggregate db does not need to store the numerical information - only what affects the end user
#   amt_descendents_direct tinyint(2)  [not null, default: 0] // updated after arango - contains count of cards directly created by the user
#   amt_descendents_branched mediumint (4)  [not null, default: 0] // updated after arango - contains count of cards created by all descendendant cards of the user
#
#   Note: 'for aggregate db - all stats are listed, with buff/nerfs applied. undefined/null values allowed if stat dne for specific card(s)'
#
#     indexes {
#       (uuid_user, uuid_card) [pk] // composite primary key
#     }
# }
#
# Table mockmydb_maria.join_equipment {
#   uuid_user uuid [pk, ref: > mockmydb_maria.users.uuid]
#   equpment Enum_EQUIPMENT [not null]
#   stats_modifier int [null] // this modifier is caused by the item/equipment being used
# }
#
# Table mockmydb_maria.join_stats {
#   uuid_user uuid [pk, ref: > mockmydb_maria.users.uuid]
#   stat_type mockmydb_maria.Enum_STAT
#   stat_value tinyint(3) [not null, default: 0, note:'this is the default value the palyer began the game with.']
#   stat_modifier tinyint(3) [not null, default: 0]
#   stat_modifier_equipment tinyint(3) [ref:<mockmydb_maria.join_equipment.stats_modifier]
#   Note: '''
#     The `stat_modifier` above will be set based on the
#      any buffs &&|| nerfs gained from "in game" `arangodb` experince.
#      generational updates, winning skirmishes, etc
#   '''
# }
#
# /* provides bridge between command id and query uuid */
# Ref: mockmydb_pg.cards.id - mockmydb_pg.lookup_card.id
# Ref: mockmydb_maria.cards.uuid - mockmydb_pg.lookup_card.uuid
# Ref: mockmydb_pg.users.id - mockmydb_pg.lookup_user.id
# Ref: mockmydb_maria.users.uuid - mockmydb_pg.lookup_user.uuid
#
# // these are static and only referenced for the in game experience.
# //// PostGres has no reason to know about them
# Enum mockmydb_maria.Enum_EQUIPMENT {
#   "mockmydb_maria.Enum_GEAR"
#   "mockmydb_maria.Enum_ITEM"
# }
# Enum mockmydb_maria.Enum_ITEM {
#   GOLD
#   ALE
#   DUCK
# }
# Enum mockmydb_maria.Enum_GEAR {
#   SWORD
#   SHEILD
#   MACE
#   GERBIL
# }
# Enum mockmydb_maria.Enum_STAT {
#   HP
#   MP
#   ATK
#   DEF
# }
# '''
