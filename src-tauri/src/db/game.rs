use chrono::{DateTime, Utc};
use gamite_core::{GameData, GameInstallStatus, IsGameLibraryRef};
use sea_orm::entity::prelude::*;
use sea_orm::{DeriveActiveEnum, DeriveEntityModel, EnumIter};
#[derive(EnumIter, DeriveActiveEnum, Copy, Clone, Debug, PartialEq, Eq)]
#[sea_orm(rs_type = "u8", db_type = "Integer")]
#[repr(u8)]
pub enum DbGameInstallStatus {
    Installed = 0,
    Installing = 1,
    InLibrary = 2,
    Queued = 3,
}
impl From<GameInstallStatus> for DbGameInstallStatus {
    fn from(value: GameInstallStatus) -> Self {
        match value {
            GameInstallStatus::Installed => Self::Installed,
            GameInstallStatus::Installing => Self::Installing,
            GameInstallStatus::InLibrary => Self::InLibrary,
            GameInstallStatus::Queued => Self::Queued,
        }
    }
}
impl Into<GameInstallStatus> for DbGameInstallStatus {
    fn into(self) -> GameInstallStatus {
        match self {
            Self::Installed => GameInstallStatus::Installed,
            Self::Installing => GameInstallStatus::Installing,
            Self::InLibrary => GameInstallStatus::InLibrary,
            Self::Queued => GameInstallStatus::Queued,
        }
    }
}
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "games")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub description: String,
    pub play_time_secs: i64,
    pub install_status: DbGameInstallStatus,
    pub release_date: Option<DateTime<Utc>>,
    pub last_played: Option<DateTime<Utc>>,
    pub library_type: String,
    pub library_id: String,
}
impl Default for Game {
    fn default() -> Self {
        Self {
            id: 0,
            name: String::new(),
            description: String::new(),
            play_time_secs: 0,
            install_status: DbGameInstallStatus::InLibrary,
            last_played: None,
            release_date: None,
            library_type: String::new(),
            library_id: String::new(),
        }
    }
}

pub type Game = Model;
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::game_genres::Entity")]
    GameGenres,
}

impl Related<super::game_genres::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::GameGenres.def()
    }
}
impl ActiveModelBehavior for ActiveModel {}

impl IsGameLibraryRef for Game {
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
impl Into<GameData> for Game {
    fn into(self) -> GameData {
        GameData {
            library_id: self.library_id,
            icon_url: None,
            description: self.description,
            name: self.name,
            header_url: None,
            id: self.id,
            hero_url: None,
            install_status: self.install_status.into(),
            last_played: self.last_played.into(),
            library_type: self.library_type,

            logo_url: None,
            play_time_secs: self.play_time_secs,
            release_date: self.release_date.into(),
        }
    }
}
