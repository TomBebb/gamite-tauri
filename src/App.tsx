import "./index.css"
import NavMenu from "./components/NavMenu.js"
import Titlebar from "./components/Titlebar"
import { RouteSectionProps } from "@solidjs/router"

export default function ({ children }: RouteSectionProps) {
    return (
        <div class="h-screen flex-col overflow-hidden">
            <Titlebar class="show-on-desktop sticky top-0 z-50" />
            <div class="flex h-screen flex-grow flex-row">
                <NavMenu class="min-w-20px flex-1" />
                <div class="flex-5 overflow-scroll">{children}</div>
            </div>
        </div>
    )
}
