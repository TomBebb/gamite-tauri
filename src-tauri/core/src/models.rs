use std::fmt;
use std::sync::Arc;
use std::time::{Duration, SystemTime};
use url::Url;

pub trait IsGameLibraryRef {
    fn get_name(&self) -> &Arc<str>;
    fn get_library_type(&self) -> &Arc<str>;
    fn get_library_id(&self) -> &Arc<str>;
}
#[derive(Debug, Clone, Eq, PartialEq)]
pub struct GameLibraryRef {
    pub name: Arc<str>,
    pub library_type: Arc<str>,
    pub library_id: Arc<str>,
}
impl IsGameLibraryRef for GameLibraryRef {
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
    pub name: Arc<str>,
    pub library_type: Arc<str>,
    pub library_id: Arc<str>,

    pub last_played: Option<SystemTime>,
    pub install_status: GameInstallStatus,
    pub playtime: Duration,
    pub icon_url: Option<Url>,
}
impl IsGameLibraryRef for ScannedGameLibraryMetadata {
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
