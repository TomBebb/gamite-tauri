pub mod game;
mod game_genres;
mod genre;
use sea_orm::{ConnectOptions, ConnectionTrait, Database, DatabaseConnection};
use tauri::{App, Manager};
use tokio::fs;

pub struct AppDbState(pub DatabaseConnection);
pub async fn init(app: &App) -> DatabaseConnection {
    log::debug!("initializing database");
    let mut path = app.path().app_data_dir().expect("could not get data_dir");
    fs::create_dir_all(&path).await.unwrap();
    path.push("db.sqlite");
    log::debug!("initializing database @ {:?}", path);
    let needs_init = !path.is_file();

    let mut opts = ConnectOptions::new(format!("sqlite:{}?mode=rwc", path.to_string_lossy()));
    opts.max_connections(100)
        .min_connections(5)
        .sqlx_logging(true)
        .sqlx_logging_level(log::LevelFilter::Info);

    let conn = Database::connect(opts).await.unwrap();
    if needs_init {
        conn.execute_unprepared(include_str!("init.sql"))
            .await
            .unwrap();
        log::info!("initialized game database");
    }
    conn
}
