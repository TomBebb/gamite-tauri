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
use tauri::tray::{MouseButton, MouseButtonState, TrayIconEvent};
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    AppHandle, Manager,
};
use tokio::runtime::Builder;
mod db;

fn restore(app: &AppHandle) -> tauri::Result<()> {
    if let Some(window) = app.get_webview_window("main") {
        window.hide()?;
        window.show()?;
        window.set_focus()?;
    }
    Ok(())
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_gamepad::init())
        .invoke_handler(tauri::generate_handler![greet, get_games])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    let restore_i = MenuItem::with_id(&app, "restore", "Restore", true, None::<&str>).unwrap();
    let quit_i = MenuItem::with_id(&app, "quit", "Quit", true, None::<&str>).unwrap();
    let menu = Menu::with_items(&app, &[&restore_i, &quit_i]).unwrap();

    let tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => {
                log::debug!("quit menu item was clicked");
                app.exit(0);
            }
            "restore" => restore(app).unwrap(),
            _ => {
                log::debug!("menu item {:?} not handled", event.id);
            }
        })
        .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } => {
                log::debug!("left click pressed and released");
                let app = tray.app_handle();
                restore(app).unwrap();
            }
            _ => {
                log::debug!("unhandled tray event {event:?}");
            }
        })
        .build(&app)
        .unwrap();
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();
    let runtime = Builder::new_multi_thread().enable_all().build().unwrap();
    runtime.block_on(async {
        let db = db::init(&app).await;
        app.manage(AppDbState(db));
        log::info!("Added to app manager");
    });

    app.run(|_, _| {})
}
