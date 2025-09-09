import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator, Eye, GridNine, Plus } from '@phosphor-icons/react'
import cardsData from '@/data/cards.json'
import mindthiefData from '@/data/mindthief.json'
import characterClasses from '@/data/classes.json'

// Import types
import { 
  EnhancementSpot, 
  Card as CardType, 
  ClassData, 
  EnhancementItem, 
  CharacterClass 
} from '@/types'

// Import components
import { ClassSelector } from '@/components/ClassSelector'
import { CardSelector, CardPreview } from '@/components/CardSelector'
import { EnhancementSpots } from '@/components/EnhancementSpots'
import { EnhancementStickers } from '@/components/EnhancementStickers'
import { CostModifiers } from '@/components/CostModifiers'
import { CostDisplay } from '@/components/CostDisplay'
import { EnhancementList } from '@/components/EnhancementList'

// Import utilities
import { getAvailableEnhancements, calculateEnhancementCost } from '@/utils/enhancements'

const CHARACTER_CLASSES: CharacterClass[] = characterClasses || []

// Merge mindthief data with existing cards data
const CLASSES = {
  ...cardsData,
  MT: {
    name: "Mindthief",
    cards: mindthiefData.cards
  }
} as Record<string, ClassData>

function App() {
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedSpot, setSelectedSpot] = useState<EnhancementSpot | null>(null)
  const [selectedEnhancement, setSelectedEnhancement] = useState<string>('')
  const [currentCost, setCurrentCost] = useState<number>(0)
  const [enhancementList, setEnhancementList] = useState<EnhancementItem[]>([])
  const [showMarkRestrictions, setShowMarkRestrictions] = useState<boolean>(false)
  const [cardSelectOpen, setCardSelectOpen] = useState<boolean>(false)
  
  // Manual overrides for card properties - initialize with defaults when card changes
  const [manualCardLevel, setManualCardLevel] = useState<number | string>('')
  const [manualTargets, setManualTargets] = useState<number | null>(null)
  const [manualLostIcon, setManualLostIcon] = useState<boolean | null>(null)
  
  // Only user-controlled modifiers
  const [existingEnhancements, setExistingEnhancements] = useState<number>(0)
  const [hexCount, setHexCount] = useState<number>(1)
  
  const selectedClassData = selectedClass ? CLASSES[selectedClass] : null
  const selectedCardData = selectedClassData && selectedCard ? selectedClassData.cards[selectedCard] : null
  
  // Get all enhancement spots for selected card
  const availableSpots = selectedCardData 
    ? selectedCardData.enhancementSpots
    : []
  
  const availableEnhancements = getAvailableEnhancements(selectedSpot)
  
  const addToList = () => {
    if (!selectedSpot || !selectedEnhancement || currentCost === 0 || !selectedCardData) return
    
    // Use manual overrides if set, otherwise use card/spot data
    const actualCardLevel = manualCardLevel !== '' ? manualCardLevel : selectedCardData.level
    const cardLevel = actualCardLevel === 'X' ? 1 : (typeof actualCardLevel === 'number' ? actualCardLevel : 1)
    const targets = manualTargets !== null ? manualTargets : (selectedSpot.targets || 1)
    const hasLostIcon = manualLostIcon !== null ? manualLostIcon : selectedSpot.hasLostIcon
    
    const modifiersList: string[] = []
    if (targets > 1) modifiersList.push(`${targets} Targets (×2)`)
    if (hasLostIcon) modifiersList.push('Lost Icon (÷2)')
    if (cardLevel > 1) modifiersList.push(`Level ${cardLevel} (+${(cardLevel - 1) * 25})`)
    if (existingEnhancements > 0) modifiersList.push(`${existingEnhancements} Existing (+${existingEnhancements * 75})`)
    if (selectedEnhancement === 'areaHex' && hexCount > 1) modifiersList.push(`÷${hexCount} hexes`)
    
    const newItem: EnhancementItem = {
      id: Date.now().toString(),
      cardName: selectedCardData?.name || 'Unknown Card',
      spotId: selectedSpot?.id || '',
      spotDescription: selectedSpot?.description || '',
      markType: selectedSpot?.type || '',
      enhancement: selectedEnhancement,
      cost: currentCost,
      modifiers: modifiersList
    }
    
    setEnhancementList(current => [...current, newItem])
    
    // Reset enhancement selection
    setSelectedSpot(null)
    setSelectedEnhancement('')
    setCurrentCost(0)
  }
  
  const removeFromList = (id: string) => {
    setEnhancementList(current => current.filter(item => item.id !== id))
  }
  
  const clearAll = () => {
    setEnhancementList([])
    setSelectedClass('')
    setSelectedCard('')
    setSelectedSpot(null)
    setSelectedEnhancement('')
    setCurrentCost(0)
    setExistingEnhancements(0)
    setHexCount(1)
    setShowMarkRestrictions(false)
    setCardSelectOpen(false)
    setManualCardLevel('')
    setManualTargets(null)
    setManualLostIcon(null)
  }
  
  const resetCostModifiers = () => {
    setExistingEnhancements(0)
    setHexCount(1)
    setManualCardLevel('')
    setManualTargets(null)
    setManualLostIcon(null)
  }
  
  const resetToCardDefaults = () => {
    setManualCardLevel('')
    setManualTargets(null)
    setManualLostIcon(null)
    setExistingEnhancements(0)
    setHexCount(1)
  }
  
  // Auto-calculate cost when enhancement or modifiers change
  useEffect(() => {
    if (selectedSpot && selectedEnhancement) {
      const cost = calculateEnhancementCost(selectedEnhancement, selectedSpot, {
        selectedCardData,
        manualCardLevel,
        manualTargets,
        manualLostIcon,
        existingEnhancements,
        hexCount
      })
      setCurrentCost(cost)
    }
  }, [selectedSpot, selectedEnhancement, existingEnhancements, hexCount, manualCardLevel, manualTargets, manualLostIcon, selectedCardData])

  // Reset dependent selections when class changes
  useEffect(() => {
    setSelectedCard('')
    setSelectedSpot(null)
    setSelectedEnhancement('')
    setCurrentCost(0)
    setShowMarkRestrictions(false)
    setCardSelectOpen(false)
    setManualCardLevel('')
    setManualTargets(null)
    setManualLostIcon(null)
  }, [selectedClass])

  // Reset dependent selections when card changes and initialize defaults
  useEffect(() => {
    setSelectedSpot(null)
    setSelectedEnhancement('')
    setCurrentCost(0)
    setShowMarkRestrictions(false)
    // Initialize manual overrides to empty so they use card defaults
    setManualCardLevel('')
    setManualTargets(null)
    setManualLostIcon(null)
  }, [selectedCard])

  // Reset mark restrictions when spot changes
  useEffect(() => {
    setShowMarkRestrictions(false)
  }, [selectedSpot])
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
            <Calculator className="text-primary-foreground" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Gloomhaven Second Edition Enhancement Calculator
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Calculate the gold cost of enhancing your ability cards for Gloomhaven Second Edition
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Class and Card Selection */}
          <div className="space-y-6">
            {/* Class Selection */}
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <GridNine className="text-primary-foreground" size={20} />
                  </div>
                  Character Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ClassSelector
                  characterClasses={CHARACTER_CLASSES}
                  selectedClass={selectedClass}
                  onClassSelect={setSelectedClass}
                />
              </CardContent>
            </Card>
            
            {/* Card Selection and Preview */}
            {selectedClass && (
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <Eye className="text-accent-foreground" size={20} />
                    </div>
                    Select Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Card Selector */}
                    <CardSelector
                      selectedClassData={selectedClassData}
                      selectedCard={selectedCard}
                      cardSelectOpen={cardSelectOpen}
                      onCardSelectOpenChange={setCardSelectOpen}
                      onCardSelect={setSelectedCard}
                    />
                    
                    {/* Card Preview and Region Selection - Side by Side */}
                    {selectedCard && selectedCardData && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
                        {/* Card Picture - Left Side */}
                        <CardPreview selectedCardData={selectedCardData} />
                        
                        {/* Region and Spot Selection - Right Side */}
                        <EnhancementSpots
                          spots={availableSpots}
                          selectedSpot={selectedSpot}
                          onSpotSelect={setSelectedSpot}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Enhancement Selection */}
          {selectedSpot && (
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Plus className="text-primary-foreground" size={20} />
                  </div>
                  Enhancements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <EnhancementStickers
                  selectedSpot={selectedSpot}
                  availableEnhancements={availableEnhancements}
                  selectedEnhancement={selectedEnhancement}
                  onEnhancementSelect={setSelectedEnhancement}
                  showMarkRestrictions={showMarkRestrictions}
                  onShowMarkRestrictionsChange={setShowMarkRestrictions}
                />
                
                {/* Cost Modifiers */}
                {selectedEnhancement && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    <CostModifiers
                      selectedCardData={selectedCardData}
                      selectedSpot={selectedSpot}
                      selectedEnhancement={selectedEnhancement}
                      manualCardLevel={manualCardLevel}
                      manualTargets={manualTargets}
                      manualLostIcon={manualLostIcon}
                      existingEnhancements={existingEnhancements}
                      hexCount={hexCount}
                      onManualCardLevelChange={setManualCardLevel}
                      onManualTargetsChange={setManualTargets}
                      onManualLostIconChange={setManualLostIcon}
                      onExistingEnhancementsChange={setExistingEnhancements}
                      onHexCountChange={setHexCount}
                      onResetToDefaults={resetToCardDefaults}
                    />
                    
                    {/* Current Cost Display */}
                    <CostDisplay
                      currentCost={currentCost}
                      onAddToList={addToList}
                      selectedSpot={selectedSpot}
                      selectedEnhancement={selectedEnhancement}
                      selectedCardData={selectedCardData}
                      manualCardLevel={manualCardLevel}
                      manualTargets={manualTargets}
                      manualLostIcon={manualLostIcon}
                      existingEnhancements={existingEnhancements}
                      hexCount={hexCount}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        
          {/* Enhancement List */}
          <EnhancementList
            enhancementList={enhancementList}
            onRemoveItem={removeFromList}
            onClearAll={clearAll}
          />
        </div>
      </div>
    </div>
  )
}

export default App