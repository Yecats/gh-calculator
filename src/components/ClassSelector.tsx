import React from 'react'
import { Button } from '@/components/ui/button'
import { CharacterClass } from '@/types'

// Import SVG icons as raw text
import BRIcon from '@/assets/icons/classes/BR.svg?raw'
import CHIcon from '@/assets/icons/classes/CH.svg?raw'
import MTIcon from '@/assets/icons/classes/MT.svg?raw'
import SCIcon from '@/assets/icons/classes/SC.svg?raw'
import SWIcon from '@/assets/icons/classes/SW.svg?raw'
import TIIcon from '@/assets/icons/classes/TI.svg?raw'
import BEIcon from '@/assets/icons/classes/BE.svg?raw'
import DSIcon from '@/assets/icons/classes/DS.svg?raw'
import ELIcon from '@/assets/icons/classes/EL.svg?raw'
import NSIcon from '@/assets/icons/classes/NS.svg?raw'
import PHIcon from '@/assets/icons/classes/PH.svg?raw'
import QMIcon from '@/assets/icons/classes/QM.svg?raw'
import SBIcon from '@/assets/icons/classes/SB.svg?raw'
import SKIcon from '@/assets/icons/classes/SK.svg?raw'
import SSIcon from '@/assets/icons/classes/SS.svg?raw'
import STIcon from '@/assets/icons/classes/ST.svg?raw'
import WFIcon from '@/assets/icons/classes/WF.svg?raw'
import CSIcon from '@/assets/icons/classes/CS.svg?raw'

const iconMap: Record<string, string> = {
  'BR': BRIcon,
  'CH': CHIcon,
  'MT': MTIcon,
  'SC': SCIcon,
  'SW': SWIcon,
  'TI': TIIcon,
  'BE': BEIcon,
  'DS': DSIcon,
  'EL': ELIcon,
  'NS': NSIcon,
  'PH': PHIcon,
  'QM': QMIcon,
  'SB': SBIcon,
  'SK': SKIcon,
  'SS': SSIcon,
  'ST': STIcon,
  'WF': WFIcon,
  'CS': CSIcon
}

interface ClassSelectorProps {
  characterClasses: CharacterClass[]
  selectedClass: string
  onClassSelect: (classId: string) => void
}

const ClassIcon = ({ classId, color, isSelected }: { classId: string, color: string, isSelected: boolean }) => {
  const [svgContent, setSvgContent] = React.useState<string>('')
  
  React.useEffect(() => {
    const rawSvg = iconMap[classId]
    if (!rawSvg) {
      console.error(`No icon found for class ${classId}`)
      return
    }
    
    let text = rawSvg
    // Replace currentColor with the actual color we want
    const targetColor = isSelected ? 'white' : color
    text = text.replace(/fill="currentColor"/g, `fill="${targetColor}"`)
    text = text.replace(/fill="black"/g, `fill="${targetColor}"`)
    text = text.replace(/fill="#000"/g, `fill="${targetColor}"`)
    text = text.replace(/fill="#000000"/g, `fill="${targetColor}"`)
    
    // Make the SVG larger by setting explicit width and height
    text = text.replace(/width="300" height="300"/, 'width="48" height="48"')
    text = text.replace(/<svg([^>]*)>/, '<svg$1 style="width: 48px; height: 48px;">')
    
    setSvgContent(text)
  }, [classId, color, isSelected])
  
  return (
    <div 
      className="w-16 h-16 flex items-center justify-center"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}

export function ClassSelector({ characterClasses, selectedClass, onClassSelect }: ClassSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
      {characterClasses.map((characterClass) => (
        <Button
          key={characterClass.id}
          variant={selectedClass === characterClass.id ? "default" : "outline"}
          onClick={() => onClassSelect(characterClass.id)}
          className="h-16 w-16 flex items-center justify-center relative overflow-hidden bubble-button border-2 rounded-lg p-2"
          style={{
            backgroundColor: selectedClass === characterClass.id ? characterClass.color : 'rgba(30,35,45,0.8)',
            borderColor: characterClass.color
          }}
        >
          <ClassIcon 
            classId={characterClass.id} 
            color={characterClass.color}
            isSelected={selectedClass === characterClass.id}
          />
        </Button>
      ))}
    </div>
  )
}