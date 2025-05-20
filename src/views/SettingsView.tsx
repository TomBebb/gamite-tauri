import { JSXElement } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { settings, setSettings } from "../common/settings"
import { Settings } from "../common/models"

function Form({ children }: { children: JSXElement }) {
    return (
        <div class="border-accent grid w-full grid-flow-row grid-cols-[120px_auto] items-center gap-3 border-1">
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
    label: JSXElement | string
    value?: boolean
    onChange?: (v: boolean) => void
}): JSXElement {
    return (
        <>
            <div class="text-right font-bold">{label}</div>
            <input
                type="checkbox"
                class="checkbox ml-auto"
                checked={value}
                onChange={(ev) => onChange?.(ev.target.checked)}
            />
        </>
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
                        <select class="select">
                            <option value="minimize">Minimize</option>
                            <option value="close">Close</option>
                            <option value="none">Do Nothing</option>
                        </select>
                    </FormItem>
                    <FormCheckBoxItemValue
                        label="Show system tray icon"
                        key1="general"
                        key2="showSystemTray"
                    />
                    <FormItem label="Minimize to system tray">
                        <input class="input" type="radio" />
                    </FormItem>
                    <FormItem label="Minimize to system tray on close">
                        <input class="input" type="radio" />
                    </FormItem>
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
                    <FormItem label="Download games metadata after scan">
                        <input class="input" type="radio" />
                    </FormItem>
                </Form>
            </div>
            <label class="tab">
                <input type="radio" name="tabs" aria-label="Achievements" />
                <Icon icon="mdi:trophy" />
                Achievements
            </label>
            <div class="tab-content border-base-300 bg-base-100 p-6">
                <Form>
                    <FormItem label="Display achievements">
                        <input class="input" type="radio" />
                    </FormItem>
                    <FormItem label="Synchronize achievements after library scan">
                        <input class="input" type="radio" />
                    </FormItem>
                    <FormItem label="Synchronize achievements progress on start">
                        <input class="input" type="radio" />
                    </FormItem>
                    <FormItem label="Synchronize achievements progress of installed games only">
                        <input class="input" type="radio" />
                    </FormItem>
                </Form>
            </div>
        </div>
    )
}
