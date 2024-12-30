use tauri::async_runtime::spawn;
use tauri::Manager;

use build::build::initialize as dq_init;
use commands::commands::cmd as dq_cmd;

pub fn run() { // Don't write code before Tauri starts, write it in the setup hook instead!
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![
        dq_cmd::greet,
        dq_cmd::set_complete
    ])
      // Use the setup hook to execute setup related tasks
    .setup(|app| { // Runs before the main loop, so no windows are yet created
      use state::state as dq_state;
      #[cfg(debug_assertions)] // only include this code on debug builds
        { app.get_webview_window("splashscreen").unwrap().open_devtools();
          app.get_webview_window("main").unwrap().open_devtools(); }
      dq_state::initialize_app_states(app); // configure initial states for the application
      spawn( // Spawn setup as a non-blocking task so windows can be created while it executes
        dq_init::init_setup(app.handle().clone()));
      Ok(()) // The hook expects an Ok result
    })
    .run(tauri::generate_context!()) // Run the app
    .expect("error while running tauri application");
}
