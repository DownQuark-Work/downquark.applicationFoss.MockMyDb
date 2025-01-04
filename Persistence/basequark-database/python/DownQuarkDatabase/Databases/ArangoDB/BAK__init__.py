A good first go, but think it can be improved on
# https://docs.arangodb.com/3.12/arangograph/notebooks/
# --- The above auto-installs some of the below
# https://github.com/arangodb/python-arango
# https://docs.arangodb.com/3.12/develop/drivers/python/
# Repository: https://github.com/ArangoDB-Community/python-arango
# Reference: https://docs.python-arango.com/
#
# https://university.arangodb.com/courses/python-driver-tutorial/
# https://docs.python-arango.com/en/main/
#
# https://github.com/arangoml/arangodb_datasets
#
#### https://docs.arangodb.com/3.12/data-science/arangographml/
#
# https://neo4j.com/developer-blog/15-tools-for-visualizing-your-neo4j-graph-database/
#
# https://docs.arangodb.com/3.12/components/tools/
# https://docs.arangodb.com/3.12/aql/operators/#range-operator
# https://github.com/arangodb/interactive_tutorials#machine-learning
# - https://colab.research.google.com/github/arangodb/interactive_tutorials/blob/master/notebooks/Integrate_ArangoDB_with_PyG.ipynb#scrollTo=6lCsFOyjG12U

# https://docs.arangodb.com/3.12/aql/operators/#question-mark-operator
# https://docs.arangodb.com/3.12/get-started/

# https://docs.arangodb.com/3.12/aql/functions/miscellaneous/#schema_validate
# SCHEMA_VALIDATE(doc, schema)

# https://docs.arangodb.com/3.12/aql/graphs/traversals/ <<<-- read this to create graphs
#JOINS: https://docs.arangodb.com/3.12/aql/examples-and-query-patterns/joins/ !!
# $GROUPING https://docs.arangodb.com/3.12/aql/examples-and-query-patterns/grouping/

# Another for aql:
# https://docs.arangodb.com/3.12/aql/execution-and-performance/query-profiling/
# https://docs.arangodb.com/3.12/aql/functions/miscellaneous/#check_document << very helpful
## `CHECK_DOCUMENT(document)`
# ```
# FOR doc IN TradingCard
#   FILTER !CHECK_DOCUMENT(doc)
#   RETURN JSON_STRINGIFY(doc)
#```

# GRAPH edge definitions:
## https://docs.arangodb.com/3.12/graphs/general-graphs/management/#edge-definitions
## https://docs.arangodb.com/3.12/graphs/general-graphs/management/#save-a-new-edge
## https://docs.arangodb.com/3.12/graphs/general-graphs/management/#complete-example-to-create-a-graph
## https://docs.arangodb.com/3.12/graphs/working-with-edges/

# // https://docs.arangodb.com/3.12/index-and-search/indexing/working-with-indexes/multi-dimensional-indexes/#finding-all-appointments-that-intersect-a-time-range
# // The above will help with the final step - when making sure the edge linking makes sense

## DATA SCIENCE
# https://docs.arangodb.com/3.12/data-science/
# - https://docs.arangodb.com/3.12/data-science/arangographml/
# // //----------------------------------------------//
# // //----------------------------------------------//
# // //----------------------------------------------//
# /* IPFS Metadata Schema Example
# {
#   "$schema": "http://json-schema.org/draft-07/schema#",
#   "title": "IPFS Metadata",
#   "type": "object",
#   "properties": {
#     "author": {"type": "string"},
#     "timestamp": {"type": "integer"},
#     "filesize": {"type": "integer"}
#   },
#   "required": ["author", "timestamp"],
#   "additionalProperties": false
# }
# */
#

#### '$ENUM' is STATIC - USER DEFINED - POPULATED FROM MockMyDB - WILL NOT BE MUTATED DURING OBJECT CREATION
# all uppercase keys beginning with a dollar sign should be handled as static content.
# ### Do not use typings,define the values

