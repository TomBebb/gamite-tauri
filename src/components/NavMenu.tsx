import { routes } from "../router"
import { createEffect, createSignal, For } from "solid-js"
import { A, useLocation, useNavigate } from "@solidjs/router"
import { inputEmitter, MappedButton } from "../common/input"
import {
    FocusedItem,
    focusedItem,
    isBigScreen,
    isDesktop,
    setFocusedItem,
} from "../common/bigScreen"
import "./NavMenu.css"

export default function (props: { class?: string }) {
    const location = useLocation()
    const navigate = useNavigate()
    const [bigScreenIndex, setBigScreenIndex] = createSignal<number>(0)

    createEffect(() => {
        console.info(isBigScreen())
        setBigScreenIndex(0)
    })

    inputEmitter.on("pressed", (ev) => {
        if (focusedItem() !== FocusedItem.NavMenu) return
        console.log("Pressed " + ev)
        switch (ev) {
            case MappedButton.Up:
                if (bigScreenIndex() !== 0) {
                    setBigScreenIndex(bigScreenIndex() - 1)
                }
                break
            case MappedButton.Down:
                if (bigScreenIndex() !== routes().length - 1) {
                    setBigScreenIndex(bigScreenIndex() + 1)
                }
                break
            case MappedButton.Confirm:
                navigate(routes()[bigScreenIndex()].path)
                setFocusedItem(FocusedItem.Page)
                break
        }
    })

    return (
        <ul
            class={`menu nav menu-md rounded-box bg-base-200 overflow-hidden transition-[width] ${props.class}`}
            classList={{
                focused: focusedItem() === FocusedItem.NavMenu,
            }}
        >
            <For each={routes()}>
                {(route, index) => (
                    <li>
                        <A
                            href={route.path}
                            classList={{
                                "menu-active": route.path === location.pathname,
                                "menu-focus":
                                    isBigScreen() &&
                                    bigScreenIndex() === index(),
                            }}
                        >
                            <div
                                class="flex flex-row items-center justify-start gap-2"
                                classList={{
                                    "gap-5 p-2": isBigScreen(),
                                }}
                            >
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
