// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_games(db_state: tauri::State<'_, AppDbState>) -> Result<Vec<GameData>, String> {
    log::info!("Getting games");
    let db = &db_state.0;

    let raw: Vec<game::Game> = game::Entity::find().all(db).await.unwrap_or_default();

    Ok(raw.into_iter().map(Into::into).collect())
}

use crate::db::{game, AppDbState};
use env_logger::Env;
use gamite_core::GameData;
use sea_orm::EntityTrait;
use tauri::Manager;
use tokio::runtime::Builder;
mod db;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_gamepad::init())
        .invoke_handler(tauri::generate_handler![greet, get_games])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    let runtime = Builder::new_multi_thread().enable_all().build().unwrap();
    runtime.block_on(async {
        let db = db::init(&app).await;
        app.manage(AppDbState(db));
        log::info!("Added to app manager");
    });

    app.run(|_, _| {})
}
