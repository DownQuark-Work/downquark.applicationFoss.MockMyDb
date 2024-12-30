# random notes and scrippets

> just a scrx file

println!("https://docs.rs/sqlx/latest/sqlx/");
println!("https://docs.rs/sqlx/latest/sqlx/fn.raw_sql.html:");
println!("https://docs.rs/sqlx/latest/sqlx/types/uuid/index.html: Use version 7");
println!("https://docs.rs/sqlx/latest/sqlx/struct.QueryBuilder.html");
println!("THEN");
println!("https://docs.rs/arangors/latest/arangors/");

    /* STUBBED with ZERO CONNECTION DATA
    let db_instance = persistence::config_persistent(&persistence::EnumPersistenceTypes::DatabaseMaria);
    let mut requested_data = persistence::request_persistent_data(&db_instance,"A");
    println!("requested_data: {requested_data:?}");
    requested_data = persistence::request_persistent_data(&db_instance,"Z");
    // https://newsletter.techworld-with-milan.com/i/141230389/factory-method
    println!("requested_data: {requested_data:?}");
    */

    // println!("");

// pub async fn on_application_startup_query(dq_conf:&DevQonConfig) -> String {
// let db_instance = config_persistent(&EnumPersistenceTypes::DatabaseMaria);
// let db_maria_config = dq_conf.get_db_connection_config(db_instance);
// for (table_ref, connection_str) in db_maria_config.iter() {
// println!("table_ref: {table_ref:?}");
// println!("connection_str: {connection_str:?}");
// };
// println!("db_maria_config: {:?}",db_maria_config[&0]);
// "Database Startup Data".to_string()
// }

// let db_instance = persistence::config_persistent(&persistence::EnumPersistenceTypes::DatabaseMaria);
// let mut requested_data = persistence::request_persistent_data(&db_instance,"A");
// println!("requested_data: {requested_data:?}");
// requested_data = persistence::request_persistent_data(&db_instance,"Z");
// // https://newsletter.techworld-with-milan.com/i/141230389/factory-method
// println!("requested_data: {requested_data:?}");
// println!("");
// println!("dq_config_state: {:?}",dq_config_state.get_db_connection_config(db_instance));

    // let db_instance = persistence::config_persistent(&persistence::EnumPersistenceTypes::DatabaseMaria);
    // let db_config = dq_config_state.get_db_connection_config(&persistence::EnumPersistenceTypes::DatabaseMaria);
    // println!("db_config: {db_config:?}");
    // let db_startup_data:String = persistence::on_application_startup_query(db_config).await;
    // println!("db_startup_data: {db_startup_data:?}");
    // println!("");

// println!("dq_config_state: {:?}",dq_config_state.get_db_connection_config(db_instance));

    // let db_instance = persistence::config_persistent(&persistence::EnumPersistenceTypes::DatabaseMaria);


    /*

pub fn config\*persistent(persistent_type:&EnumPersistenceTypes) -> &EnumPersistenceTypes {
println!("persisting: {:?}", persistent_type);
match persistent_type {
EnumPersistenceTypes::ProtocolEthereum => {
// protocol::configure_connection(persistent_type)
println!("PROTOCAL TYPE CALLED: {:?}", persistent_type);},
EnumPersistenceTypes::DatabaseArango|EnumPersistenceTypes::DatabaseMaria => {
database::configure_connection(&persistent_type)},

- => {println!("Throwing because type DNE: {:?}", persistent_type);}
  };
  persistent_type
  }
  \*/
