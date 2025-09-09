import React from 'react'
import { Button } from '@/components/ui/button'
import { CharacterClass } from '@/types'

// Import SVG icons as URLs
import BRIcon from '@/assets/icons/classes/BR.svg'
import CHIcon from '@/assets/icons/classes/CH.svg'
import MTIcon from '@/assets/icons/classes/MT.svg'
import SCIcon from '@/assets/icons/classes/SC.svg'
import SWIcon from '@/assets/icons/classes/SW.svg'
import TIIcon from '@/assets/icons/classes/TI.svg'
import BEIcon from '@/assets/icons/classes/BE.svg'
import DSIcon from '@/assets/icons/classes/DS.svg'
import ELIcon from '@/assets/icons/classes/EL.svg'
import NSIcon from '@/assets/icons/classes/NS.svg'
import PHIcon from '@/assets/icons/classes/PH.svg'
import QMIcon from '@/assets/icons/classes/QM.svg'
import SBIcon from '@/assets/icons/classes/SB.svg'
import SKIcon from '@/assets/icons/classes/SK.svg'
import SSIcon from '@/assets/icons/classes/SS.svg'
import STIcon from '@/assets/icons/classes/ST.svg'
import WFIcon from '@/assets/icons/classes/WF.svg'
import CSIcon from '@/assets/icons/classes/CS.svg'

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
    const fetchSvg = async () => {
      try {
        const response = await fetch(`/gh-calculator/src/assets/icons/classes/${classId}.svg`)
        if (response.ok) {
          let text = await response.text()
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
        }
      } catch (error) {
        console.error(`Failed to fetch SVG for ${classId}:`, error)
      }
    }
    
    fetchSvg()
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