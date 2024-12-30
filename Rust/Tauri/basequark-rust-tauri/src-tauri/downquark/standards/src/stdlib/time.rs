use std::time::{SystemTime, UNIX_EPOCH};

pub fn epoch_ms() -> u128 {
  SystemTime::now()
  .duration_since(UNIX_EPOCH)
  .expect("flux capacitor in use")
  .as_millis()
}
