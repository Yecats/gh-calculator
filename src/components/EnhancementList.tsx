import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Minus, ArrowClockwise, Coins } from '@phosphor-icons/react'
import { EnhancementItem } from '@/types'
import markTypes from '@/data/mark-types.json'
import enhancements from '@/data/enhancements.json'

const MARK_TYPES: Record<string, any> = markTypes
const ENHANCEMENTS: Record<string, any> = enhancements

interface EnhancementListProps {
  enhancementList: EnhancementItem[]
  onRemoveItem: (id: string) => void
  onClearAll: () => void
}

export function EnhancementList({ enhancementList, onRemoveItem, onClearAll }: EnhancementListProps) {
  if (enhancementList.length === 0) return null

  const totalCost = enhancementList.reduce((sum, item) => sum + item.cost, 0)

  return (
    <Card className="glass-card border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Coins className="text-accent-foreground" size={20} />
            </div>
            Enhancement List
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearAll}
            className="flex items-center gap-2 rounded-lg bubble-button border-2 bg-accent border-accent text-white hover:bg-accent/90 hover:border-accent/90"
          >
            <ArrowClockwise size={16} />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {enhancementList.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg glass-card">
            <div className="flex flex-col space-y-2">
              <div className="font-medium text-lg">
                {ENHANCEMENTS[item.enhancement]?.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {item.cardName} - {item.spotDescription}
              </div>
              <div className="text-xs text-muted-foreground">
                {MARK_TYPES[item.markType]?.name} mark
              </div>
              {item.modifiers && item.modifiers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.modifiers.map((modifier, index) => (
                    <Badge key={index} variant="secondary" className="text-xs rounded-full">
                      {modifier}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-accent font-bold text-lg px-3 py-1 rounded-full">
                {item.cost} gold
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onRemoveItem(item.id)}
                className="rounded-full bubble-button w-10 h-10 p-0 bg-accent/80 text-white hover:bg-accent"
              >
                <Minus size={18} />
              </Button>
            </div>
          </div>
        ))}
        
        <Separator className="my-6 opacity-30" />
        
        <div className="flex items-center justify-between text-2xl font-bold p-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg glass-card">
          <span>Total Cost:</span>
          <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            <Coins size={28} />
            {totalCost} Gold
          </div>
        </div>
      </CardContent>
    </Card>
  )
}