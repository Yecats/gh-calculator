import React from 'react'
import { Image } from '@mui/icons-material'

// Import all enhancement SVG icons
import attackIcon from '@/assets/icons/enhancements/attack.svg'
import blessIcon from '@/assets/icons/enhancements/bless.svg'
import curseIcon from '@/assets/icons/enhancements/curse.svg'
import disarmIcon from '@/assets/icons/enhancements/disarm.svg'
import healIcon from '@/assets/icons/enhancements/heal.svg'
import hexIcon from '@/assets/icons/enhancements/hex.svg'
import immobilizeIcon from '@/assets/icons/enhancements/immobilize.svg'
import impairIcon from '@/assets/icons/enhancements/impair.svg'
import invisibleIcon from '@/assets/icons/enhancements/invisible.svg'
import lostIcon from '@/assets/icons/enhancements/lost.svg'
import moveIcon from '@/assets/icons/enhancements/move.svg'
import muddleIcon from '@/assets/icons/enhancements/muddle.svg'
import pierceIcon from '@/assets/icons/enhancements/pierce.svg'
import poisonIcon from '@/assets/icons/enhancements/poison.svg'
import rangeIcon from '@/assets/icons/enhancements/range.svg'
import retaliationIcon from '@/assets/icons/enhancements/retaliation.svg'
import shieldIcon from '@/assets/icons/enhancements/shield.svg'
import strengthenIcon from '@/assets/icons/enhancements/strengthen.svg'
import stunIcon from '@/assets/icons/enhancements/stun.svg'
import targetIcon from '@/assets/icons/enhancements/target.svg'
import woundIcon from '@/assets/icons/enhancements/wound.svg'

// Map SVG filenames to imported icons
const iconMap: Record<string, string> = {
  'attack.svg': attackIcon,
  'bless.svg': blessIcon,
  'curse.svg': curseIcon,
  'disarm.svg': disarmIcon,
  'heal.svg': healIcon,
  'hex.svg': hexIcon,
  'immobilize.svg': immobilizeIcon,
  'impair.svg': impairIcon,
  'invisible.svg': invisibleIcon,
  'lost.svg': lostIcon,
  'move.svg': moveIcon,
  'muddle.svg': muddleIcon,
  'pierce.svg': pierceIcon,
  'poison.svg': poisonIcon,
  'range.svg': rangeIcon,
  'retaliation.svg': retaliationIcon,
  'shield.svg': shieldIcon,
  'strengthen.svg': strengthenIcon,
  'stun.svg': stunIcon,
  'target.svg': targetIcon,
  'wound.svg': woundIcon
}

interface EnhancementIconProps {
  iconPath: string
  alt: string
  className?: string
  onError?: () => void
}

export default function EnhancementIcon({ iconPath, alt, className = "w-10 h-10", onError }: EnhancementIconProps) {
  // Extract filename from path
  const filename = iconPath.split('/').pop() || ''
  const iconSrc = iconMap[filename]

  if (!iconSrc || iconPath === '?') {
    return <Image style={{ fontSize: 32, color: 'white' }} />
  }

  return (
    <img 
      src={iconSrc}
      alt={alt}
      className={className}
      onError={onError}
    />
  )
}
