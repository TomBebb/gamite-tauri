import { window } from "@tauri-apps/api"
import { createMemo, createSignal, Show } from "solid-js"
import { settings } from "../common/settings"
import IconClose from "~icons/mdi/close"
import IconMinimize from "~icons/mdi/minimize"
import IconMaximize from "~icons/mdi/minimize"
import IconRestore from "~icons/mdi/restore"

export default function (props: { class: string }) {
    const general = createMemo(() => settings().general)
    const main = window.getCurrentWindow()

    main.onCloseRequested(() => {
        if (general().minimizeToSystemTrayOnClose) {
            main.hide().catch(console.error)
        }
    }).catch(console.error)

    const [maximized, setMaximized] = createSignal(false)

    function toggleMaximize() {
        main.toggleMaximize()
            .then((_) => setMaximized(!maximized()))
            .catch(console.error)
    }

    async function minimize() {
        const minimized = await main.isMinimized()
        if (general().minimizeToSystemTray && !minimized) {
            await main.hide()
        } else {
            await main.minimize()
        }
    }

    return (
        <div
            class={"flex flex-row gap-2" + props.class}
            onDblClick={toggleMaximize}
        >
            <div
                class="flex-1"
                onMouseDown={(ev) => {
                    if (ev.buttons === 1 && ev.detail === 1) {
                        main.startDragging().catch(console.error)
                    }
                }}
            />
            <button class="btn btn-accent btn-sm" on:click={toggleMaximize}>
                <Show when={!maximized()} fallback={<IconRestore />}>
                    <IconMaximize />
                </Show>
            </button>
            <button
                class="btn btn-warning btn-sm"
                on:click={() => minimize().catch(console.error)}
            >
                <IconMinimize />
            </button>
            <button
                class="btn btn-error btn-sm"
                on:click={() => main.close().catch(console.error)}
            >
                <IconClose />
            </button>
        </div>
    )
}
