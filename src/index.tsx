import { routes } from "./router"
import { enableMapSet } from "immer"
import "./common/bigScreen.ts"
import { render } from "solid-js/web"
import { MemoryRouter } from "@solidjs/router"
import App from "./App"
import { window } from "@tauri-apps/api"

const w = window.getCurrentWindow()
await w.setDecorations(false)
const root = document.getElementById("app")!

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
    )
}

enableMapSet()

render(
    () => (
        <>
            <App />
            <MemoryRouter explicitLinks={true}>{routes}</MemoryRouter>
        </>
    ),
    root
)
