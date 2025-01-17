use config::{Config, ConfigError, Environment, File};
use std::env;
use std::collections::HashMap;

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
pub struct DownQuarkStruct {
  application: String,
  root_directory:Vec<String>,
  repository:ApplicationRepo,
}

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
struct AuthenticationCredentials {
  user: String,
  pass: String,
  additional: Vec<String>
}

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
struct ConnectionConfig {
  host: String,
  port: String,
  additional: Vec<String>
}

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
struct RepositoryConfig {
  pub url: String,
  pub semver_key: String,
}

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
struct ApplicationRepo {
  main: String,
  pub conf:RepositoryConfig,
}

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
struct DownQuarkDirectory {
  application: Vec<String>,
  home: Vec<String>,
  resource: Vec<String>,
}

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
pub struct DownQuarkParsedDirectory {
  application: String,
  pub home: String,
  resource: String,
}

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
struct DownQuarkLogging {
  level: String,
  output: Vec<String>,
}

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
pub struct DownQuark {
  auto_update: bool,
  debug: bool,
  directory: DownQuarkDirectory,
  pub directory_parsed: DownQuarkParsedDirectory,
  logging: DownQuarkLogging,
  persistence:Persistence,
  repository:ApplicationRepo,
}

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
struct DatabaseMaria{
  id: String,
  auth:AuthenticationCredentials,
  connection:ConnectionConfig,
}

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
struct DatabaseArango{
  id: String,
  url: String,
  auth:AuthenticationCredentials,
}

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
struct Database {
  arango:DatabaseArango,
  maria:DatabaseMaria,
}

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
pub struct Persistence {
  database:Database,
}

#[derive(Debug,serde::Deserialize)]
#[allow(unused)]
pub struct DownQuarkConfig {
  pub _dq:DownQuark,
  pub downquark:DownQuarkStruct,
}

// ¡¡TODO: refactor _where_ state is managed for helpers>state>configuration.rs::set_app_configuration'!!
// --> which then calls this::make_config <--

impl DownQuarkConfig {
  pub fn make_config(sys_conf_paths: HashMap<&str, String>) -> Result<Self, ConfigError> {
    let config_directory = sys_conf_paths["APPLICATION"].to_owned() + "/downquark/src-tauri/config/"; // concat full application path with config dir path
    let run_env = env::var("RUN_ENV").unwrap_or_else(|_| "development".into()); // Default to 'development' env
    let downquark_conf = Config::builder() // as sources are added below duplicate keys will overwrite previously defined values
        .add_source(File::with_name(&(config_directory.clone() + "_default"))) // default configuration file
        .add_source(File::with_name(&(config_directory.clone() + &format!("{}", run_env))) // file with env overrides - defaulted to 'development' above
                        .required(false), ) // optional file - does not throw if file DNE
        .add_source( // optional local configuration file - ensure locality by omitting from repository
                     File::with_name(&(config_directory.clone() + "env/database.secret")).required(false))
        // File::with_name(&(config_directory.clone()+"local")).required(false))
        // below applies cli variables specified by given prefix
        .add_source(Environment::with_prefix("dq")) // `DQ_DEBUG=1 ./target/app` would set the `debug` key to true
        .add_source(Environment::with_prefix("downquark")) // `DEVQON_DEBUG=0 DQ_DEBUG=1 ./target/app` would immediately overwrite the `debug` key to be false
        .set_override("downquark.directory_parsed.home", "TEMPORARY::sys_conf_paths[HOME]--UNCOMMENT_BELOW_WHEN_READY".to_string())? // programmatically change settings after parsing the `sys_conf_paths`
        .set_override("downquark.directory_parsed.application", "TEMPORARY::sys_conf_paths[APPLICATION]--UNCOMMENT_BELOW_WHEN_READY".to_string())?
        .set_override("downquark.directory_parsed.resource", "TEMPORARY::sys_conf_paths[RESOURCE]--UNCOMMENT_BELOW_WHEN_READY".to_string())?
        // .set_override("downquark.directory_parsed.home", sys_conf_paths["HOME"].to_string())? // programmatically change settings after parsing the `sys_conf_paths`
        // .set_override("downquark.directory_parsed.application", sys_conf_paths["APPLICATION"].to_string())?
        // .set_override("downquark.directory_parsed.resource", sys_conf_paths["RESOURCE"].to_string())?
        .build()?;

    // deserialize, freeze, and return configuration
    downquark_conf.try_deserialize()
  }
}

mod configuration {
  fn internal() {}
}
