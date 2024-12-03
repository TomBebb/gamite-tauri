use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use sqlx::{ConnectOptions, Pool, Sqlite};
use tauri::{App, Manager};
pub type Db = Pool<Sqlite>;

pub struct AppState(pub Db);

pub async fn setup_db(app: &App) -> Db {
    let mut path = app.path().app_data_dir().expect("could not get data_dir");
    match std::fs::create_dir_all(path.clone()) {
        Ok(_) => {}
        Err(err) => {
            panic!("error creating directory {}", err);
        }
    };
    path.push("db.sqlite");
    let result = SqliteConnectOptions::new()
        .filename(&path)
        .create_if_missing(true)
        .connect()
        .await;
    match result {
        Ok(_) => println!("database file created"),
        Err(err) => panic!("error creating databse file {}", err),
    }
    let db = SqlitePoolOptions::new()
        .connect(path.to_str().unwrap())
        .await
        .unwrap();

    sqlx::migrate!("./migrations").run(&db).await.unwrap();
    db
}
