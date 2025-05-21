import "./index.css"
import NavMenu from "./components/NavMenu.js"
import Titlebar from "./components/Titlebar"
import { RouteSectionProps } from "@solidjs/router"
import { isDesktop } from "./common/bigScreen"
import { Show } from "solid-js"

export default function ({ children }: RouteSectionProps) {
    return (
        <div class="flex flex-col">
            <Show when={isDesktop()}>
                <Titlebar class="sticky top-0" />
            </Show>
            <div class="flex flex-row">
                <NavMenu class="min-w-20px flex-1" />
                <div class="flex-5">{children}</div>
            </div>
        </div>
    )
}
