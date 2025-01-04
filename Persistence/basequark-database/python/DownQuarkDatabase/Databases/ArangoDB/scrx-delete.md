# Below was a working version of the intiial attempt
## - may be able to leverage some aspects but most likely it is going to need to be completetly rewritten
####################
###################

### edge building
####
# '''
# LET tc_ids = (
#   FOR tc IN TradingCard
#     RETURN tc._id
# )
# LET tc_map_id_name = (
#   FOR tc IN TradingCard
#     FILTER TRUE
#     RETURN {[tc._id]:{id:tc.id,name:tc.name}}
# )[**]
#
# LET tc_evt_amt = (
#   FOR tc IN TradingCard
#   COLLECT uid = tc.id WITH COUNT INTO evtAmt
#   RETURN {[uid]:{eventAmount:evtAmt}}
# )
#
# COLLECT mutable_ids = tc_ids
# COLLECT user_metadata = tc_map_id_name
#
# LET edge_match_ids = (
#   FOR m_id in mutable_ids
#     LET cur_id = m_id
#
#     LET usrmetadtaExpanded = (
#     FOR usr IN user_metadata
#       LET usrmeta = user_metadata
#       RETURN usrmeta
#     )[** FILTER HAS(CURRENT,cur_id) LIMIT 1]
#     LET usrmetadta = usrmetadtaExpanded[0][cur_id]
#
#     LET userEventCountExpanded = (
#       RETURN tc_evt_amt[* FILTER HAS(CURRENT,usrmetadta.id) LIMIT 1]
#     )[**]
#     LET userEventCount = userEventCountExpanded[0][usrmetadta.id]
#
#     // TODO: make the below dynamic by getting the amount (and name of) the edge collections from arango//--> `COLLECTIONS()`.<-- that command will give us what we need
#     // Then update the following to apply the same logic to the generic edge collections
#       // https://docs.arangodb.com/3.12/aql/functions/document-object/#parse_collection <-- will also help
#     LET splitEdges = ROUND(RANDOM()*userEventCount.eventAmount)
#     LET assignedUserEvents = {
#       amt_entwined_edges:splitEdges,
#       amt_scuffled_edges:userEventCount.eventAmount - splitEdges,
#       total_edges: userEventCount.eventAmount,
#       range_entwined_edges:SHIFT(RANGE(0,splitEdges)),
#       range_scuffled_edges:POP(RANGE(0,userEventCount.eventAmount - splitEdges))
#     }
#
#     LET assinedEdgeEvents = {
#       meta: assignedUserEvents,
#       entwined: (
#         FOR assignedEvent IN assignedUserEvents.range_entwined_edges
#           RETURN mutable_ids[FLOOR(RANDOM()*LENGTH(mutable_ids))]
#       ),
#       scuffled: (
#         FOR assignedEvent IN assignedUserEvents.range_scuffled_edges
#           RETURN mutable_ids[FLOOR(RANDOM()*LENGTH(mutable_ids))]
#       )
#     }
#     // END TODO
#
#     RETURN {user:{arango_id:cur_id, meta:usrmetadta, edgeEvents:assinedEdgeEvents}}
# )
#
# // PRE-REQUISITE WORK IS COMPLETED AT THIS POINT:
# // -> CREATE SHAPES FOR INSERT
#
# LET edge_inserts = (
#   FOR edge_doc IN edge_match_ids
#     LET edge_user = edge_doc.user
#
#     //LET filtered_entwined_events
#     LET entwined_events = (
#         FILTER LENGTH(edge_user.edgeEvents.entwined) > 0
#
#         LET entwined_event_structured = (
#           FOR entwined_event IN edge_user.edgeEvents.entwined
#             RETURN {
#                       _from:edge_user.arango_id, // DIRECTION IS FROM USER TO ENTWINEMENT RESULT (new card)
#                         id: edge_user.meta.id, // user public facing id for social interactions/posts/etc
#                         with:["supplies given",CONCAT('item:',CRC32("ITEM_ID")),CONCAT('GOLD|',CRC32("dolarbucks"))], // ITEMS you gave up
#                         receive:["rewards gained",CONCAT('item:',CRC32("ITEM_ID")),CONCAT('GOLD|',CRC32("dolarbucks"))],
#                       _to:entwined_event,
#                     }
#         )
#         RETURN entwined_event_structured
#       )
#
#       LET scuffled_events = (
#         FILTER LENGTH(edge_user.edgeEvents.scuffled) > 0
#
#         LET scuffled_event_structured = (
#           FOR scuffled_event IN edge_user.edgeEvents.scuffled
#               RETURN {
#                       _from:scuffled_event, // DIRECTION IS FROM OPPONENT TO PLAYER (no real reason .. jsut seems like it should be)
#                         id: edge_user.meta.id, // user public facing id for social interactions/post
#                         with:['wagers',CONCAT('consumable:',CRC32("ITEM_ID")),'broken weapon','etc'],
#                         receive:["HP-3","ATK+2"],
#                       _to:edge_user.arango_id,
#                     }
#         )
#         RETURN scuffled_event_structured
#       )
#
#
#     RETURN {  // TODO: Make this dynamic as well by using key names in edgeEvents.meta
#               user: {arango:edge_user.arango_id,id:edge_user.meta.id},
#               entwined:entwined_events[**],
#               scufflded:scuffled_events[**]
#            }
# )
# // RETURN edge_inserts
#
# // edge insert structure and organization created.
# // insert into db
#
# FOR edge_insert IN edge_inserts // For each "user"
# FILTER LENGTH(edge_insert) > 0
#
#   LET entwinement_insertion = (
#     FOR insert_entwinement IN edge_insert.entwined
#     FILTER LENGTH(insert_entwinement) > 0
#
#     INSERT insert_entwinement INTO Entwinements
#     RETURN insert_entwinement
#   )
#
#   LET scufflded_insertion = (
#     FOR insert_scufflded IN edge_insert.scufflded
#     FILTER LENGTH(insert_scufflded) > 0
#
#     INSERT insert_scufflded INTO Skirmishes
#     RETURN insert_scufflded
#   )
#
#
# RETURN [entwinement_insertion,scufflded_insertion]

