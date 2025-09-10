import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  GridOn as GridNine, 
  Add as Plus, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  Image as ImageIcon,
  Folder as FolderIcon
} from '@mui/icons-material'

// Only show in development mode
const isDev = import.meta.env.DEV
import { ClassSelector } from '@/components/ClassSelector'
import { ImageSelector } from '@/components/ImageSelector'
import characterClasses from '@/data/classes.json'
import cardsData from '@/data/cards.json'
import mindthiefData from '@/data/mindthief.json'
import { ClassData, Card as CardType, EnhancementSpot, CharacterClass } from '@/types'

const CHARACTER_CLASSES: CharacterClass[] = characterClasses || []

// Merge mindthief data with existing cards data
const INITIAL_CLASSES = {
  ...cardsData,
  MT: {
    name: "Mindthief", 
    cards: mindthiefData.cards
  }
} as Record<string, ClassData>

const MARK_TYPES = [
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'diamondPlus', label: 'Diamond Plus' }
]

const ABILITY_OPTIONS = [
  // Core ability types
  'attack', 'move', 'heal', 'special', 'summon',
  // Properties/keywords that can modify abilities
  'range', 'pierce', 'push', 'pull', 'target', 'immobilize', 'muddle', 'poison', 
  'wound', 'stun', 'disarm', 'invisible', 'strengthen', 'bless', 'curse', 'hex',
  'shield', 'retaliate', 'teleport'
]

const REGIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' }
]

