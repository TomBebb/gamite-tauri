import { routes } from "./router"
import { enableMapSet } from "immer"
import "./common/bigScreen.ts"
import { render } from "solid-js/web"
import { Router } from "@solidjs/router"
import App from "./App"

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
            <Router>{routes}</Router>
            <App />
        </>
    ),
    root
)
