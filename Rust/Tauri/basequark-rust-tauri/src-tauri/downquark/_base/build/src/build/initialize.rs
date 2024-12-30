use std::sync::Mutex;
use tauri::{AppHandle, Manager};
use tokio::time::{sleep, Duration};

use commands::commands::cmd as dq_cmd;
use particle_flows::particles::symbols::structs::_downquark::SetupState;

// An async function that does some heavy setup task
pub async fn init_setup(app: AppHandle) -> Result<(), ()> {
    // Fake performing some heavy action for 3 seconds
    println!("Performing really heavy backend setup task...");
    sleep(Duration::from_secs(3)).await;
    println!("Backend setup task completed!");
    // Set the backend task as being completed
    // Commands can be run as regular functions as long as you take
    // care of the input arguments yourself
    dq_cmd::set_complete(
        app.clone(),
        app.state::<Mutex<SetupState>>(),
        "backend".to_string(),
    )
    .await?;
    Ok(())
}

// use crate::configuration::DevQonConfig;
// use crate::constants::enumerate::EnumStateAppView;

// mod initialize {
//   use std::collections::HashMap;
//   use toml::Value;

//   use crate::configuration::DevQonConfig;
//   use crate::helpers::{
//     build::{http, initialize::validate, paths, },
//     standards::fsio,
//   };

//   pub fn get_conf_file_paths(dq_conf:&DevQonConfig) -> HashMap<String, HashMap<String, Vec<String>>> {
//     let local_validation_paths = DevQonConfig::get_validation_paths(dq_conf.devqon.directory_parsed.home.to_string());
//     let remote_validation_paths = dq_conf.get_remote_validation_paths();
//     HashMap::from([
//       (String::from("LOCAL_VALIDATION"), local_validation_paths),
//       (String::from("REMOTE_VALIDATION"), remote_validation_paths),
//     ])
//   }

//   pub fn determine_init_page_to_view(paths_to_validate:Vec<String>) -> u8 { // has the user installed this app or any other by dq?
//     let mut total_validation_successes = 0;
//     for validating_path in paths_to_validate.iter() {
//       let validation_successes = validate::is_valid_path(validating_path);
//       total_validation_successes += validation_successes;
//     }

//     if total_validation_successes >= 4 { // devqon config file was located
//       fsio::parse_file_as_toml(&paths_to_validate[1]);
//       total_validation_successes += validate::config_contains_valid_vision(&paths_to_validate[1]);
//     }
//     total_validation_successes
//   }

//   pub fn get_stored_local_config_data(current_config_files:HashMap<String, Vec<String>>) -> (HashMap<String,Vec<String>>,Vec<String>) {
//     let mut local_app_versions = HashMap::new();
//     let mut local_usr_data: Vec<String> = Vec::new();
//     for (application, config_file) in current_config_files.iter() {
//       let config_file_data = validate::get_local_file_config_data(&config_file.join("/"));
//       let config_file_version = config_file_data[0].to_owned();
//       local_app_versions.insert(application.to_string(),vec![config_file_version,config_file.join("/").to_string()]);
//       local_usr_data.push(config_file_data[1].to_string())
//     }

//     (local_app_versions,local_usr_data)
//   }

//   pub async fn get_remote_config_data(remote_request_information:HashMap<String, Vec<String>>) -> HashMap<String,String> {
//     let mut remote_app_versions = HashMap::new();
//     for (application, remote_request) in remote_request_information.iter() {
//       let remote_req = &remote_request[0];
//       let current_remote_version = http::await_get_request(remote_req).await;
//       let current_remote_version_toml = fsio::parse_content_as_toml(current_remote_version.expect("Invalid Url Response"));
//       let toml_version_path = remote_request[1].split(".");
//       let toml_version_path_collection = toml_version_path.collect::<Vec<_>>();

//       let mut cur_walked_toml_path_value:Option<&Value> = current_remote_version_toml.get(toml_version_path_collection[0]);
//       for path_key in toml_version_path_collection.iter() {
//         if path_key.to_string() != toml_version_path_collection[0].to_string() {
//           if path_key.to_string() == "0".to_string()
//             { cur_walked_toml_path_value = cur_walked_toml_path_value.expect("invalid path key").get(0); }
//           else
//             { cur_walked_toml_path_value = cur_walked_toml_path_value.expect("invalid path key").get(path_key); }
//         }
//       }
//       remote_app_versions.insert(application.to_string(),cur_walked_toml_path_value.expect("Invalid version").to_string());
//     }
//     remote_app_versions
//   }

//   pub fn check_for_version_update(local_versions:HashMap<String,Vec<String>>,remote_versions:HashMap<String,String>) -> bool {
//     let mut update_needed = false;
//     for (application, remote_version) in remote_versions.iter() {
//       // If first load then update to most recent production version
//       let mut version_auto_update = false;
//       if local_versions[application][0] == "\"0.0.0\"" { // first load after auto-generation
//         paths::update_application_version(
//             &local_versions[application][1],
//             &local_versions[application][0].replace("\"", ""),
//             &remote_version.replace("\"", ""),
//         );
//         version_auto_update = true;
//       }

//       // Assuming that release versions will be semver only.
//       // Any hyphen would be releated with a release candidate, apha, beta, etc
//       // - ignore if found, and accept the stored version as correct
//       if !version_auto_update && !remote_version.contains("-") {
//         let local_semver_bind = local_versions[application][0].replace("\"", "");
//         let local_semver = local_semver_bind.split(".").collect::<Vec<_>>();
//         let remote_semver_bind = remote_version.replace("\"", "");
//         let remote_semver = remote_semver_bind.split(".").collect::<Vec<_>>();

