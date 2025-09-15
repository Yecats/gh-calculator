import { Enhancement, EnhancementSpot, Card } from '@/types'
import markTypes from '@/data/mark-types.json'
import enhancements from '@/data/enhancements.json'

const MARK_TYPES: Record<string, any> = markTypes
const ENHANCEMENTS: Record<string, Enhancement> = enhancements

export const getAvailableEnhancements = (selectedSpot: EnhancementSpot | null) => {
  return Object.entries(ENHANCEMENTS).filter(([key, enhancement]) => {
    if (!selectedSpot) return false
    
    // Special case for Jump: Square marks can only use Jump if it's a non-summon move ability
    if (key === 'jump') {
      return selectedSpot.type === 'square' && 
             selectedSpot.abilities.includes('move') && 
             !selectedSpot.isSummon
    }
    
    // Check if this spot allows this enhancement based on mark type
    if (!enhancement.marks.includes(selectedSpot.type)) return false
    
    // If this is a summon spot, check granular summon enhancement permissions
    if (selectedSpot.isSummon) {
      // If the spot has specific allowed summon enhancements, use those
      if (selectedSpot.allowedSummonEnhancements) {
        return selectedSpot.allowedSummonEnhancements.includes(key)
      }
      // Otherwise, default to all summon enhancements
      return [
        'summonHp1', 'summonMove1', 'summonAttack1', 'summonRange1'
      ].includes(key)
    }
    
    // If this is not a summon spot, hide summon-specific enhancements
    if (['summonHp1', 'summonMove1', 'summonAttack1', 'summonRange1'].includes(key)) {
      return false
    }
    
    // Check ability compatibility - enhancement must be compatible with at least one ability
    if (enhancement.requiredAbilityTypes && selectedSpot.abilities) {
      const hasMatchingAbility = enhancement.requiredAbilityTypes.some(requiredType => 
        selectedSpot.abilities.includes(requiredType)
      )
      if (!hasMatchingAbility) return false
    }
    
    // Check ability property compatibility - if enhancement requires specific properties, spot must have them
    if (enhancement.requiredAbilityProperties && enhancement.requiredAbilityProperties.length > 0) {
      if (!selectedSpot.abilities || selectedSpot.abilities.length === 0) {
        return false
      }
      const hasMatchingProperty = enhancement.requiredAbilityProperties.some(requiredProperty =>
        selectedSpot.abilities.includes(requiredProperty)
      )
      if (!hasMatchingProperty) return false
    }
    
    // If enhancement has neither ability types nor properties requirements, allow it
    // If enhancement has only property requirements, it's already been checked above
    // If enhancement has ability type requirements, it's already been checked above
    return true
  })
}

export const calculateEnhancementCost = (
  enhancementKey: string,
  spot: EnhancementSpot,
  options: {
    selectedCardData: Card | null
    manualCardLevel: number | string
    manualTargets: number | null
    manualLostIcon: boolean | null
    existingEnhancements: number
    hexCount: number
  }
): number => {
  const enhancement = ENHANCEMENTS[enhancementKey]
  if (!enhancement) return 0
  
  let cost = enhancement.baseCost
  
  // Get the card level, treating X cards as level 1
  // Use manual override if set, otherwise use card data
  const actualCardLevel = options.manualCardLevel !== '' ? options.manualCardLevel : options.selectedCardData?.level
  const cardLevel = actualCardLevel === 'X' ? 1 : 
                   (typeof actualCardLevel === 'number' ? actualCardLevel : 1)
  
  // Use manual overrides if set, otherwise use spot data
  const targets = options.manualTargets !== null ? options.manualTargets : (spot.targets || 1)
  const hasLostIcon = options.manualLostIcon !== null ? options.manualLostIcon : spot.hasLostIcon
  
  // Apply cost modifiers in order
  // 1. Multiple targets - double the cost
  if (targets > 1) {
    cost *= 2
  }
  
  // 2. Lost icon - halve the cost
  if (hasLostIcon) {
    cost = Math.floor(cost / 2)
  }
  
  // 3. Ability level - add 25 gold per level above 1
  if (cardLevel > 1) {
    cost += (cardLevel - 1) * 25
  }
  
  // 4. Existing enhancements - add 75 gold per existing enhancement (user input)
  cost += options.existingEnhancements * 75
  
  // 5. Special case for Area-of-Effect Hex
  if (enhancement.special === 'dividedByHexes') {
    // Use card's existing hex count, or manual input if no card data
    const existingHexes = options.selectedCardData?.hexCount || options.hexCount
    if (existingHexes > 0) {
      cost = Math.ceil(cost / existingHexes)
    }
  }
  
  return cost
}