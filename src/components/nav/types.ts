export type ToggleOffCanvasNav = (
  open: boolean
) => (event: React.KeyboardEvent | React.MouseEvent) => null

export type BottomNavProps = {
  setPanelOpen: React.Dispatch<boolean>
}
