import { routes } from "../router"
import { For } from "solid-js"
import { A, useLocation } from "@solidjs/router"

export default function (props: { class: string }) {
    const location = useLocation()
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
