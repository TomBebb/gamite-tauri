// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tokio::runtime::Builder;

fn main() {    let runtime = Builder::new_multi_thread().enable_all().build().unwrap();
    runtime.block_on(async {
        gamite_tauri_lib::run().await;
    }); 

}
