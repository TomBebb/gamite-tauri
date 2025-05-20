export interface GameData {
    libraryType: string
    libraryId: string
    genres: string[]
    description: string
    name: string
    installStatus: GameInstallStatus
    iconUrl?: string
}

export enum GameInstallStatus {
    Installed,
    Installing,
    InLibrary,
    Queued,
}

export enum PostGameLaunchAction {
    Minimize,
    Close,
    DoNothing,
}

export interface Settings {
    appearance: {}
    general: {
        postGameLaunch: PostGameLaunchAction
        showSystemTray: boolean
        minimizeToSystemTray: boolean
        minimizeToSystemTrayOnClose: boolean
    }
    metadata: {
        downloadGamesMetadataAfterScan: boolean
    }
    achievements: {
        display: boolean
        scanAfterLibraryScan: boolean
        syncProgressOnStart: boolean
        syncProgressOfInstalledGamesOnly: boolean
    }
}
