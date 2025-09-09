import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EnhancementSpot } from '@/types'

interface EnhancementSpotsProps {
  spots: EnhancementSpot[]
  selectedSpot: EnhancementSpot | null
  onSpotSelect: (spot: EnhancementSpot) => void
}

export function EnhancementSpots({ spots, selectedSpot, onSpotSelect }: EnhancementSpotsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="text-sm font-medium text-muted-foreground">Enhancement Spots:</div>
        <div className="space-y-2">
          {spots.map((spot) => (
            <Button
              key={spot.id}
              variant="outline"
              onClick={() => onSpotSelect(spot)}
              className="w-full h-auto p-3 rounded-lg bubble-button border-2 hover:text-accent"
              style={{
                borderColor: selectedSpot?.id === spot.id ? 'oklch(0.68 0.15 140)' : undefined
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="shrink-0 text-xs rounded-full bg-accent text-accent-foreground">
                    {spot.region.charAt(0).toUpperCase() + spot.region.slice(1)}
                  </Badge>
                  <span className="text-xs text-left">{spot.description}</span>
                </div>
                {spot.hasLostIcon && (
                  <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                    <img 
                      src="/gh-calculator/src/assets/icons/enhancements/lost.svg"
                      alt="Lost Icon"
                      className="w-5 h-5"
                      onError={(e) => {
                        // Fallback to text if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'inline';
                      }}
                    />
                    <span className="text-xs text-destructive hidden">Lost</span>
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}