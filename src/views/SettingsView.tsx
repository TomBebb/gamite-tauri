import { JSXElement } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { settings, setSettings } from "../common/settings"
import { PostGameLaunchAction, Settings } from "../common/models"

function Form({ children }: { children: JSXElement }) {
    return (
        <div class="grid w-full grid-flow-row grid-cols-[minmax(120px,4fr)_2fr] items-center gap-3">
            {children}
        </div>
    )
}

function FormItem({
    label,
    children,
}: {
    label: JSXElement | string
    children: JSXElement
}): JSXElement {
    return (
        <>
            <div class="text-right font-bold">{label}</div>
            {children}
        </>
    )
}

function FormCheckBoxItem({
    label,
    value,
    onChange,
}: {
    label: string
    value: boolean
    onChange: (v: boolean) => void
}): JSXElement {
    return (
        <label class="col-span-2">
            <Form>
                <FormItem label={label}>
                    <input
                        type="checkbox"
                        class="checkbox ml-auto"
                        checked={value}
                        onInput={(ev) => onChange(ev.target.checked)}
                    />
                </FormItem>
            </Form>
        </label>
    )
}

function FormCheckBoxItemValue<
    TKey1 extends keyof Settings,
    TKey2 extends keyof Settings[TKey1],
>({ label, key1, key2 }: { label: string; key1: TKey1; key2: TKey2 }) {
    return FormCheckBoxItem({
        label,
        value: settings()[key1][key2] as boolean,
        onChange: (v: boolean) => {
            const s = settings()
            setSettings({
                ...s,
                [key1]: {
                    ...s[key1],
                    [key2]: v,
                },
            })
        },
    })
}

export default function () {
    return (
        <div class="tabs-lift tabs">
            <label class="tab">
                <input
                    type="radio"
                    name="tabs"
                    checked={true}
                    aria-label="General"
                />
                <Icon icon="mdi:wrench" />
                General
            </label>
            <div class="tab-content border-base-300 bg-base-100 p-6">
                <Form>
                    <FormItem label="After game launch">
                        <select
                            class="select"
                            value={settings().general.postGameLaunch}
                            onChange={(ev) => {
                                const v = settings()
                                setSettings({
                                    ...v,
                                    general: {
                                        ...v.general,
                                        postGameLaunch: ev.target
                                            .value as unknown as PostGameLaunchAction,
                                    },
                                })
                            }}
                        >
                            <option value={PostGameLaunchAction.Minimize}>
                                Minimize
                            </option>
                            <option value={PostGameLaunchAction.Close}>
                                Close
                            </option>
                            <option value={PostGameLaunchAction.DoNothing}>
                                Do Nothing
                            </option>
                        </select>
                    </FormItem>
                    <FormCheckBoxItemValue
                        label="Show system tray icon"
                        key1="general"
                        key2="showSystemTray"
                    />
                    <FormCheckBoxItemValue
                        label="Minmize to system tray"
                        key1="general"
                        key2="minimizeToSystemTray"
                    />
                    <FormCheckBoxItemValue
                        label="Minmize to system tray on close"
                        key1="general"
                        key2="minimizeToSystemTrayOnClose"
                    />
                </Form>
            </div>

            <label class="tab">
                <input type="radio" name="tabs" aria-label="Appearance" />
                <Icon icon="mdi:eye" />
                Appearance
            </label>
            <div class="tab-content border-base-300 bg-base-100 p-6">
                Tab content 2
            </div>

            <label class="tab">
                <input type="radio" name="tabs" aria-label="Metadata" />
                <Icon icon="mdi:database" />
                Metadata
            </label>
            <div class="tab-content border-base-300 bg-base-100 p-6">
                <Form>
                    <FormCheckBoxItemValue
                        label="Download games metadata after scan"
                        key1="metadata"
                        key2="downloadGamesMetadataAfterScan"
                    />
                </Form>
            </div>
            <label class="tab">
                <input type="radio" name="tabs" aria-label="Achievements" />
                <Icon icon="mdi:trophy" />
                Achievements
            </label>
            <div class="tab-content border-base-300 bg-base-100 p-6">
                <Form>
                    <FormCheckBoxItemValue
                        label="Display achievements"
                        key1="achievements"
                        key2="display"
                    />
                    <FormCheckBoxItemValue
                        label="Synchronize achievements after library scan"
                        key1="achievements"
                        key2="scanAfterLibraryScan"
                    />
                    <FormCheckBoxItemValue
                        label="Synchronize achievements progress on start"
                        key1="achievements"
                        key2="syncProgressOnStart"
                    />
                    <FormCheckBoxItemValue
                        label="Synchronize achievements progress of installed games only"
                        key1="achievements"
                        key2="syncProgressOfInstalledGamesOnly"
                    />
                </Form>
            </div>
        </div>
    )
}
