import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Image, Question } from '@phosphor-icons/react'
import { Enhancement, EnhancementSpot } from '@/types'
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
    <div className="space-y-6">
      {/* Header with Mark Restrictions */}
      <Collapsible open={showMarkRestrictions} onOpenChange={onShowMarkRestrictionsChange}>
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold">Enhancements</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2 h-8 w-8 rounded-full bubble-button">
              <Question size={16} />
            </Button>
          </CollapsibleTrigger>
        </div>

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {availableEnhancements.map(([key, enhancement]) => (
          <Button
            key={key}
            variant="outline"
            onClick={() => onEnhancementSelect(key)}
            className="h-auto p-4 flex-col gap-2 text-xs rounded-lg bubble-button border-2 hover:text-accent transition-colors"
            size="sm"
            style={{
              borderColor: selectedEnhancement === key ? 'oklch(0.68 0.15 140)' : undefined
            }}
          >
            <div className="w-6 h-6 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
              <Image size={12} />
            </div>
            <span className="text-xs leading-tight text-center font-medium">{enhancement.name}</span>
            <Badge 
              variant="secondary" 
              className={`text-xs px-2 rounded-full ${
                key.startsWith('summon') 
                  ? 'bg-white text-black' 
                  : 'bg-accent text-accent-foreground'
              }`}
            >
              {enhancement.baseCost}g
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  )
}