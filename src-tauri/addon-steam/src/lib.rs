mod kv;

use crate::kv::ast::KvValue;
use crate::kv::parser::full_parse;
use async_stream::stream;
use gamite_core::GameInstallStatus::Queued;
use gamite_core::{
    BaseAddon, GameInstallStatus, GameLibrary, GameLibraryRef, ScannedGameLibraryMetadata,
};
use log::*;
use once_cell::sync::Lazy;
use std::env;
use std::path::PathBuf;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tokio::fs;
use tokio_stream::Stream;

pub struct SteamLibrary;

const BASE_PATH: Lazy<PathBuf> = Lazy::new(|| {
    if cfg!(windows) {
        "C:/Program Files (x86)/Steam".into()
    } else {
        let home = PathBuf::from(env::var("HOME").expect("HOME not found"));
        home.join(if cfg!(target_os = "linux") {
            ".local/share/Steam/"
        } else if cfg!(target_os = "macos") {
            "Library/Application Support/Steam"
        } else {
            unimplemented!()
        })
    }
});
const APPS_PATH: Lazy<PathBuf> = Lazy::new(|| BASE_PATH.join("steamapps"));
async fn run_cmd(cmd: &str, id: &str) {
    let raw = format!("steam://{}//{}", cmd, id);
    debug!("steam cmd: {}", raw);
    open::that_in_background(&raw);
}
fn from_epoch(secs: u64) -> SystemTime {
    UNIX_EPOCH + Duration::from_secs(secs)
}

impl BaseAddon for SteamLibrary {
    const TYPE: &'static str = "steam";
}
impl GameLibrary for SteamLibrary {
    fn scan() -> impl Stream<Item = ScannedGameLibraryMetadata> {
        debug!("APPS_PATH: {:?}", &*APPS_PATH);
        stream! {
            let mut reader = fs::read_dir(APPS_PATH.as_path()).await.unwrap();
            while let Some(entry) = reader.next_entry().await.unwrap() {
                let path: PathBuf = entry.path();
                debug!("Checking file: {:?}", path);
                let name = path.file_name().unwrap().to_str().unwrap();
                if !name.starts_with("appmanifest") {
                    continue;
                }
                debug!("Reading file: {:?}", path);
                let reader = fs::File::open(&path).await.unwrap();
                debug!("Parsing file: {:?}", path);
                let parsed = full_parse(reader).await.unwrap();
                debug!("Parsed file: {:?}", parsed);
                let obj = if let KvValue::Object(v) = parsed.value {
                    v
                } else {
                    error!("Steam KSV: Expected an object");
                    continue;
                };

                let get_obj_text = |key:&str| {
                    match obj[key] {
                        KvValue::String(ref s) => s.as_str(),
                        _ => panic!("Steam KSV: Expected an string at key: {}", key),
                    }
                };
                let get_obj_text_opt = |key:&str| {
                    match obj.get(key) {
                        Some(KvValue::String(ref s)) => Some(s.as_str()),
                        Some(_) => panic!("Steam KSV: Expected an string at key: {}", key),
                        None => None,
                    }
                };

                let get_obj_unix_opt= |key:&str| {
                    if let Some(raw) = get_obj_text_opt(key) {
                        let parsed: u64 = raw.parse().unwrap();
                        Some(from_epoch(parsed))
                    }else{None}
                };
                let bytes_to_dl = get_obj_text_opt("BytesToDownload");
                let bytes_dl = get_obj_text_opt("BytesDownloaded");
                yield ScannedGameLibraryMetadata {
                    library_id: get_obj_text("appid").into(),
                    name: get_obj_text("name").into(),
                    last_played: get_obj_unix_opt("LastPlayed"),
                    library_type: Self::TYPE.into(),
                    install_status: if bytes_dl == None {
                        Queued
                    } else if bytes_dl == bytes_to_dl {
                        GameInstallStatus::Installed
                    } else {
                        GameInstallStatus::Installing
                    },
                    ..Default::default()
                }
            }
        }
    }
    async fn launch(game: &GameLibraryRef) {
        run_cmd("rungameid", &game.library_id).await
    }
    async fn install(game: &GameLibraryRef) {
        run_cmd("install", &game.library_id).await
    }
    async fn uninstall(game: &GameLibraryRef) {
        run_cmd("uninstall", &game.library_id).await
    }
    async fn check_install_status(game: &GameLibraryRef) -> GameInstallStatus {
        todo!()
    }
}
