use gamite_core::{GameInstallStatus, IsGameLibraryRef};
use std::cell::LazyCell;
use std::sync::Arc;
use std::time::SystemTime;
use async_duckdb;

table! {
    games {
        id -> Int8,
        name -> Text,
        install_status -> Int2,
        release_date -> Nullable<Timestamp>,
        last_played -> Nullable<Timestamp>,
        play_time_secs -> Int8,
        library_type -> Text,
        library_id -> Text,
        description -> Text,

        icon_url -> Nullable<Text>,
        header_url -> Nullable<Text>,
        logo_url -> Nullable<Text>,
        hero_url -> Nullable<Text>
    }
}

pub struct Game {
    pub id: i64,
    pub name: Arc<str>,
    pub play_time_secs: i64,
    pub install_status: GameInstallStatus,
    pub release_date: Option<SystemTime>,
    pub last_played: Option<SystemTime>,
    pub library_type: Arc<str>,
    pub library_id: Arc<str>,
}

impl IsGameLibraryRef for Game {
    fn get_name(&self) -> &Arc<str> {
        &self.name
    }

    fn get_library_type(&self) -> &Arc<str> {
        &self.library_type
    }

    fn get_library_id(&self) -> &Arc<str> {
        &self.library_id
    }
}


const DB_POOL: LazyCell<Pool<>>
const DB_URL: LazyCell<String> =
    LazyCell::new(|| format!("sqlite://{}", gamite_core::DB_FILE.to_string_lossy()));
fn establish(db_url: &str) -> ConnectionResult<SyncConnectionWrapper<SqliteConnection>> {
    let conn = SqliteConnection::establish(db_url)?;
    // It is necessary to specify the specific inner connection type because of inference issues
    Ok(SyncConnectionWrapper::<SqliteConnection>::new(conn))
}

fn auto_connect() -> ConnectionResult<SyncConnectionWrapper<SqliteConnection>> {
    establish(&format!(
        "sqlite://{}",
        gamite_core::DB_FILE.to_string_lossy()
    ))
    .await
}
