#![feature(let_chains)]
use crate::db::{game, AppDbState};
use gamite_core::GameData;
use gilrs::{Button, EventType};
use log::LevelFilter;
use sea_orm::EntityTrait;
use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconEvent};
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    AppHandle, Emitter, Manager,
};
use tokio::runtime::Builder;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[derive(Deserialize, Serialize, Copy, Clone, Debug)]
enum MappedButton {
    Down,
    Up,
    Right,
    Left,
    Confirm,
    Back,
    ShowMenu,
}

static RUN_GAMEPAD_PROC: AtomicBool = AtomicBool::new(false);

#[tauri::command]
fn listen_gamepad_input(app: AppHandle) {
    RUN_GAMEPAD_PROC.store(true, Ordering::Relaxed);

    tokio::task::spawn_blocking(move || {
        log::debug!("RUN_GAMEPAD_PROC");
        let handle_btn = |btn: MappedButton| app.emit("on-input", btn).unwrap();

        let mut client = gilrs::Gilrs::new().unwrap();
        while RUN_GAMEPAD_PROC.load(Ordering::Relaxed)
            && let Some(gilrs::Event { id, event, .. }) = client.next_event()
        {
            log::debug!("Gamepad event: {} {:?}", id, event);
            match event {
                EventType::ButtonPressed(Button::DPadLeft, _) => handle_btn(MappedButton::Left),
                EventType::ButtonPressed(Button::DPadRight, _) => handle_btn(MappedButton::Right),
                EventType::ButtonPressed(Button::DPadUp, _) => handle_btn(MappedButton::Up),
                EventType::ButtonPressed(Button::DPadDown, _) => handle_btn(MappedButton::Down),
                EventType::ButtonPressed(Button::Start, _) => handle_btn(MappedButton::ShowMenu),
                EventType::ButtonPressed(Button::South, _) => handle_btn(MappedButton::Confirm),
                ev => log::debug!("Unhandled event {:?}", ev),
            }
        }
    });
}
#[tauri::command]
async fn cancel_gamepad_input() {
    RUN_GAMEPAD_PROC.store(false, Ordering::Relaxed);
}
#[tauri::command]
async fn get_games(db_state: tauri::State<'_, AppDbState>) -> Result<Vec<GameData>, String> {
    log::info!("Getting games");
    let db = &db_state.0;

    let raw: Vec<game::Game> = game::Entity::find().all(db).await.unwrap_or_default();

    Ok(raw.into_iter().map(Into::into).collect())
}

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
    let level: LevelFilter = if cfg!(debug_assertions) {
        LevelFilter::Debug
    } else {
        LevelFilter::Info
    };
    let app = tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .level_for("gamite", level)
                .build(),
        )
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_games,
            listen_gamepad_input,
            cancel_gamepad_input
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    let restore_i = MenuItem::with_id(&app, "restore", "Restore", true, None::<&str>).unwrap();
    let toggle_big_screen_i = MenuItem::with_id(
        &app,
        "toggle_bs",
        "Toggle big-screen mode",
        true,
        None::<&str>,
    )
    .unwrap();
    let quit_i = MenuItem::with_id(&app, "quit", "Quit", true, None::<&str>).unwrap();
    let menu = Menu::with_items(&app, &[&restore_i, &toggle_big_screen_i, &quit_i]).unwrap();

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
            "toggle_bs" => app.emit("toggle-bigscreen", ()).unwrap(),
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
    let runtime = Builder::new_multi_thread().enable_all().build().unwrap();
    runtime.block_on(async {
        let db = db::init(&app).await;
        app.manage(AppDbState(db));
        log::info!("Added to app manager");
    });

    app.run(|_, _| {})
}
