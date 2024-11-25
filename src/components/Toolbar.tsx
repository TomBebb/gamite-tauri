import { window } from "@tauri-apps/api"
import { Icon } from "@iconify-icon/solid"
import { createSignal } from "solid-js"

export default function () {
    const main = window.getCurrentWindow()
    const [maximized, setMaximized] = createSignal(false)

    return (
        <div
            class="flex flex-row gap-2"
            onDblClick={() =>
                main
                    .toggleMaximize()
                    .then((_) => setMaximized(!maximized()))
                    .catch(console.error)
            }
        >
            <div
                class="flex-1"
                onMouseDown={(ev) => {
                    if (ev.buttons === 1 && ev.detail === 1) {
                        main.startDragging().catch(console.error)
                    }
                }}
            />
            <button
                class="btn btn-accent btn-sm"
                on:click={() =>
                    main
                        .toggleMaximize()
                        .then((_) => setMaximized(!maximized()))
                        .catch(console.error)
                }
            >
                <Icon
                    icon={
                        "mdi:window-" + (maximized() ? "restore" : "maximize")
                    }
                />
            </button>
            <button
                class="btn btn-warning btn-sm"
                on:click={() => main.minimize().catch(console.error)}
            >
                <Icon icon="mdi:window-minimize" />
            </button>
            <button
                class="btn btn-error btn-sm"
                on:click={() => main.close().catch(console.error)}
            >
                <Icon icon="mdi:window-close" />
            </button>
        </div>
    )
}
