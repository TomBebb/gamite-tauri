import {
    BaseDirectory,
    exists,
    readTextFile,
    writeTextFile,
} from "@tauri-apps/plugin-fs"
import { PostGameLaunchAction, Settings } from "./models"
import { createEffect, createSignal } from "solid-js"

import * as logger from "@tauri-apps/plugin-log"

const defaultSettings: Settings = {
    general: {
        minimizeToSystemTray: true,
        minimizeToSystemTrayOnClose: false,
        postGameLaunch: PostGameLaunchAction.DoNothing,
        showSystemTray: false,
    },
    achievements: {
        scanAfterLibraryScan: true,
        syncProgressOfInstalledGamesOnly: true,
        display: true,
        syncProgressOnStart: true,
    },
    appearance: {},
    metadata: {
        downloadGamesMetadataAfterScan: false,
    },
}
export const [settings, setSettings] = createSignal(defaultSettings)
const path: Parameters<typeof exists> = [
    "settings.json",
    { baseDir: BaseDirectory.AppData },
]
let initialLoad = true
createEffect(() => {
    const value = settings()
    if (initialLoad) {
        logger.info("Initial load; skip save").catch(console.error)
        return
    }
    console.log("settings change", value)

    writeSettings(value).catch(console.error)
})

async function loadSettings(): Promise<Settings | null> {
    logger.info("check settings exists").catch(console.error)
    if (!(await exists(...path))) {
        logger.info("settings does not exists").catch(console.error)
        return null
    }
    logger.info("read settings").catch(console.error)
    return JSON.parse(await readTextFile(...path))
}

async function writeSettings(settings: Settings): Promise<void> {
    logger.info("write settings exists").catch(console.error)
    //await mkdir("gami", { baseDir: BaseDirectory.AppData })
    logger.info("done mkdir").catch(console.error)
    await writeTextFile(path[0], JSON.stringify(settings), {
        ...path[1],
        create: true,
    })
    logger.info("written settings").catch(console.error)
}

loadSettings()
    .then((v) => {
        if (v !== null) setSettings(v)
    })
    .catch(console.error)
    .finally(() => (initialLoad = false))