export function CardEditor() {
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [classes, setClasses] = useState<Record<string, ClassData>>(INITIAL_CLASSES)
  const [editingCard, setEditingCard] = useState<CardType | null>(null)
  const [editingSpot, setEditingSpot] = useState<EnhancementSpot | null>(null)
  const [isCreatingCard, setIsCreatingCard] = useState(false)
  const [newCardData, setNewCardData] = useState<Partial<CardType>>({
    name: '',
    level: 1,
    image: '',
    enhancementSpots: []
  })

  const selectedClassData = selectedClass ? classes[selectedClass] : null
  const cards = selectedClassData ? Object.entries(selectedClassData.cards) : []

  // Auto-save to localStorage whenever classes change
  useEffect(() => {
    if (isDev) {
      console.log('💾 CardEditor saving to localStorage:', Object.keys(classes))
      localStorage.setItem('gh-calculator-classes', JSON.stringify(classes))
    }
  }, [classes])

  // Load from localStorage on mount
  useEffect(() => {
    if (isDev) {
      const saved = localStorage.getItem('gh-calculator-classes')
      console.log('🔍 CardEditor checking localStorage on mount:', saved ? 'Data found' : 'No data')
      if (saved) {
        try {
          const savedClasses = JSON.parse(saved)
          console.log('📖 CardEditor loaded saved classes:', Object.keys(savedClasses))
          setClasses(savedClasses)
        } catch (e) {
          console.error('Failed to load saved classes:', e)
        }
      }
    }
  }, [])

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId)
    setSelectedCard('')
    setEditingCard(null)
    setEditingSpot(null)
    setIsCreatingCard(false)
  }

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId)
    if (selectedClassData && cardId) {
      setEditingCard({ ...selectedClassData.cards[cardId] })
    } else {
      setEditingCard(null)
    }
    setEditingSpot(null)
    setIsCreatingCard(false)
  }

  const handleCreateNewCard = () => {
    setIsCreatingCard(true)
    setEditingCard({
      name: '',
      level: 1,
      image: '',
      enhancementSpots: []
    })
    setSelectedCard('')
    setEditingSpot(null)
  }

  const handleSaveCard = () => {
    if (!selectedClass || !editingCard || !editingCard.name) return

    const cardId = editingCard.name.toLowerCase().replace(/\s+/g, '-')
    
    setClasses(prev => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        cards: {
          ...prev[selectedClass].cards,
          [cardId]: editingCard
        }
      }
    }))

    if (isCreatingCard) {
      setSelectedCard(cardId)
      setIsCreatingCard(false)
    }
    
    // Only save to localStorage, NOT to files (to prevent page reload)
    // Files will be saved when user clicks "Save to Project Files" button
  }

  const handleDeleteCard = () => {
    if (!selectedClass || !selectedCard || !selectedClassData) return

    const { [selectedCard]: deletedCard, ...remainingCards } = selectedClassData.cards
    
    setClasses(prev => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        cards: remainingCards
      }
    }))

    setSelectedCard('')
    setEditingCard(null)
    setEditingSpot(null)
  }

  const handleAddSpot = () => {
    if (!editingCard) return

    const newSpot: EnhancementSpot = {
      id: `spot-${Date.now()}`,
      type: 'circle',
      description: '',
      region: 'top',
      isSummon: false,
      targets: 1,
      hasLostIcon: false,
      abilities: []
    }

    setEditingCard(prev => prev ? {
      ...prev,
      enhancementSpots: [...prev.enhancementSpots, newSpot]
    } : null)
  }

  const handleEditSpot = (spot: EnhancementSpot) => {
    setEditingSpot({ ...spot })
  }

  const handleSaveSpot = () => {
    if (!editingCard || !editingSpot || !selectedClass) return

    // Update the editing card with the new spot data
    const updatedCard = {
      ...editingCard,
      enhancementSpots: editingCard.enhancementSpots.map(spot => 
        spot.id === editingSpot.id ? editingSpot : spot
      )
    }
    
    setEditingCard(updatedCard)
    
    // IMPORTANT: Also save the card back to the main classes state
    const cardId = selectedCard || editingCard.name.toLowerCase().replace(/\s+/g, '-')
    setClasses(prev => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        cards: {
          ...prev[selectedClass].cards,
          [cardId]: updatedCard
        }
      }
    }))

    setEditingSpot(null)
    
    // Only save to localStorage, NOT to files (to prevent page reload)
    // Files will be saved when user clicks "Save to Project Files" button
  }

  const handleDeleteSpot = (spotId: string) => {
    if (!editingCard) return

    setEditingCard(prev => prev ? {
      ...prev,
      enhancementSpots: prev.enhancementSpots.filter(spot => spot.id !== spotId)
    } : null)

    if (editingSpot?.id === spotId) {
      setEditingSpot(null)
    }
  }

  const handleExportClass = () => {
    if (!selectedClass || !selectedClassData) return

    const dataToExport = {
      cards: selectedClassData.cards
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedClassData.name.toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportAllClasses = () => {
    Object.entries(classes).forEach(([classId, classData]) => {
      const dataToExport = {
        cards: classData.cards
      }

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${classData.name.toLowerCase()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  // Manual save to development server
  const saveToDevServer = async () => {
    if (!isDev) return
    
    try {
      const response = await fetch('http://localhost:3001/api/save-all-classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classes })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Saved to files:', result.files)
        alert(`✅ Saved ${result.files.length} files to project!`)
      }
    } catch (error) {
      console.log('Dev server not available, using localStorage only')
      alert('⚠️ Dev server not running. Files not saved to project.')
    }
  }

  // Manual save functionality
  const handleSaveToFiles = () => {
    saveToDevServer()
  }

  const handleAutoSave = () => {
    // Auto-save functionality - writes to localStorage and optionally downloads
    localStorage.setItem('gh-calculator-classes', JSON.stringify(classes))
    
    // Also trigger download of all files
    handleExportAllClasses()
  }

  return (
    <div className="space-y-6">
      {/* Class Selection */}
      <Card className="glass-card border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <GridNine className="text-white" fontSize="small" />
            </div>
            Select Class to Edit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ClassSelector
            characterClasses={CHARACTER_CLASSES}
            selectedClass={selectedClass}
            onClassSelect={handleClassSelect}
          />
        </CardContent>
      </Card>

      {/* Card List and Editor */}
      {selectedClass && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card List */}
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <EditIcon className="text-white" fontSize="small" />
                </div>
                Cards
                <Button 
                  onClick={handleCreateNewCard}
                  className="ml-auto bubble-button"
                  size="sm"
                >
                  <Plus fontSize="small" className="mr-2" />
                  New Card
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {cards.map(([cardId, card]) => (
                  <div
                    key={cardId}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCard === cardId
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted/50 border-border hover:bg-muted'
                    }`}
                    onClick={() => handleCardSelect(cardId)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{card.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Level {card.level} • {card.enhancementSpots.length} spots
                        </p>
                      </div>
                      {selectedCard === cardId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCard()
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {isCreatingCard && (
                  <div className="p-3 rounded-lg border bg-primary/10 border-primary">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">New Card</h3>
                        <p className="text-sm text-muted-foreground">
                          Creating new card...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card Editor */}
          {(editingCard || isCreatingCard) && (
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <EditIcon className="text-white" fontSize="small" />
                  </div>
                  {isCreatingCard ? 'Create Card' : 'Edit Card'}
                  <Button 
                    onClick={handleSaveCard}
                    className="ml-auto bubble-button"
                    size="sm"
                    disabled={!editingCard?.name}
                  >
                    <SaveIcon fontSize="small" className="mr-2" />
                    Save
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Card Basic Info */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="card-name">Card Name</Label>
                    <Input
                      id="card-name"
                      value={editingCard?.name || ''}
                      onChange={(e) => setEditingCard(prev => prev ? { ...prev, name: e.target.value } : null)}
                      placeholder="Enter card name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="card-level">Level</Label>
                      <Input
                        id="card-level"
                        value={editingCard?.level || ''}
                        onChange={(e) => {
                          const value = e.target.value
                          setEditingCard(prev => prev ? { 
                            ...prev, 
                            level: value === 'X' ? 'X' : (parseInt(value) || 1)
                          } : null)
                        }}
                        placeholder="1 or X"
                      />
                    </div>
                    
                    <div>
                      <ImageSelector
                        value={editingCard?.image || ''}
                        onChange={(filename) => setEditingCard(prev => prev ? { ...prev, image: filename } : null)}
                        cardName={editingCard?.name}
                        compact={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Enhancement Spots */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Enhancement Spots</h3>
                    <Button 
                      onClick={handleAddSpot}
                      variant="outline"
                      size="sm"
                    >
                      <Plus fontSize="small" className="mr-2" />
                      Add Spot
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {editingCard?.enhancementSpots.map((spot) => (
                      <div
                        key={spot.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          editingSpot?.id === spot.id
                            ? 'bg-primary/10 border-primary'
                            : 'bg-muted/50 border-border hover:bg-muted'
                        }`}
                        onClick={() => handleEditSpot(spot)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{spot.description || 'Unnamed Spot'}</h4>
                            <p className="text-sm text-muted-foreground">
                              {spot.type} • {spot.region} • {spot.abilities.join(', ')}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSpot(spot.id)
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Spot Editor */}
      {editingSpot && (
        <Card className="glass-card border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <EditIcon className="text-white" fontSize="small" />
              </div>
              Edit Enhancement Spot
              <Button 
                onClick={handleSaveSpot}
                className="ml-auto bubble-button"
                size="sm"
              >
                <SaveIcon fontSize="small" className="mr-2" />
                Save Spot
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Properties */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="spot-description">Description</Label>
                  <Input
                    id="spot-description"
                    value={editingSpot.description}
                    onChange={(e) => setEditingSpot(prev => prev ? { ...prev, description: e.target.value } : null)}
                    placeholder="e.g., Attack 3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="spot-type">Mark Type</Label>
                    <Select
                      value={editingSpot.type}
                      onValueChange={(value) => setEditingSpot(prev => prev ? { ...prev, type: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MARK_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="spot-region">Region</Label>
                    <Select
                      value={editingSpot.region}
                      onValueChange={(value) => setEditingSpot(prev => prev ? { ...prev, region: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map(region => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="spot-targets">Targets</Label>
                    <Input
                      id="spot-targets"
                      type="number"
                      min="1"
                      value={editingSpot.targets || 1}
                      onChange={(e) => setEditingSpot(prev => prev ? { ...prev, targets: parseInt(e.target.value) || 1 } : null)}
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="spot-lost"
                      checked={editingSpot.hasLostIcon}
                      onCheckedChange={(checked) => setEditingSpot(prev => prev ? { ...prev, hasLostIcon: checked as boolean } : null)}
                    />
                    <Label htmlFor="spot-lost">Has Lost Icon</Label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="spot-summon"
                    checked={editingSpot.isSummon}
                    onCheckedChange={(checked) => setEditingSpot(prev => prev ? { ...prev, isSummon: checked as boolean } : null)}
                  />
                  <Label htmlFor="spot-summon">Is Summon</Label>
                </div>
              </div>

              {/* Abilities */}
              <div className="space-y-4">
                <div>
                  <Label>Abilities</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                    {ABILITY_OPTIONS.map(ability => (
                      <div key={ability} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ability-${ability}`}
                          checked={editingSpot.abilities.includes(ability)}
                          onCheckedChange={(checked) => {
                            setEditingSpot(prev => {
                              if (!prev) return null
                              const abilities = checked 
                                ? [...prev.abilities, ability]
                                : prev.abilities.filter(a => a !== ability)
                              return { ...prev, abilities }
                            })
                          }}
                        />
                        <Label htmlFor={`ability-${ability}`} className="capitalize">
                          {ability}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save & Export Controls */}
      {selectedClass && (
        <Card className="glass-card border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <SaveIcon className="text-white" fontSize="small" />
              </div>
              Save & Export Data
              <div className="ml-auto text-sm text-muted-foreground">
                Auto-saved to localStorage
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Changes are automatically saved to your browser's localStorage. Use the buttons below to save to project files or download JSON files.
              </div>
              <div className="flex gap-4 flex-wrap">
                {isDev && (
                  <Button 
                    onClick={handleSaveToFiles}
                    className="bubble-button flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <SaveIcon fontSize="small" />
                    💾 Save to Project Files
                  </Button>
                )}
                
                <Button 
                  onClick={handleExportClass}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <DownloadIcon fontSize="small" />
                  Export {selectedClassData?.name}
                </Button>
                
                <Button 
                  onClick={handleExportAllClasses}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <DownloadIcon fontSize="small" />
                  Export All Classes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
