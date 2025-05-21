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

export default function (props: { class?: string }) {
    const location = useLocation()
    const navigate = useNavigate()
    const [bigScreenIndex, setBigScreenIndex] = createSignal<number>(0)

    createEffect(() => {
        console.info(isBigScreen())
        setBigScreenIndex(0)
    })

    inputEmitter.on("pressed", (ev) => {
        console.info("focusedItem", focusedItem)
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
            class={
                "menu menu-md rounded-box bg-base-200 overflow-clip " +
                props.class
            }
            classList={{
                "flex-1": isDesktop(),
                "w-0": isBigScreen() && focusedItem() !== FocusedItem.NavMenu,
                "w-30px":
                    isBigScreen() && focusedItem() === FocusedItem.NavMenu,
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
