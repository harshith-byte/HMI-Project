"use client"

export function DataMap() {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed p-8 text-center data-map">
      <div className="flex flex-col items-center">
        <p className="text-sm text-muted-foreground">
          Interactive map of Germany showing regional employment rates would be displayed here.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          (This would be implemented with a mapping library like react-simple-maps or Mapbox)
        </p>
      </div>
    </div>
  )
}