# end initial
##################
##################

# Deprecated workings to delete when a dynamic conversion conmpletes

# '''

##
####
##

# TradingCard Dummy
# //FOR tc in TradingCard
#   //REMOVE tc in TradingCard
# //  RETURN tc
#
# LET quickandeasy = (
# FOR i in RANGE(1,30)
#   LET ID = UUID()
#   RETURN [ID, CRC32(SPLIT(ID, "-" )[1])]
# )
#
# // RETURN quickandeasy
#
# LET makeids = (
# FOR i in RANGE(1,85)
#   RETURN quickandeasy[FLOOR(RANDOM()*LENGTH(quickandeasy))]
# )
#
#
# LET makecards = (
#
# FOR i in RANGE(1,150)
# LET cardId = makeids[FLOOR(RANDOM()*LENGTH(makeids))]
#
# LET card = {
#   "id":  cardId[0], // will be `id` from rdbms
#   "name":cardId[1],
#   "generated": {
#     "at": REVERSE(cardId[0]),
#         "on": DATE_NOW(),
#     "by": [],//"ids","of the", "cards used during", "the entwinement"
#   },
#   "mutations": {
#     "stats": {
#       "ATK": FLOOR(RAND() * 13)-FLOOR(RAND() * 13),
#       "MP": FLOOR(RAND() * 13)-FLOOR(RAND() * 13),
#       "HP": FLOOR(RAND() * 13)-FLOOR(RAND() * 13),
#       "DEF": FLOOR(RAND() * 13)-FLOOR(RAND() * 13),
#     },
#     "NOTE": "stats object ONLY holds the updated amount for the key that was mutated"
#   },
#   "events": {
#       "entwinements":[],
#         "scuffles":[],
#   }
# }
#
# RETURN card
#
# )
#
# FOR makecard IN makecards
#   INSERT makecard INTO TradingCard
#
# //RETURN makecards
##### end trading card dummy

# LET tc_ids = (
#   FOR tc IN TradingCard
#     RETURN tc._id
# )
#

######

######


# DEPRECATED
####
# {
#   "id": "abcd-1234",
#   "name": "Tradey McCardster",
#   "generated": {
#     "at": "node Id",
#         "on": "<timestamp>",
#     "by": [["ids","of the other", "scuffler(s)"],""]
#   },
#   "adjustments": {
#     "stats": {
#       "HP": 20,
#       "ATK": -2
#     },
#     "NOTE": "stats object ONLY holds the updated amount for the key that was mutated"
#   },
#   "events": {
#       "entwinements":[
#             "array-of","ids","maps-to","edge-ids"
#       ],
#         "scuffles":[
#             "array-of","ids","maps-to","edge-ids"
#       ],
#   }
# }


### Deprecated
#   [
#     {
#       "type": "entwining",
#         "created":
#       "at": "node Id where entwining took place",
#       "with": ["ids","of the other", "cards involved"],
#       "result": "id of trading card that was generated due to entwining"
#     },
#     {
#       "type": "scuffle",
#       "at": "node Id where combat occurred",
#       "with": ["ids","of the other", "scuffler(s)"],
#       "result": "WIN|LOSS are the valid enums"
#     }
#   ]