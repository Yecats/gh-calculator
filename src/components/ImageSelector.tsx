import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Image as ImageIcon,
  Upload as UploadIcon,
  Folder as FolderIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material'

interface ImageSelectorProps {
  value: string
  onChange: (filename: string) => void
  cardName?: string
  className?: string
  compact?: boolean
}

export function ImageSelector({ value, onChange, cardName, className, compact = false }: ImageSelectorProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    onChange(file.name)
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      handleFileSelect(imageFile)
    }
  }

  const generateFilename = (pattern: string) => {
    if (!cardName) return ''
    
    const safeName = cardName.toLowerCase().replace(/\s+/g, '-')
    
    switch (pattern) {
      case 'card-name':
        return `${safeName}.jpg`
      case 'card-name-png':
        return `${safeName}.png`
      case 'prefixed':
        return `card-${safeName}.jpg`
      default:
        return ''
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className={className}>
      <Label htmlFor="image-input">Image File</Label>
      
      <div className="space-y-2">
        {/* Main input with browse button */}
        <div className="flex gap-2">
          <Input
            id="image-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="image.jpg"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBrowseClick}
          >
            <FolderIcon fontSize="small" className="mr-1" />
            Browse
          </Button>
          {!compact && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <ImageIcon fontSize="small" className="mr-1" />
                  Tools
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Image Tools</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Quick filename generators */}
                  {cardName && (
                    <div>
                      <Label className="text-sm font-medium">Quick Fill Options</Label>
                      <div className="grid gap-2 mt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="justify-start"
                          onClick={() => {
                            const filename = generateFilename('card-name')
                            onChange(filename)
                            setIsModalOpen(false)
                          }}
                        >
                          {generateFilename('card-name')}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="justify-start"
                          onClick={() => {
                            const filename = generateFilename('card-name-png')
                            onChange(filename)
                            setIsModalOpen(false)
                          }}
                        >
                          {generateFilename('card-name-png')}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="justify-start"
                          onClick={() => {
                            const filename = generateFilename('prefixed')
                            onChange(filename)
                            setIsModalOpen(false)
                          }}
                        >
                          {generateFilename('prefixed')}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* File path helper */}
                  <div>
                    <Label className="text-sm font-medium">Recommended File Structure</Label>
                    <div className="mt-2 text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center justify-between">
                        <code>src/assets/cards/</code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('src/assets/cards/')}
                        >
                          <CopyIcon fontSize="small" />
                        </Button>
                      </div>
                      <div className="text-xs">
                        Place your card images in this folder for best organization
                      </div>
                    </div>
                  </div>

                  {/* Supported formats */}
                  <div>
                    <Label className="text-sm font-medium">Supported Formats</Label>
                    <div className="mt-2 text-sm text-muted-foreground">
                      JPG, PNG, WebP, SVG
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Quick fill buttons for compact mode */}
        {compact && cardName && (
          <div className="flex flex-wrap gap-1">
            <span className="text-xs text-muted-foreground">Quick:</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => onChange(generateFilename('card-name'))}
            >
              .jpg
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => onChange(generateFilename('card-name-png'))}
            >
              .png
            </Button>
          </div>
        )}

        {/* Drag and drop area - only in non-compact mode */}
        {!compact && (
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadIcon className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop an image here
            </p>
          </div>
        )}

        {/* Current image preview */}
        {value && (
          <div className="p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <ImageIcon fontSize="small" className="text-muted-foreground" />
              <code className="text-xs bg-background px-1 py-0.5 rounded flex-1">{value}</code>
            </div>
            {!compact && (
              <div className="text-xs text-muted-foreground mt-1">
                Expected path: <code>src/assets/cards/{value}</code>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