### Define the the below for an enum to be parsed in arango
#######
####### '$ENUM':{
#######     '$INVENTORY':{
#######         v1:{ # a key with no `$` will also be left as-is, but will not be included in the bridge to the next step of the process (if exists)
#######             ITEM: ['GOLD' 'ALE' 'DUCK'],
#######             GEAR: ['SWORD', 'SHEILD', 'MACE', 'GERBIL'],
#######             modifier: {ALE: {HP: -2}, GERBIL: {ATK: -1, MP: +5}},
#######         }
#######     },
#######     '$STATS':{ HP:12, MP:4, ATK:6, DEF:8 },
####### }
#######
##############

########## The definition above will be converted to the below to be run
############## ~~ [ we cannot create collections from webview ... `_db.createCollection('collectionName')` works well though ]
########### Using the webview we will have to the below
######### After creating the `$ENUM` collection run the following

####### LET ENUM={
#######     $INVENTORY:{
#######         v1:{
#######             ITEM: ['GOLD', 'ALE', 'DUCK'],
#######             GEAR: ['SWORD', 'SHIELD', 'MACE', 'GERBIL'],
#######             modifier: {ALE: {HP: -2}, GERBIL: {ATK: -1, MP: +5}},
#######         }
#######     },
#######     $STATS:{ HP:12, MP:4, ATK:6, DEF:8 },
####### }
####### INSERT ENUM INTO $ENUM

####### ####### ####### IF using python or another adapter the insert method _should_ create the collection if it does not currently exist

##### DYNAMIC KEY VALUES
# all lowercase keys beginning with a dollar sign should be dynamically populated
# ### should have a typing of the source of their data (see `PlayerMap.$id`)
## these keys WILL be mutated on data population - the`$` will be removed -and the templating system will be removed (see below)

# The pseudo object below would render along the lines of: `{id: '9dc6543d-ac0d-441a-84a5-7c727755afaf'}`
# {'$id': 'mockmydb_pg.config.uuid'}

# to customize dynamic values use something similar to the array expansion syntax of arango
# each `[*]` or `[**]` will be replaced with the value of the  key at that location in the object being referenced
    # any characters between those brackets will be rendered as written:
        # `[*].[*]`, `[*]_[*]` would use dot or underscore notation respectfully
# The below results an id along the lines of `{id:'GEAR-MACE'}`
# {'$id': '$ENUM.$INVENTORY.v1.[*]-[*]'},
    # had the key been defined as below then an id would be output along the lines of: `{id:'GEAR-MACE',MACE:[]}`
        # allowing for the key associated with the multiple `**` to be utilized to access the multiple values
    # a single `*` for a single allowable key
# {'$id': '$ENUM.$INVENTORY.v1.[*]-[**]'},

## NOTE: the above describes the output if the `/[**?]/` is used as the `VALUE`
## -- see `PlayerMap` below for the difference when using it as a KEY, without specifying a VALUE


# Using the above syntax we can define a dynamic PlayerMap collection using the below

# PlayerMap:{
#       $id: 'mockmydb_pg.users.id',
#       $lookup: 'mockmydb_pg.lookup_user[$id].uuid',
#       $name: 'mockmydb_pg.users.user_name'
#       aggregates{ # individual breakdowns can be found in the event log - this is the holistic view
#           stats: {
#               modifications:{ '$ENUM.$STATS.[**]':int?},  # allows for 0 or more stats to be applied with values: {HP:7}
#               entwinement:{
#                     generations: {raw:BTREE,parsed:[]}
#               },
#               skirmish: {
#                   record:{winLoss:[int,int],percent:float},
#                   rank:String(int)'/'String(int) # basically will show as 13/122
#               }
#           }
#       }
#     events:{
#       entwinement:'[collection.PlayerMapEntwinement.document]', # this sets the typing to an array of  Entwinements documents
#       skirmish:'[collection.PlayerMapSkirmish.document]', # this sets the typing to an array of  Skirmishes documents
#     },
#     inventory:{
#         gear:{$ENUM.$INVENTORY.v1.GEAR.[*]}, # creates `{gear:{SWORD:{},GERBIL:{},...etc}
#         items: {$ENUM.$INVENTORY.v1.ITEM.[**]}, # creates `{items:{ALE:[],DUCK:[],...etc}
#     }
# }


