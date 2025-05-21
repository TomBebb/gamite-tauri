import { routes } from "../router"
import { For } from "solid-js"
import { A, useLocation } from "@solidjs/router"
import { inputEmitter } from "../common/input"
import { FocusedItem, focusedItem } from "../common/bigScreen"

export default function (props: { class: string }) {
    const location = useLocation()

    inputEmitter.on("pressed", (ev) => {
        console.info("focusedItem", focusedItem)
        if (focusedItem() !== FocusedItem.NavMenu) return
        console.log("Pressed " + ev)
    })

    return (
        <ul class={"menu menu-md rounded-box bg-base-200 " + props.class}>
            <For each={routes()}>
                {(route) => (
                    <li>
                        <A
                            href={route.path}
                            classList={{
                                "menu-active": route.path === location.pathname,
                            }}
                        >
                            <div class="flex flex-row items-center justify-start gap-2">
                                {route.icon}
                                {route.name}
                            </div>
                        </A>
                    </li>
                )}
            </For>
        </ul>
    )
}
