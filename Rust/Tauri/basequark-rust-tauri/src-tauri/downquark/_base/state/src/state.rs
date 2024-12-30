mod state {
    pub fn add_init_states(app: &mut tauri::App) {
        use crate::immutable::_downquark as immutable_state;
        use crate::mutable::_downquark as mutable_state;
        use tauri::Manager;

        // - static
        // app.manage(state::_devqon::set_user_session()); // set initial static state - make sure values are populated
        app.manage(immutable_state::get_meta_state());
        // - dynamic
        // app.manage(state::_devqon::ActiveVision{ current_vision: Default::default() }); // set initial mutable state with default values - we can mutate
        app.manage(mutable_state::get_setup_state()); // set initial static state - make sure values are populated
    }
}

pub fn initialize_app_states(app: &mut tauri::App) {
    // TODO: switch by page here -- call from mod when ready
    state::add_init_states(app);
}
