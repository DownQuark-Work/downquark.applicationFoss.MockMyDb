use std::time::SystemTime;
use particle_flows::particles::symbols::structs::_downquark::MetaState;

pub fn get_meta_state() -> MetaState {
    MetaState {
        user_data: "mlnck".to_string(),
        current_time: SystemTime::now(),
    }
}
