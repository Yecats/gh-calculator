import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Image } from '@mui/icons-material'
import { Enhancement, EnhancementSpot } from '@/types'
import EnhancementIcon from './EnhancementIcon'
import markTypes from '@/data/mark-types.json'

const MARK_TYPES: Record<string, any> = markTypes

interface EnhancementStickersProps {
  selectedSpot: EnhancementSpot | null
  availableEnhancements: [string, Enhancement][]
  selectedEnhancement: string
  onEnhancementSelect: (enhancementKey: string) => void
  showMarkRestrictions: boolean
  onShowMarkRestrictionsChange: (show: boolean) => void
}

export function EnhancementStickers({
  selectedSpot,
  availableEnhancements,
  selectedEnhancement,
  onEnhancementSelect,
  showMarkRestrictions,
  onShowMarkRestrictionsChange
}: EnhancementStickersProps) {
  if (!selectedSpot) return null

  return (
    <div className="space-y-4">
      {/* Mark Restrictions */}
      <Collapsible open={showMarkRestrictions} onOpenChange={onShowMarkRestrictionsChange}>
        {/* Mark Restrictions Content */}
        <CollapsibleContent>
          <Alert className="mt-3 rounded-lg border-2 glass-card">
            <AlertDescription>
              <strong>{MARK_TYPES[selectedSpot.type]?.name} mark can use:</strong>
              <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                {MARK_TYPES[selectedSpot.type]?.restrictions.map((restriction: string, index: number) => (
                  <li key={index}>{restriction}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </CollapsibleContent>
      </Collapsible>

      {/* Enhancement Grid */}
      {availableEnhancements.length > 0 ? (
        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
          {availableEnhancements.map(([key, enhancement]) => (
            <Button
              key={key}
              variant="outline"
              onClick={() => onEnhancementSelect(key)}
              className="h-auto p-4 flex-col gap-2 text-xs rounded-lg bubble-button border-2 hover:text-accent transition-colors w-28 flex-shrink-0"
              size="sm"
              style={{
                borderColor: selectedEnhancement === key ? 'oklch(0.68 0.15 140)' : undefined
              }}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                {enhancement.icon && enhancement.icon !== '?' ? (
                  <EnhancementIcon 
                    iconPath={enhancement.icon}
                    alt={enhancement.name}
                    className="w-10 h-10"
                    onError={() => {
                      // This will fall back to the Material UI Image icon automatically
                    }}
                  />
                ) : (
                  <Image style={{ fontSize: 32, color: 'white' }} />
                )}
              </div>
              <span className="text-xs leading-tight text-center font-medium">{enhancement.name}</span>
              <Badge 
                variant="secondary" 
                className={`text-xs px-2 rounded-full ${
                  key.startsWith('summon') 
                    ? 'bg-white text-black' 
                    : 'bg-accent text-black'
                }`}
              >
                {enhancement.baseCost}g
              </Badge>
            </Button>
          ))}
        </div>
      ) : (
        <Alert className="rounded-lg border-2 glass-card">
          <AlertDescription className="text-center py-4">
            <div className="flex flex-col items-center gap-2">
              <Image style={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              <div>
                <p className="font-medium text-muted-foreground">This card cannot be enhanced.</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}