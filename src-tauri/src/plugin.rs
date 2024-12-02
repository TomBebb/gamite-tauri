use gamite_core::{
    BaseAddon, BoxFuture, BoxStream, GameInstallStatus, GameLibrary, GameLibraryRef,
    ScannedGameLibraryMetadata,
};
use std::rc::Rc;
use libloading::Library;

/// A proxy object which wraps a [`Function`] and makes sure it can't outlive
/// the library it came from.
pub struct GameLibraryProxy {
    pub inner: Box<dyn GameLibrary>,
    pub _lib: Rc<Library>,
}
impl BaseAddon for GameLibraryProxy {
    fn get_id(&self) -> &'static str {
        self.inner.get_id()
    }
}
impl GameLibrary for GameLibraryProxy {
    fn launch(&self, game: &GameLibraryRef) -> BoxFuture<'static> {
        self.inner.launch(game)
    }

    fn scan(&self) -> BoxStream<'static, ScannedGameLibraryMetadata> {
        self.inner.scan()
    }

    fn install(&self, game: &GameLibraryRef) -> BoxFuture<'static> {
        self.inner.install(game)
    }

    fn uninstall(&self, game: &GameLibraryRef) -> BoxFuture<'static> {
        self.inner.uninstall(game)
    }

    fn check_install_status(&self, game: &GameLibraryRef) -> BoxFuture<'static, GameInstallStatus> {
        self.inner.check_install_status(game)
    }
}
