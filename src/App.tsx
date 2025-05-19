import "./index.css"
import NavMenu from "./components/NavMenu.js"
import Titlebar from "./components/Titlebar"
import { RouteSectionProps } from "@solidjs/router"

export default function ({ children }: RouteSectionProps) {
    return (
        <div class="flex flex-col">
            <Titlebar class="sticky top-0" />
            <div class="flex flex-row">
                <NavMenu class="min-w-20px flex-1" />
                <div class="flex-5">{children}</div>
            </div>
        </div>
    )
}
