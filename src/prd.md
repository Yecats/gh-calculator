# Gloomhaven Enhancement Calculator - Product Requirements Document

## Core Purpose & Success

**Mission Statement**: Calculate the exact gold cost for enhancing Gloomhaven Second Edition ability cards through a guided, card-specific interface that shows actual enhancement locations.

**Success Indicators**: 
- Users can select their class and specific cards, visually identify enhancement spots, and accurately calculate costs
- Users understand enhancement restrictions for each mark type in context of real cards
- Users can build comprehensive enhancement shopping lists with full traceability

**Experience Qualities**: Intuitive, Visual, Comprehensive

## Project Classification & Approach

**Complexity Level**: Light Application (multiple features with card data and state management)

**Primary User Activity**: Acting (selecting cards and calculating specific enhancement costs)

## Thought Process for Feature Selection

**Core Problem Analysis**: Players need to calculate enhancement costs for specific cards, but generic mark-type selection was too abstract and didn't reflect actual gameplay where enhancements are placed on specific card locations.

**User Context**: During character advancement when players have specific cards and want to enhance particular abilities on those cards.

**Critical Path**: Select class → Choose specific card → View card enhancement spots → Select spot → Choose enhancement → Calculate cost → Add to enhancement list

**Key Moments**: 
1. Selecting actual cards from their character class
2. Seeing specific enhancement spots with descriptions
3. Understanding mark restrictions in context of real abilities
4. Building a detailed enhancement plan with card context

## Essential Features

### Class and Card Selection
- **What it does**: Hierarchical selection starting with character class, then specific ability cards for that class
- **Why it matters**: Enhancement decisions are always made in context of specific cards and character builds
- **Success criteria**: Users can easily find and select their specific cards from their class

### Visual Enhancement Spot Selection  
- **What it does**: Shows available enhancement spots on each card with mark types and descriptions
- **Why it matters**: Players need to see exactly where enhancements can be placed on their actual cards
- **Success criteria**: Enhancement spots are clearly identified with mark types and ability descriptions

### Context-Aware Enhancement Lists
- **What it does**: Filters available enhancements based on the selected spot's mark type and shows only valid options
- **Why it matters**: Prevents invalid enhancement selections and educates users about mark type restrictions
- **Success criteria**: Only compatible enhancements appear for each mark type

### Enhanced Cost Calculator
- **What it does**: Calculates enhancement costs with full context of card name, spot location, and all modifiers
- **Why it matters**: Provides complete traceability for enhancement decisions and costs
- **Success criteria**: Each enhancement in the list shows card name, spot description, and detailed cost breakdown

## Design Direction

### Visual Tone & Identity
**Emotional Response**: Professional confidence in accuracy, with subtle gaming aesthetic
**Design Personality**: Clean, precise, with muted fantasy colors that don't distract from calculations
**Visual Metaphors**: Card game elements, gold coins, enhancement marks
**Simplicity Spectrum**: Minimal interface that prioritizes the calculation workflow

### Color Strategy
**Color Scheme Type**: Analogous (green-based with gold accents)
**Primary Color**: Deep forest green representing Gloomhaven's adventuring theme
**Secondary Colors**: Muted earth tones for backgrounds and supporting elements
**Accent Color**: Warm gold for cost displays and important actions
**Color Psychology**: Green suggests precision and calculation, gold represents the game's currency

### Typography System
**Font Pairing Strategy**: Single font family (Inter) for consistency and readability
**Typographic Hierarchy**: Clear distinction between headings, labels, and values
**Font Personality**: Technical precision without being clinical
**Readability Focus**: High contrast, generous spacing for easy scanning of numbers
**Which fonts**: Inter - clean, modern, excellent for data display

### Visual Hierarchy & Layout
**Attention Direction**: Flow from mark selection → enhancement selection → modifiers → final cost
**White Space Philosophy**: Generous spacing around calculation areas to reduce cognitive load
**Grid System**: Card-based layout with clear sections for each step
**Responsive Approach**: Single column on mobile, two-column modifiers on desktop

### Animations
**Purposeful Meaning**: Subtle transitions when costs update to draw attention to changes
**Hierarchy of Movement**: Cost displays get gentle highlighting when values change
**Contextual Appropriateness**: Minimal, functional animations that support the calculation workflow

### UI Elements & Component Selection
**Component Usage**: Cards for major sections, Badges for costs, Checkboxes/Inputs for modifiers
**Component Customization**: Shadcn components with custom accent colors for cost displays
**Component States**: Clear enabled/disabled states for calculation flow
**Icon Selection**: Coins for cost displays, Calculator for modifiers, Plus/Minus for list management

### Visual Consistency Framework
**Design System Approach**: Component-based using shadcn for consistency
**Style Guide Elements**: Consistent spacing, color usage, and typography scales
**Visual Rhythm**: Regular spacing and alignment creating predictable patterns

### Accessibility & Readability
**Contrast Goal**: WCAG AA compliance for all text and interactive elements

## Edge Cases & Problem Scenarios

**Potential Obstacles**:
- Users not understanding mark type restrictions
- Confusion about when modifiers apply
- Forgetting to apply certain modifiers

**Edge Case Handling**:
- Clear explanatory text for each mark type
- Helpful labels explaining each modifier
- Auto-calculation when modifiers change

**Technical Constraints**: Browser-based calculation, no external dependencies needed

## Implementation Considerations

**Scalability Needs**: Could expand to include character-specific features or save/load enhancement plans
**Testing Focus**: Verify calculations match official rules exactly
**Critical Questions**: Are all enhancement types from the official rules included?

## Reflection

This approach focuses on accuracy and workflow efficiency, making a traditionally error-prone manual calculation into a reliable tool. The educational aspect helps users understand the rules while using them.