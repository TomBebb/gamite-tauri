import "./index.css"
import NavMenu from "./components/NavMenu.js"
import { Route } from "@solidjs/router"
import Titlebar from "./components/Titlebar"

export default function () {
    return (
        <>
            <Titlebar />
            <NavMenu />
            <main>
                <Route />
            </main>
        </>
    )
}