//         for (i,rem_semver) in remote_semver.iter().enumerate() {
//           let rem_semver_parsed = rem_semver.parse::<u8>();
//           let loc_semver_parsed = local_semver[i].parse::<u8>();
//           if rem_semver_parsed.unwrap() > loc_semver_parsed.unwrap() { update_needed = true; }
//         }
//       }
//     }
//     update_needed
//   }
// }

// mod validate {
// // user file system access should not have pub access
//   use std::path::Path;
//   use crate::constants::enumerate::EnumStateAppView;
//   use crate::helpers::{build::{initialize::OnAppLaunchStruct, paths, },
//                             standards::fsio};

//   // user file system access should not have pub access
//   fn determine_landing_page(validation_amount:u8) -> EnumStateAppView {
//     let active_landing_page = match validation_amount {
//       1 => EnumStateAppView::LandingInitDq,
//       2|3 => EnumStateAppView::LandingInitDevqon,
//       4|5 => EnumStateAppView::LandingNoActiveVision,
//       6 => EnumStateAppView::LandingActiveVision,
//       _ => EnumStateAppView::LandingInitDq,
//     };
//     active_landing_page
//   }

//   pub fn is_valid_path(path_str:&str) -> u8 {
//     let mut validated_steps = 0;
//     let file_path = Path::new(path_str);
//     let path_exists = file_path.try_exists().expect("path DNE");
//     if path_exists {
//       validated_steps += 1;
//       if file_path.is_file() { validated_steps += 1; }
//     } else {
//       paths::create_config_file(file_path);
//       println!("FILE DNE");
//     }
//     validated_steps
//   }

//   pub fn config_contains_valid_vision(path_str:&str) -> u8 {
//     // println!("config_contents_bind: {config_contents_bind:?}");
//     let toml_parse = fsio::parse_file_as_toml(path_str);
//     let mut additional_validations = 0;
//     let current_directory = Path::new(path_str).parent().expect("directory DNE");
//     let vision_toml_file_val = &toml_parse["devqon"]["vision"][0]["config_toml_file_path"];
//     let binding = vision_toml_file_val.as_str().expect("invalid file");
//     let vision_toml_file = Path::new(current_directory).join(binding);
//     if binding != "invalid file" { additional_validations += 1; }
//     if vision_toml_file_val.as_str() != Some("") {
//       let vision_toml_file_exists = vision_toml_file.try_exists().expect("path DNE");
//       if vision_toml_file_exists { additional_validations += 1; }
//     }

//     additional_validations
//   }

//   pub fn get_local_file_config_data(file_path:&str) -> Vec<String> {
//     let toml_parse = fsio::parse_file_as_toml(file_path);
//     let vision_toml_file_val;
//     let usr_toml_file_val;
//     if file_path.contains("_devqon") { // TODO: unharcode this
//       usr_toml_file_val = &toml_parse["devqon"]["session"]["last_active"];
//       vision_toml_file_val = &toml_parse["devqon"]["vision"][0]["config_toml_file_path"];
//     } else {
//       usr_toml_file_val = &toml_parse["DownQuark"]["User"]["db_lookup"];
//       vision_toml_file_val = &toml_parse["DownQuark"]["version"];
//     }
//     vec![vision_toml_file_val.to_string(),usr_toml_file_val.to_string()]
//   }

//   pub fn pre_app_launch(validation_amt:u8,new_version_available:bool,stored_usr_config:Vec<String>) -> OnAppLaunchStruct {
//     let page_in_queue = determine_landing_page(validation_amt);

//     OnAppLaunchStruct {
//       init_view:page_in_queue,
//       version_update_available:new_version_available,
//       db_usr_lookup:stored_usr_config[1].to_owned(),
//       db_last_session:stored_usr_config[0].to_owned(),
//     }
//   }
// }

// pub struct OnAppLaunchStruct {
//   init_view:EnumStateAppView,
//   version_update_available:bool,
//   db_usr_lookup:String,
//   db_last_session:String,
// }
// impl OnAppLaunchStruct {
//   pub fn get_app_launch_conf(&self) -> (&EnumStateAppView, bool) {
//     (&self.init_view,self.version_update_available)
//   }
//   pub fn get_stored_usr_info(&self) -> (&String,&String) {
//     (&self.db_usr_lookup,&self.db_last_session)
//   }
// }

// pub async fn configure_app_launch_config(dq_conf:&DevQonConfig) -> OnAppLaunchStruct {
//   // version and previous install of any dq app
//   let dq_config_file_paths = initialize::get_conf_file_paths(dq_conf);
//   let local_config_file_paths = vec![ dq_config_file_paths["LOCAL_VALIDATION"]["_DQ"].join("/"), dq_config_file_paths["LOCAL_VALIDATION"]["DEVQON"].join("/") ];
//   let determine_page_to_view = initialize::determine_init_page_to_view(local_config_file_paths);
//   let local_config_information_paths = &dq_config_file_paths["LOCAL_VALIDATION"];
//   let local_config_information = initialize::get_stored_local_config_data(local_config_information_paths.clone());
//   let remote_config_information_paths = &dq_config_file_paths["REMOTE_VALIDATION"];
//   let remote_config_information = initialize::get_remote_config_data(remote_config_information_paths.clone()).await;

//   let local_version_information: std::collections::HashMap<String, Vec<String>> = local_config_information.0;
//   let new_version_available = initialize::check_for_version_update(local_version_information,remote_config_information);

//   let local_usr_information = local_config_information.1;
//   // println!("local_usr_information: {local_usr_information:?}");
//   println!("IF FAILING REMEMBER TO LAUNCH DB");
//   validate::pre_app_launch(determine_page_to_view ,new_version_available, local_usr_information)
// }
