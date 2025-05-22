import { GameInstallStatus } from "./models"
import { SemanticColor } from "./colors"
import { JSXElement } from "solid-js"
import IconPlay from "~icons/mdi/play"
import IconEdit from "~icons/mdi/edit"
import IconPlus from "~icons/mdi/plus"
import IconMinus from "~icons/mdi/minus"
import IconClear from "~icons/mdi/clear"

export type GameAction = "play" | "install" | "uninstall" | "edit" | "delete"
const commonActions: GameAction[] = ["edit", "delete"]

export function getGameActions(status: GameInstallStatus): GameAction[] {
    switch (status) {
        case GameInstallStatus.InLibrary:
            return ["install", ...commonActions]
        case GameInstallStatus.Installed:
            return ["play", "uninstall", ...commonActions]
        default:
            return commonActions
    }
}

export type GameActionData = {
    name: string
    icon: JSXElement
    color: SemanticColor
}
const actionsData: Record<GameAction, GameActionData> = {
    play: { name: "Play", icon: <IconPlay />, color: "success" },
    edit: { name: "Edit", icon: <IconEdit />, color: "primary" },
    install: { name: "Install", icon: <IconPlus />, color: "accent" },
    uninstall: { name: "Uninstall", icon: <IconMinus />, color: "warning" },
    delete: { name: "Delete", icon: <IconClear />, color: "error" },
}

export function getActionData(action: GameAction): GameActionData {
    return actionsData[action]
}
