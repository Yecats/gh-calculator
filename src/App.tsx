import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AutoAwesome as Calculator, 
  Visibility as Eye, 
  GridOn as GridNine, 
  Add as Plus, 
  Help as Question, 
  Star,
  Edit as EditIcon
} from '@mui/icons-material'
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
import { CardEditor } from '@/components/CardEditor'

// Import utilities
import { getAvailableEnhancements, calculateEnhancementCost } from '@/utils/enhancements'

const CHARACTER_CLASSES: CharacterClass[] = characterClasses || []
const isDev = import.meta.env.DEV

// Merge mindthief data with existing cards data
const INITIAL_CLASSES = {
  ...cardsData,
  MT: {
    name: "Mindthief",
    cards: mindthiefData.cards
  }
} as Record<string, ClassData>

function App() {
  const [activeTab, setActiveTab] = useState<string>('calculator')
  const [classes, setClasses] = useState<Record<string, ClassData>>(INITIAL_CLASSES)
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedSpot, setSelectedSpot] = useState<EnhancementSpot | null>(null)
  const [selectedEnhancement, setSelectedEnhancement] = useState<string>('')
  const [currentCost, setCurrentCost] = useState<number>(0)
  const [enhancementList, setEnhancementList] = useState<EnhancementItem[]>([])
  const [showMarkRestrictions, setShowMarkRestrictions] = useState<boolean>(false)

  // Auto-save when switching from editor to calculator
  const handleTabChange = async (newTab: string) => {
    // If switching from editor to calculator, save changes to files first
    if (activeTab === 'editor' && newTab === 'calculator' && isDev) {
      try {
        const savedClasses = localStorage.getItem('gh-calculator-classes')
        if (savedClasses) {
          const classes = JSON.parse(savedClasses)
          
          const response = await fetch('http://localhost:3001/api/save-all-classes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ classes })
          })
          
          if (response.ok) {
            const result = await response.json()
            console.log('✅ Auto-saved to files when switching tabs:', result.files)
            
            // Small delay to allow file save to complete
            setTimeout(() => {
              setActiveTab(newTab)
            }, 200)
            return
          }
        }
      } catch (error) {
        console.log('Could not auto-save to files:', error)
      }
    }
    
    // Normal tab switch (no save needed)
    setActiveTab(newTab)
  }
  const [cardSelectOpen, setCardSelectOpen] = useState<boolean>(false)
  const [showCalculation, setShowCalculation] = useState<boolean>(false)
  
  // Manual overrides for card properties - initialize with defaults when card changes
  const [manualCardLevel, setManualCardLevel] = useState<number | string>('')
  const [manualTargets, setManualTargets] = useState<number | null>(null)
  const [manualLostIcon, setManualLostIcon] = useState<boolean | null>(null)
  
  // Only user-controlled modifiers
  const [existingEnhancements, setExistingEnhancements] = useState<number>(0)
  const [hexCount, setHexCount] = useState<number>(1)
  
  const selectedClassData = selectedClass ? classes[selectedClass] : null
  const selectedCardData = selectedClassData && selectedCard ? selectedClassData.cards[selectedCard] : null

  // Load saved classes from localStorage on mount (dev mode only)
  useEffect(() => {
    if (isDev) {
      const saved = localStorage.getItem('gh-calculator-classes')
      console.log('🔍 App.tsx checking localStorage on mount:', saved ? 'Data found' : 'No data')
      if (saved) {
        try {
          const savedClasses = JSON.parse(saved)
          console.log('📖 App.tsx loaded saved classes:', Object.keys(savedClasses))
          setClasses(savedClasses)
          console.log('📖 Loaded saved classes from localStorage')
        } catch (e) {
          console.error('Failed to load saved classes:', e)
        }
      }
    }
  }, [])

  // Also reload classes when switching TO calculator tab (in case editor made changes)
  useEffect(() => {
    if (activeTab === 'calculator' && isDev) {
      const saved = localStorage.getItem('gh-calculator-classes')
      console.log('🔍 App.tsx checking localStorage on tab switch to calculator:', saved ? 'Data found' : 'No data')
      if (saved) {
        try {
          const savedClasses = JSON.parse(saved)
          console.log('🔄 App.tsx refreshing with saved classes:', Object.keys(savedClasses))
          setClasses(savedClasses)
          console.log('🔄 Refreshed classes from localStorage for calculator')
        } catch (e) {
          console.error('Failed to refresh saved classes:', e)
        }
      }
    }
  }, [activeTab])

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
    setShowCalculation(false)
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
    setShowCalculation(false)
    // Initialize manual overrides to empty so they use card defaults
    setManualCardLevel('')
    setManualTargets(null)
    setManualLostIcon(null)
  }, [selectedCard])

  // Reset mark restrictions when spot changes
  useEffect(() => {
    setShowMarkRestrictions(false)
  }, [selectedSpot])

  // Auto-scroll when new sections appear
  useEffect(() => {
    if (selectedClass) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }, 100)
    }
  }, [selectedClass])

  useEffect(() => {
    if (selectedCard && selectedCardData) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }, 100)
    }
  }, [selectedCard, selectedCardData])

  useEffect(() => {
    if (selectedSpot) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }, 100)
    }
  }, [selectedSpot])

  useEffect(() => {
    if (selectedEnhancement) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }, 100)
    }
  }, [selectedEnhancement])

  useEffect(() => {
    if (showCalculation) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }, 100)
    }
  }, [showCalculation])
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
            <Calculator fontSize="large" style={{ color: 'white' }} />
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Gloomhaven Second Edition Enhancement Calculator
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Calculate the gold cost of enhancing your ability cards for Gloomhaven Second Edition
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {isDev && (
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calculator" className="flex items-center gap-2">
                <Calculator fontSize="small" />
                Calculator
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <EditIcon fontSize="small" />
                Card Editor (Dev)
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="calculator" className={`space-y-8 ${isDev ? 'mt-6' : 'mt-0'}`}>
            {/* Calculator Content */}
            <div className="space-y-8">{/* Class and Card Selection */}
          <div className="space-y-6">
            {/* Class Selection */}
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <GridNine className="text-white" fontSize="small" />
                  </div>
                  Select Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <ClassSelector
                    characterClasses={CHARACTER_CLASSES}
                    selectedClass={selectedClass}
                    onClassSelect={setSelectedClass}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Card Selection and Preview */}
            {selectedClass && (
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <Eye className="text-white" fontSize="small" />
                    </div>
                    Select Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Card Preview and Enhancement Spots */}
                    {selectedCard && selectedCardData ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Card Selector and Card Picture */}
                        <div className="w-full max-w-sm mx-auto lg:max-w-none lg:mx-0 space-y-4">
                          <CardSelector
                            selectedClassData={selectedClassData}
                            selectedCard={selectedCard}
                            cardSelectOpen={cardSelectOpen}
                            onCardSelectOpenChange={setCardSelectOpen}
                            onCardSelect={setSelectedCard}
                          />
                          <CardPreview selectedCardData={selectedCardData} />
                        </div>
                        
                        {/* Right Column: Enhancement Spots */}
                        <div className="w-full lg:mt-16">
                          <EnhancementSpots
                            spots={availableSpots}
                            selectedSpot={selectedSpot}
                            onSpotSelect={setSelectedSpot}
                          />
                        </div>
                      </div>
                    ) : (
                      /* Card Selector only when no card selected */
                      <div className="w-full max-w-md">
                        <CardSelector
                          selectedClassData={selectedClassData}
                          selectedCard={selectedCard}
                          cardSelectOpen={cardSelectOpen}
                          onCardSelectOpenChange={setCardSelectOpen}
                          onCardSelect={setSelectedCard}
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
                    <Star className="text-white" fontSize="small" />
                  </div>
                  Enhancements
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 h-8 w-8 rounded-full bubble-button ml-auto"
                    onClick={() => setShowMarkRestrictions(!showMarkRestrictions)}
                  >
                    <Question className="text-white" fontSize="small" />
                  </Button>
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
                      showCalculation={showCalculation}
                      onShowCalculationChange={setShowCalculation}
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
          </TabsContent>

          {isDev && (
            <TabsContent value="editor" className="space-y-8 mt-6">
              <CardEditor />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}

export default App