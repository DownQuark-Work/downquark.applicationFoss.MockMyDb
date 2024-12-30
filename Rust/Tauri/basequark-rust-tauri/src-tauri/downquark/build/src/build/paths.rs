mod paths {}

// use tauri::{AppHandle,Manager};
// use std::{ collections::HashMap,
//           path::Path, };

// use crate::helpers::standards::fsio;
// use crate::constants::templates;

// pub fn get_sys_paths(app_handle: &AppHandle) -> HashMap<&str, String> {
//   let home_directory_bind = app_handle.path().parse("$HOME");
//   let home_directory = home_directory_bind.expect("no folder exists").to_str().unwrap().to_string();
//   let resource_directory = app_handle.path().parse("$RESOURCE").expect("no folder exists");
//   let application_directory = resource_directory.parent().expect("root dir").parent().expect("root dir").parent().expect("root dir").parent();
//   // println!("PATH:: application_directory: {:?}", application_directory.expect("root dir").to_str().unwrap());
//   // println!("PATH:: home_directory: {:?}", home_directory);
//   // println!("PATH:: resource_directory: {:?}",resource_directory);
//   let app_dir_bind = application_directory.expect("dir DNE").to_str().unwrap();
//   let resource_dir_bind = resource_directory.to_str().unwrap();
//   HashMap::from([
//     ("HOME", home_directory),
//     ("RESOURCE", resource_dir_bind.to_string()),
//     ("APPLICATION", app_dir_bind.to_string()),
//   ])
// }

// pub fn create_config_file(file_path:&Path) {
//   let string_file_path = file_path.to_str().unwrap().to_string();
//   let string_file_dir = file_path.parent().expect("root dir").to_str().unwrap().to_string();
//   let string_file_name = file_path.file_name().expect("path is directory").to_str().unwrap();
//   let template_content = templates::make_template_config(string_file_name);
//   let _written_file = fsio::create_dir_and_write_file(string_file_dir,string_file_path,template_content);
// }

// pub fn update_application_version(file_path:&str,previous_app_version:&str,new_app_version:&str) {
//   let file_content = fsio::read_file_string(file_path);
//   let updated_file_content = file_content.expect("no match found").replace(previous_app_version,new_app_version);
//   let _ = fsio::overwrite_file(file_path,&updated_file_content);
// }
