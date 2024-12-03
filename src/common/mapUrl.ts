import { readFile } from "@tauri-apps/plugin-fs"

import * as path from "@tauri-apps/api/path"
// Check if the `$APPDATA/avatar.png` file exists
export default async function mapUrl(url: string | URL): Promise<string> {
    console.log(await path.appDataDir(), "steam")
    const mapped = url instanceof URL ? url : new URL(url)
    switch (mapped.origin) {
        case "file://":
            const contents = await readFile(url)
            return URL.createObjectURL(new Blob([contents]))
        case "http://":
        case "https://":
            return url.toString()
        default:
            throw new Error("Unknown URL origin: " + mapped.origin)
    }
}
