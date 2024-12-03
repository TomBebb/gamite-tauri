// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_games(state: tauri::State<'_, AppState>) -> Vec<GameData> {
    log::info!("Getting games");
    sqlx::query_as::<_, DbGame>("SELECT * FROM games")
        .fetch(&state.0)
        .try_collect()
        .await
        .map_err(|e| format!("Failed to get todos {}", e))?
        .unwrap();
    vec![GameData {
        library_id: "152310".into(),
        library_type: "steam".into(),
        name: "Atelier Escha & Logy Alchemists of the Dusk Sky DX".into(),
        play_time_secs: 0,
        description: "Traverse the land and craft stuff".into(),
        icon_url: Some("file:///home/tom/.local/share/org.gamite.app/996580_icon.jpg".into()),
        install_status: gamite_core::GameInstallStatus::Installed.into(),
        ..Default::default()
    }]
}

use crate::db::{AppState, DbGame};
use gamite_core::GameData;
use tauri::Manager;
use tokio::runtime::Builder;

mod db;
pub async fn run() {
    env_logger::init();
    let runtime = Builder::new_multi_thread().enable_all().build().unwrap();
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_gamepad::init())
        .invoke_handler(tauri::generate_handler![greet, get_games])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");
    let db = db::setup_db(&app).await;
    app.manage(db::AppState(db));
    app.run(|_, _| {});
}
