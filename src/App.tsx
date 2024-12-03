import "./index.css"
import NavMenu from "./components/NavMenu.js"
import { Route } from "@solidjs/router"
import Titlebar from "./components/Titlebar"

export default function () {
    return (
        <>
            <Titlebar />
            <div class="drawer drawer-open">
                <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
                <div class="drawer-content flex flex-col items-center justify-center">
                    <label
                        for="my-drawer-2"
                        class="btn btn-primary drawer-button lg:hidden"
                    >
                        Open drawer
                    </label>
                    <div>Demo</div>
                    <Route />
                </div>
                <div class="drawer-side">
                    <label
                        for="my-drawer-2"
                        aria-label="close sidebar"
                        class="drawer-overlay"
                    ></label>
                    <NavMenu />
                </div>
            </div>
        </>
    )
}
