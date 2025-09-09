import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Add as Plus, 
  MonetizationOn as Coins, 
  Calculate as Calculator, 
  KeyboardArrowDown as CaretDown, 
  KeyboardArrowUp as CaretUp 
} from '@mui/icons-material'
import { EnhancementSpot, Card, Enhancement } from '@/types'
import enhancements from '@/data/enhancements.json'

interface CostDisplayProps {
  currentCost: number
  onAddToList: () => void
  selectedSpot?: EnhancementSpot | null
  selectedEnhancement?: string
  selectedCardData?: Card | null
  manualCardLevel?: number | string
  manualTargets?: number | null
  manualLostIcon?: boolean | null
  existingEnhancements?: number
  hexCount?: number
  showCalculation?: boolean
  onShowCalculationChange?: (show: boolean) => void
}

interface CalculationStep {
  description: string
  operation: string
  result: number
  isPositive?: boolean
  isNegative?: boolean
}

export function CostDisplay({ 
  currentCost, 
  onAddToList,
  selectedSpot,
  selectedEnhancement,
  selectedCardData,
  manualCardLevel,
  manualTargets,
  manualLostIcon,
  existingEnhancements = 0,
  hexCount = 1,
  showCalculation = false,
  onShowCalculationChange
}: CostDisplayProps) {

  if (currentCost <= 0) return null

  // Calculate the step-by-step breakdown
  const getCalculationSteps = (): CalculationStep[] => {
    if (!selectedEnhancement || !selectedSpot) return []

    const enhancement = enhancements[selectedEnhancement as keyof typeof enhancements] as Enhancement
    if (!enhancement) return []

    const steps: CalculationStep[] = []
    let runningCost = enhancement.baseCost

    // Start with base cost
    steps.push({
      description: `Base cost`,
      operation: `${enhancement.baseCost}g`,
      result: runningCost
    })

    // Get the card level, treating X cards as level 1
    const actualCardLevel = manualCardLevel !== '' ? manualCardLevel : selectedCardData?.level
    const cardLevel = actualCardLevel === 'X' ? 1 : 
                     (typeof actualCardLevel === 'number' ? actualCardLevel : 1)

    // Use manual overrides if set, otherwise use spot data
    // Explicitly handle all the undefined/null cases
    const targetsValue = selectedSpot?.targets ?? 1
    const targets: number = (manualTargets !== null && manualTargets !== undefined) ? manualTargets : targetsValue
    const hasLostIcon = (manualLostIcon !== null && manualLostIcon !== undefined) ? manualLostIcon : (selectedSpot?.hasLostIcon ?? false)

    // Multiple targets - double the cost
    if (targets > 1) {
      const newCost = runningCost * 2
      steps.push({
        description: `${targets} targets`,
        operation: `x2`,
        result: newCost,
        isPositive: true
      })
      runningCost = newCost
    }

    // Lost icon - halve the cost
    if (hasLostIcon) {
      const newCost = Math.floor(runningCost / 2)
      steps.push({
        description: 'Lost icon',
        operation: `÷ 2`,
        result: newCost,
        isNegative: true
      })
      runningCost = newCost
    }

    // Card level - add 25 gold per level above 1
    if (cardLevel > 1) {
      const levelBonus = (cardLevel - 1) * 25
      const newCost = runningCost + levelBonus
      steps.push({
        description: `Level ${cardLevel}`,
        operation: `+${levelBonus}`,
        result: newCost,
        isPositive: true
      })
      runningCost = newCost
    }

    // Existing enhancements
    if (existingEnhancements > 0) {
      const enhancementBonus = existingEnhancements * 75
      const newCost = runningCost + enhancementBonus
      steps.push({
        description: `Add'l Enhance`,
        operation: `+${enhancementBonus}`,
        result: newCost,
        isPositive: true
      })
      runningCost = newCost
    }

    // Special case for Area-of-Effect Hex
    if (enhancement.special === 'dividedByHexes' && hexCount > 1) {
      const newCost = Math.ceil(runningCost / hexCount)
      steps.push({
        description: `Divided by ${hexCount} hexes`,
        operation: `${runningCost} ÷ ${hexCount}`,
        result: newCost,
        isNegative: true
      })
      runningCost = newCost
    }

    return steps
  }

  const calculationSteps = getCalculationSteps()

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
          <Coins className="text-white" fontSize="small" />
        </div>
        <label className="text-sm font-medium">Enhancement Cost</label>
      </div>
      
      <div className="w-full text-center p-4 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg border-2 border-accent/30 glass-card flex flex-col flex-1">
        {/* Show breakdown button */}
        {calculationSteps.length > 1 && (
          <div className="mb-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowCalculationChange?.(!showCalculation)}
              className="h-7 px-3 py-1 text-xs text-muted-foreground hover:text-foreground border-border/50 hover:border-accent/50 hover:bg-accent/10"
            >
              <Calculator fontSize="small" className="mr-1" />
              {showCalculation ? 'Hide' : 'Show'} Breakdown
            </Button>
          </div>
        )}

        {/* Calculation Breakdown */}
        {showCalculation && calculationSteps.length > 1 && (
          <div className="mb-4">
            <div className="w-full p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-foreground">Cost Calculation</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShowCalculationChange?.(false)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/10"
                >
                  <CaretUp style={{ fontSize: 12 }} />
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                {calculationSteps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground">{step.description}:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{step.operation}</span>
                      <span className={`font-medium min-w-[60px] text-right ${
                        step.isPositive ? 'text-destructive' : 
                        step.isNegative ? 'text-accent' : 'text-foreground'
                      }`}>
                        = {step.result}g
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main content centered when no breakdown */}
        <div className={`flex-1 flex flex-col ${showCalculation ? 'justify-start' : 'justify-center'}`}>
          <div className="text-4xl font-bold text-accent mb-4 flex items-center justify-center gap-3">
            <Coins style={{ fontSize: 36 }} className="text-accent" />
            <span>{currentCost} Gold</span>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={onAddToList}
              className="flex items-center gap-2 rounded-lg bubble-button px-8 py-3 bg-accent hover:bg-accent/90 text-black font-normal"
            >
              <Plus style={{ fontSize: 18 }} />
              Add to List
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}