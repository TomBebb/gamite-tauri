import "./index.css"
import NavMenu from "./components/NavMenu.js"
import Titlebar from "./components/Titlebar"
import { RouteSectionProps } from "@solidjs/router"

export default function ({ children }: RouteSectionProps) {
    return (
        <div class="flex min-h-screen flex-col">
            <Titlebar class="show-on-desktop sticky top-0" />
            <div class="flex h-screen flex-grow flex-row">
                <NavMenu class="min-w-20px flex-1" />
                <div class="flex-5">{children}</div>
            </div>
        </div>
    )
}
