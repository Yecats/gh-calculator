export interface MarkType {
  name: string
  restrictions: string[]
}

export interface Enhancement {
  name: string
  baseCost: number
  marks: string[]
  special?: string
  requiredAbilityTypes?: string[]
  requiredAbilityProperties?: string[]
}

export interface EnhancementSpot {
  id: string
  type: string
  description: string
  x: number
  y: number
  region: string
  isSummon: boolean
  targets?: number
  hasLostIcon: boolean
  allowedSummonEnhancements?: string[]
  abilityTypes: string[]
  abilityProperties?: string[]
}

export interface Card {
  name: string
  level: number | string
  image: string
  enhancementSpots: EnhancementSpot[]
}

export interface ClassData {
  name: string
  cards: Record<string, Card>
}

export interface EnhancementItem {
  id: string
  cardName: string
  spotId: string
  spotDescription: string
  markType: string
  enhancement: string
  cost: number
  modifiers: string[]
}

export interface CharacterClass {
  id: string
  name: string
  color: string
  icon?: string
}