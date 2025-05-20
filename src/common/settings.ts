import {
    BaseDirectory,
    exists,
    readTextFile,
    writeTextFile,
} from "@tauri-apps/plugin-fs"
import { PostGameLaunchAction, Settings } from "./models"
import { createEffect, createSignal } from "solid-js"

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
        console.log("Initial load; skip save")
        return
    }
    console.log("settings change", value)

    writeSettings(value).catch(console.error)
})

async function loadSettings(): Promise<Settings | null> {
    console.info("check settings exists")
    if (!(await exists(...path))) {
        console.info("settings does not exists")
        return null
    }
    console.info("read settings")
    return JSON.parse(await readTextFile(...path))
}

async function writeSettings(settings: Settings): Promise<void> {
    console.info("write settings exists")
    //await mkdir("gami", { baseDir: BaseDirectory.AppData })
    console.info("done mkdir")
    await writeTextFile(path[0], JSON.stringify(settings), {
        ...path[1],
        create: true,
    })
    console.info("written settings")
}

loadSettings()
    .then(setSettings)
    .catch(console.error)
    .finally(() => (initialLoad = false))
