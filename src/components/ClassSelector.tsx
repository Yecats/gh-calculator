import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Image } from '@phosphor-icons/react'
import { CharacterClass } from '@/types'

interface ClassSelectorProps {
  characterClasses: CharacterClass[]
  selectedClass: string
  onClassSelect: (classId: string) => void
}

export function ClassSelector({ characterClasses, selectedClass, onClassSelect }: ClassSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
      {characterClasses.map((characterClass) => (
        <Button
          key={characterClass.id}
          variant={selectedClass === characterClass.id ? "default" : "outline"}
          onClick={() => onClassSelect(characterClass.id)}
          className="h-16 w-16 flex-col gap-1 relative overflow-hidden bubble-button border-2 rounded-lg p-2"
          style={{
            backgroundColor: selectedClass === characterClass.id ? characterClass.color : 'rgba(30,35,45,0.8)',
            borderColor: characterClass.color,
            color: selectedClass === characterClass.id ? 'white' : undefined
          }}
        >
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: selectedClass === characterClass.id ? 'rgba(255,255,255,0.2)' : characterClass.color + '20'
            }}
          >
            <Image size={12} className={selectedClass === characterClass.id ? 'text-white' : ''} />
          </div>
          <span className="text-xs font-medium text-center leading-tight truncate max-w-full">
            {characterClass.name}
          </span>
        </Button>
      ))}
    </div>
  )
}