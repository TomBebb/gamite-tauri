use std::fmt;
use std::time::{Duration, SystemTime};
use url::Url;

pub trait IsGameLibraryRef {
    fn get_name(&self) -> &str;
    fn get_library_type(&self) -> &str;
    fn get_library_id(&self) -> &str;
}
#[derive(Debug, Clone, Eq, PartialEq)]
pub struct GameLibraryRef {
    pub name: String,
    pub library_type: String,
    pub library_id: String,
}
impl IsGameLibraryRef for GameLibraryRef {
    fn get_name(&self) -> &str {
        &self.name
    }
    fn get_library_type(&self) -> &str {
        &self.library_type
    }

    fn get_library_id(&self) -> &str {
        &self.library_id
    }
}
impl fmt::Display for GameLibraryRef {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "{} ({}: {})",
            self.name, self.library_type, self.library_id
        )
    }
}

#[derive(Debug, Copy, Clone, Eq, PartialEq)]
#[repr(u8)]
pub enum GameInstallStatus {
    Installed,
    Installing,
    InLibrary,
    Queued,
}
impl Default for GameInstallStatus {
    fn default() -> Self {
        GameInstallStatus::InLibrary
    }
}

#[derive(Default, Debug, Clone, Eq, PartialEq)]
pub struct ScannedGameLibraryMetadata {
    pub name: String,
    pub library_type: String,
    pub library_id: String,

    pub last_played: Option<SystemTime>,
    pub install_status: GameInstallStatus,
    pub playtime: Duration,
    pub icon_url: Option<Url>,
}
impl IsGameLibraryRef for ScannedGameLibraryMetadata {
    fn get_name(&self) -> &str {
        &self.name
    }
    fn get_library_type(&self) -> &str {
        &self.library_type
    }

    fn get_library_id(&self) -> &str {
        &self.library_id
    }
}
