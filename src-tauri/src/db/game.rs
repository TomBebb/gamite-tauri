use chrono::NaiveDateTime;
use gamite_core::GameInstallStatus;
use serde::{Deserialize, Serialize};
use sqlx::Error;

#[derive(Debug, Copy, Clone, Eq, PartialEq, Serialize, Deserialize, sqlx::Type)]
#[repr(u8)]
pub enum DbGameInstallStatus {
    Installed,
    Installing,
    InLibrary,
    Queued,
}
impl Into<GameInstallStatus> for DbGameInstallStatus {
    fn into(self) -> GameInstallStatus {
        unsafe { std::mem::transmute(self) }
    }
}

impl From<GameInstallStatus> for DbGameInstallStatus {
    fn from(value: GameInstallStatus) -> Self {
        unsafe { std::mem::transmute(value) }
    }
}
#[derive(Debug, Clone, Eq, PartialEq, Serialize, Deserialize, sqlx::Type)]
pub struct DbGame {
    id: i32,
    name: String,
    library_id: String,
    library_type: String,
    description: Option<String>,
    play_time_secs: i32,
    release_date: Option<NaiveDateTime>,
    last_played: Option<NaiveDateTime>,
}
impl sqlx::FromRow for DbGame {
    fn from_row(row: &'r R) -> Result<Self, Error> {
        todo!()
    }
}
