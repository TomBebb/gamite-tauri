<script lang="ts">
    import { GameData, GameInstallStatus } from "../common/models"
    import { getGameActions } from "../common/gameActions"

    let props = $props<{ game: GameData; pos: { x: number; y: number } }>()

    let actions = $derived(() =>
        getGameActions(props.game?.installStatus ?? GameInstallStatus.InLibrary)
    )
</script>

<div
    class="menu absolute z-10 w-60 rounded-box bg-base-200 transition-opacity"
></div>
