import { routes } from "../router"
import { For } from "solid-js"
import { Icon } from "@iconify-icon/solid"

export default function () {
    return (
        <ul class="menu menu-md w-56 rounded-box bg-base-200">
            <For each={routes}>
                {(route) => (
                    <li>
                        <a
                            href={route.path}
                            classList={{
                                active: true,
                            }}
                        >
                            <Icon icon={route.icon} />
                            {route.name}
                        </a>
                    </li>
                )}
            </For>
        </ul>
    )
}
