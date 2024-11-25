import "./index.css"
import NavMenu from "./components/NavMenu.js"
import { Route } from "@solidjs/router"
import Toolbar from "./components/Toolbar"

export default function () {
    return (
        <>
            <Toolbar />
            <NavMenu />
            <main>
                <Route />
            </main>
        </>
    )
}
