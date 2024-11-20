use std::cell::LazyCell;
use std::future::Future;
use std::path::PathBuf;
use tokio_stream::Stream;

mod models;

pub use models::*;

pub const BASE_DATA_DIR: LazyCell<PathBuf> = LazyCell::new(|| {
    dirs::data_dir()
        .expect("No data directory set!")
        .join("gamite")
});

pub const DB_FILE: LazyCell<PathBuf> = LazyCell::new(|| BASE_DATA_DIR.join("gamite.db"));

pub trait BaseAddon {
    const TYPE: &'static str;
}
pub trait GameLibrary: BaseAddon {
    fn launch(game: &GameLibraryRef) -> impl Future;
    fn scan() -> impl Stream<Item = ScannedGameLibraryMetadata>;
    fn install(game: &GameLibraryRef) -> impl Future;
    fn uninstall(game: &GameLibraryRef) -> impl Future;
    fn check_install_status(game: &GameLibraryRef) -> impl Future<Output = GameInstallStatus>;
}
