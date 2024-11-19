export interface GameData {
    libraryType: string
    libraryId: string
    genres: string[]
    description: string
    name: string
    installStatus: GameInstallStatus
}
export enum GameInstallStatus {
    Installed,
    Installing,
    InLibrary,
    Queued,
}
