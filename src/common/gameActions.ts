import { GameInstallStatus } from "./models"

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
    icon: string
}
const actionsData: Record<GameAction, GameActionData> = {
    play: { name: "Play", icon: "mdi:play" },
    edit: { name: "Edit", icon: "mdi:edit" },
    install: { name: "Install", icon: "mdi:plus" },
    uninstall: { name: "Uninstall", icon: "mdi:minus" },
    delete: { name: "Delete", icon: "mdi:clear-bold" },
}

export function getActionData(action: GameAction): GameActionData {
    return actionsData[action]
}