# ## With mocked data the above renders the document type below to be used in the PLayerMap collection ###---###
# {
#     id: 13,
#     events:{
#       entwinement:'[{Entwinement}]', # curently updating entwinement type - will update the stub when complete
#       skirmish:'[{Skirmish}]', # curently updating Skirmish type - will update the stub when complete
#     },
#     inventory:{
#         gear:{SWORD:{DEF:3,SPD:2},GERBIL: {ATK: -1, MP: +5}}, # sword has special in-game bonuses applied
#         items:{ALE:[{HP: -2},{HP: -2}],DUCK:[]},
#     }
# }


# PlayerMapEntwinement:{
#     edge_lookup: collection.Entwinements.id', # lookup allows for UUID calls on future API integrations
#     cost:{ # `?` behind type indicates optional
#         $ENUM.$INVENTORY.v1.ITEM.[GOLD|ALE]:int?, # optionally allows for the likes of {`GOLD:17`, `ALE:3`}
#         $ENUM.$STATS.[**]:int? # allows for 0 or more stats to be applied with values: {HP:7}
#     acquire:{exp:int,BTREE:int}, //experience gained for entwinement
#                                   // and the location on the player's btree to track the "family tree
#                                        // hoping btree will let us quickly keep track of generations down and sideways drift of descendants
#   }


# Entwinements Shape Example
# This template:
#Entwinements:{
#   _from:'collection.TradingCard._key',
#     on: DATE_NOW(),
#   event_lookup: collection.PlayerMap._id.events.entwinement[int]' // will be returned after insertion
#   _to:'collection.TradingCard._key',
# }

### Renders something like below to be implemented


# PlayerMapEntwinement:{
#     edge_lookup: "9dc6543d-ac0d-441a-84a5-7c727755afaf",
#     cost:{ GOLD:13, MP:3 }
#     acquire:{exp:23,BTREE:9},
#  }
#
# PUSH(PlayerMap/382078.events.entwinement,PlayerMapEntwinement)

# LET Entwinements = {
#   _from:TradingCard/412034,
#     on: 1735797012399,
#   event_lookup: PlayerMap/382078.events.entwinement[3]' // will be returned after insertion
#   _to:TradingCard/412078,
# }
#
# RETURN Entwinements


# Skirmish Shape Example
# These templates:

# PlayerMapSkirmish:{
#   edge_lookup: 'collection.Skirmishes._key',
#    spoils:{ # optional extra for winning the skirmish
#       $ENUM.$INVENTORY.v1.GEAR.[*]:int?,
#        $ENUM.$STATS.[**]:int?},
#     cost:{ $ENUM.$STATS.[**]:int? },
#     result:'WIN'|'LOSS',
#  }


# Skirmishes:{ # _from requested the skirmish while _to accepted it
#   _from:'collection.TradingCard._key',,
#     on: DATE_NOW(),
#      event_lookup: collection.PlayerMap._id.events.skirmish[int]' // will be returned after insertion
#     victor: _from|_to,
#   _to:'collection.TradingCard._key',
# }

####### results in below implementations

# PlayerMapSkirmish:{
#   edge_lookup: "9dc6543d-ac0d-441a-84a5-7c727755afaf",
#   spoils:{SWORD:12}
#     cost:{ GOLD:13, MP:3 }
#     record:{winLoss:[5,3],percent:60.0}
#  }
# PUSH(PlayerMap/382078.events.skirmish,PlayerMapSkirmish)

# LET Skirmishes = {
#   _from:TradingCard/412034,
#     on: 1735797012399,
#     event_lookup: PlayerMap/382078.events.skirmish[3]',
#     victor:TradingCard/412078
#   _to:TradingCard/412078,
# }
#
# RETURN Skirmishes



# {
#   "id": "b028ff9d-2da2-46ad-9e79-43c4ecbc0644",
#   "name": "33589610",
#   "generated": {
#     "on": 1735725196002,
#     "by": []
#   },
#   "adjustments": {
#     "stats": {
#       "ATK": -2,
#       "MP": 2,
#       "HP": 4,
#       "DEF": 3
#     },
#     "NOTE": "stats object ONLY holds the updated amount for the key that was mutated"
#   },
#   "events": {
#     "entwinements": [],
#     "scuffles": []
#   }
# }