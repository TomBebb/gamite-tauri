import "./index.css"
import NavMenu from "./components/NavMenu.js"
import { Route } from "@solidjs/router"

export default function () {
    return (
        <>
            <NavMenu />
            <main>
                <Route />
            </main>
        </>
    )
}
