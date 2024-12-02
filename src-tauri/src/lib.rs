// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_games() -> Vec<Game> {
    log::info!("Getting games");
    vec![Game {
        library_id: "152310".into(),
        library_type: "Atelier Escha & Logy Alchemists of the Dusk Sky DX".into(),
        name: "Demo".into(),
        play_time_secs: 0,
        install_status: gamite_core::GameInstallStatus::Installed.into(),
        ..Default::default()
    }]
}

use crate::db::Game;
use crate::plugin::GameLibraryProxy;
use gamite_core::{GameLibrary, PluginDeclaration};
use libloading::Library;
use std::collections::HashMap;
use std::ffi::OsStr;
use std::rc::Rc;
use std::{fs, io};
use tokio::runtime::Builder;

mod db;
mod plugin;

#[derive(Default)]
pub struct ExternalAddons {
    game_libs: HashMap<String, GameLibraryProxy>,
    libraries: Vec<Rc<Library>>,
}

impl ExternalAddons {
    pub fn new() -> ExternalAddons {
        ExternalAddons::default()
    }

    pub fn get_keys(&self) -> Vec<&str> {
        self.game_libs.keys().map(String::as_str).collect()
    }
    pub fn get_game_library(&self, name: &str) -> Result<&GameLibraryProxy, String> {
        self.game_libs
            .get(name)
            .ok_or_else(|| format!("\"{}\" not found", name))
    }

    /// Load a plugin library and add all contained functions to the internal
    /// function table.
    ///
    /// # Safety
    ///
    /// A plugin library **must** be implemented using the
    /// [`plugins_core::plugin_declaration!()`] macro. Trying manually implement
    /// a plugin without going through that macro will result in undefined
    /// behaviour.
    pub unsafe fn load<P: AsRef<OsStr>>(&mut self, library_path: P) -> io::Result<()> {
        // load the library into memory
        let library = Rc::new(Library::new(library_path).unwrap());

        // get a pointer to the plugin_declaration symbol.
        let decl = library
            .get::<*mut PluginDeclaration>(b"plugin_declaration\0")
            .unwrap()
            .read();

        // version checks to prevent accidental ABI incompatibilities
        if decl.rustc_version != gamite_core::RUSTC_VERSION
            || decl.core_version != gamite_core::CORE_VERSION
        {
            return Err(io::Error::new(io::ErrorKind::Other, "Version mismatch"));
        }

        let mut registrar = PluginRegistrar::new(Rc::clone(&library));

        (decl.register)(&mut registrar);

        // add all loaded plugins to the functions map
        self.game_libs.extend(registrar.game_libs);
        // and make sure ExternalFunctions keeps a reference to the library
        self.libraries.push(library);

        Ok(())
    }
}
struct PluginRegistrar {
    game_libs: HashMap<String, GameLibraryProxy>,
    lib: Rc<Library>,
}

impl PluginRegistrar {
    fn new(lib: Rc<Library>) -> PluginRegistrar {
        PluginRegistrar {
            lib,
            game_libs: HashMap::default(),
        }
    }
}

impl gamite_core::PluginRegistrar for PluginRegistrar {
    fn register_library(&mut self, name: &str, lib: Box<dyn GameLibrary>) {
        let proxy = GameLibraryProxy {
            inner: lib,
            _lib: Rc::clone(&self.lib),
        };
        self.game_libs.insert(name.to_string(), proxy);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    env_logger::init();
    let runtime = Builder::new_multi_thread().enable_all().build().unwrap();
    runtime.block_on(db::init());

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_gamepad::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
