import { GameInstallStatus } from "./models"
import { SemanticColor } from "./colors"
import { JSXElement } from "solid-js"

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
    play: { name: "Play", icon: "mdi:play", color: "success" },
    edit: { name: "Edit", icon: "mdi:edit", color: "primary" },
    install: { name: "Install", icon: "mdi:plus", color: "accent" },
    uninstall: { name: "Uninstall", icon: "mdi:minus", color: "warning" },
    delete: { name: "Delete", icon: "mdi:clear-bold", color: "error" },
}

export function getActionData(action: GameAction): GameActionData {
    return actionsData[action]
}
