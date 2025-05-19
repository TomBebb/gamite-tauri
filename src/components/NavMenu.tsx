import { routes } from "../router"
import { createEffect, For } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { A, useLocation } from "@solidjs/router"

export default function () {
    const location = useLocation()
    createEffect(() => {
        console.log("location", location.pathname)
    })
    return (
        <ul class="menu menu-md rounded-box bg-base-200 w-56">
            <For each={routes}>
                {(route) => (
                    <li>
                        <A
                            href={route.path}
                            classList={{
                                "menu-active": route.path === location.pathname,
                            }}
                        >
                            <div class="flex flex-row items-center justify-start gap-2">
                                <Icon icon={route.icon} />
                                {route.name}
                            </div>
                        </A>
                    </li>
                )}
            </For>
        </ul>
    )
}
