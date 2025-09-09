import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, KeyboardArrowDown, Image } from '@mui/icons-material'
import { ClassData, Card } from '@/types'

interface CardSelectorProps {
  selectedClassData: ClassData | null
  selectedCard: string
  cardSelectOpen: boolean
  onCardSelectOpenChange: (open: boolean) => void
  onCardSelect: (cardKey: string) => void
}

export function CardSelector({
  selectedClassData,
  selectedCard,
  cardSelectOpen,
  onCardSelectOpenChange,
  onCardSelect
}: CardSelectorProps) {
  const selectedCardData = selectedClassData && selectedCard ? selectedClassData.cards[selectedCard] : null

  return (
    <div className="space-y-2">
      <Popover open={cardSelectOpen} onOpenChange={onCardSelectOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={cardSelectOpen}
            className="w-full justify-between rounded-lg border-2 bubble-button h-12 px-4"
          >
            {selectedCard && selectedCardData ? (
              <div className="flex items-center justify-between w-full min-w-0">
                <span className="mr-4 truncate flex-1">{selectedCardData.name}</span>
                <Badge variant="secondary" className="rounded-full text-xs shrink-0 bg-accent text-accent-foreground">
                  Level {selectedCardData.level}
                </Badge>
              </div>
            ) : (
              <span className="text-muted-foreground">Choose a card...</span>
            )}
            <KeyboardArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 rounded-lg border-0 shadow-xl backdrop-blur-sm bg-card/95">
          <Command>
            <CommandInput placeholder="Search cards..." className="h-9" />
            <CommandList>
              <CommandEmpty>No cards found.</CommandEmpty>
              <CommandGroup>
                {selectedClassData ? (
                  Object.entries(selectedClassData.cards).map(([key, card]) => (
                    <CommandItem
                      key={key}
                      value={card.name}
                      onSelect={() => {
                        onCardSelect(key)
                        onCardSelectOpenChange(false)
                      }}
                      className="py-3 px-4 hover:border-accent hover:border-2 focus:border-accent focus:border-2 data-[selected=true]:border-accent data-[selected=true]:border-2 border-2 border-transparent text-muted-foreground cursor-pointer rounded-lg"
                    >
                      <Check className={`mr-2 h-4 w-4 ${selectedCard === key ? "opacity-100" : "opacity-0"}`} />
                      <div className="flex items-center justify-between w-full min-w-0">
                        <span className="mr-4 truncate flex-1">{card.name}</span>
                        <Badge variant="secondary" className="rounded-full text-xs shrink-0 bg-accent text-accent-foreground">
                          Level {card.level}
                        </Badge>
                      </div>
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem className="py-3 px-4 hover:border-accent hover:border-2 focus:border-accent focus:border-2 data-[selected=true]:border-accent data-[selected=true]:border-2 border-2 border-transparent text-muted-foreground rounded-lg">
                    <div className="flex items-center justify-between w-full">
                      <span className="mr-4">No cards available yet</span>
                      <Badge variant="secondary" className="rounded-full text-xs bg-accent text-accent-foreground">Level 1</Badge>
                    </div>
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface CardPreviewProps {
  selectedCardData: Card | null
}

export function CardPreview({ selectedCardData }: CardPreviewProps) {
  if (!selectedCardData) return null

  return (
    <div className="space-y-3">
      <div className="w-full">
        <div className="aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted/80 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center shadow-lg">
          <div className="text-center text-muted-foreground">
            <Image style={{ fontSize: 32 }} className="mx-auto mb-2" />
            <div className="text-sm font-medium">Card Image</div>
          </div>
        </div>
      </div>
    </div>
  )
}