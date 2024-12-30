use std::time::SystemTime;

pub struct SetupState {
    pub frontend_task: bool,
    pub backend_task: bool,
}

pub struct MetaState {
    pub user_data: String,
    pub current_time:SystemTime,
}
