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
use tokio::runtime::Builder;

mod db;
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
