import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calculate as Calculator, Refresh as ArrowCounterClockwise } from '@mui/icons-material'
import { Card, EnhancementSpot } from '@/types'

interface CostModifiersProps {
  selectedCardData: Card | null
  selectedSpot: EnhancementSpot | null
  selectedEnhancement: string
  manualCardLevel: number | string
  manualTargets: number | null
  manualLostIcon: boolean | null
  existingEnhancements: number
  hexCount: number
  onManualCardLevelChange: (level: number | string) => void
  onManualTargetsChange: (targets: number | null) => void
  onManualLostIconChange: (value: boolean | null) => void
  onExistingEnhancementsChange: (count: number) => void
  onHexCountChange: (count: number) => void
  onResetToDefaults: () => void
}

export function CostModifiers({
  selectedCardData,
  selectedSpot,
  selectedEnhancement,
  manualCardLevel,
  manualTargets,
  manualLostIcon,
  existingEnhancements,
  hexCount,
  onManualCardLevelChange,
  onManualTargetsChange,
  onManualLostIconChange,
  onExistingEnhancementsChange,
  onHexCountChange,
  onResetToDefaults
}: CostModifiersProps) {
  if (!selectedSpot || !selectedEnhancement) return null

  // Get default values from card data
  const defaultCardLevel = selectedCardData?.level || 1
  const defaultTargets = selectedSpot.targets || 1
  const defaultLostIcon = selectedSpot.hasLostIcon

  // Use manual values if set, otherwise use defaults
  const currentCardLevel = manualCardLevel !== '' ? manualCardLevel : defaultCardLevel
  const currentTargets = manualTargets !== null ? manualTargets : defaultTargets
  const currentLostIcon = manualLostIcon !== null ? manualLostIcon : defaultLostIcon

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
          <Calculator className="text-white" fontSize="small" />
        </div>
        <label className="text-sm font-medium">Cost Modifiers</label>
      </div>
      
      {/* Editable Properties */}
      <div className="w-full p-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-accent/20 glass-card flex-1 flex flex-col">
        <div className="space-y-4 text-sm flex-1">
          {/* Card Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Card Level:</Label>
              <div className="flex items-center gap-1 bg-background/50 rounded-lg border border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const numLevel = currentCardLevel === 'X' ? 1 : (typeof currentCardLevel === 'number' ? currentCardLevel : parseInt(currentCardLevel.toString()))
                    const newLevel = Math.max(1, numLevel - 1)
                    onManualCardLevelChange(newLevel)
                  }}
                  className="h-8 w-8 p-0 rounded-l-lg hover:bg-accent hover:text-accent-foreground"
                >
                  -
                </Button>
                <span className="w-10 text-center text-sm font-medium">
                  {currentCardLevel === 'X' ? 1 : currentCardLevel}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const numLevel = currentCardLevel === 'X' ? 1 : (typeof currentCardLevel === 'number' ? currentCardLevel : parseInt(currentCardLevel.toString()))
                    const newLevel = Math.min(9, numLevel + 1)
                    onManualCardLevelChange(newLevel)
                  }}
                  className="h-8 w-8 p-0 rounded-r-lg hover:bg-accent hover:text-accent-foreground"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          
          {/* Number of Targets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Targets:</Label>
              <div className="flex items-center gap-1 bg-background/50 rounded-lg border border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onManualTargetsChange(Math.max(1, currentTargets - 1))}
                  disabled={currentTargets <= 1}
                  className="h-8 w-8 p-0 rounded-l-lg hover:bg-accent hover:text-accent-foreground"
                >
                  -
                </Button>
                <span className="w-10 text-center text-sm font-medium">{currentTargets}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onManualTargetsChange(Math.min(10, currentTargets + 1))}
                  disabled={currentTargets >= 10}
                  className="h-8 w-8 p-0 rounded-r-lg hover:bg-accent hover:text-accent-foreground"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          
          {/* Lost Icon */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Lost Icon:</Label>
              <Select
                value={currentLostIcon.toString()}
                onValueChange={(value) => onManualLostIconChange(value === 'true')}
              >
                <SelectTrigger className="w-24 h-8 rounded-lg border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Add'l Enhance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Add'l Enhance:</Label>
              <div className="flex items-center gap-1 bg-background/50 rounded-lg border border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onExistingEnhancementsChange(Math.max(0, existingEnhancements - 1))}
                  disabled={existingEnhancements <= 0}
                  className="h-8 w-8 p-0 rounded-l-lg hover:bg-accent hover:text-accent-foreground"
                >
                  -
                </Button>
                <span className="w-10 text-center text-sm font-medium">{existingEnhancements}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onExistingEnhancementsChange(Math.min(10, existingEnhancements + 1))}
                  disabled={existingEnhancements >= 10}
                  className="h-8 w-8 p-0 rounded-r-lg hover:bg-accent hover:text-accent-foreground"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          
          {selectedSpot.isSummon && (
            <div className="flex justify-between">
              <span>Summon Enhancement:</span>
              <span className="font-medium text-white">Yes</span>
            </div>
          )}
          
          {/* Hex Count for Area-of-Effect */}
          {selectedEnhancement === 'areaHex' && (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label className="text-sm">
                  {selectedCardData?.hexCount ? 'Override hex count:' : 'Number of existing hexes:'}
                </Label>
                {selectedCardData?.hexCount && (
                  <span className="text-xs text-muted-foreground">
                    Card default: {selectedCardData.hexCount} hexes
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-background/50 rounded-lg border border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onHexCountChange(Math.max(1, hexCount - 1))}
                    disabled={hexCount <= 1}
                    className="h-8 w-8 p-0 rounded-l-lg hover:bg-accent hover:text-accent-foreground"
                  >
                    -
                  </Button>
                  <span className="w-10 text-center text-sm font-medium">{hexCount}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onHexCountChange(Math.min(20, hexCount + 1))}
                    disabled={hexCount >= 20}
                    className="h-8 w-8 p-0 rounded-r-lg hover:bg-accent hover:text-accent-foreground"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Reset Button */}
        <div className="pt-4 border-t border-border/50 flex justify-center">
          <Button
            onClick={onResetToDefaults}
            size="sm"
            className="w-auto bg-accent text-black hover:bg-accent/90 border-0 px-[10px]"
          >
            <ArrowCounterClockwise fontSize="small" className="mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}