// Development-only auto-save server
// Run with: node dev-server.js (alongside npm run dev)

import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Auto-save endpoint - only available in development
app.post('/api/save-class', async (req, res) => {
  try {
    const { classId, classData } = req.body
    
    const fileName = `${classData.name.toLowerCase()}.json`
    const filePath = path.join(process.cwd(), 'src', 'data', fileName)
    
    const dataToSave = {
      cards: classData.cards
    }
    
    await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2))
    
    console.log(`✅ Saved ${fileName}`)
    res.json({ success: true, message: `Saved ${fileName}` })
  } catch (error) {
    console.error(`❌ Error saving class:`, error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/save-all-classes', async (req, res) => {
  try {
    const { classes } = req.body
    
    const results = []
    for (const [classId, classData] of Object.entries(classes)) {
      const fileName = `${classData.name.toLowerCase()}.json`
      const filePath = path.join(process.cwd(), 'src', 'data', fileName)
      
      const dataToSave = {
        cards: classData.cards
      }
      
      await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2))
      results.push(fileName)
      console.log(`✅ Saved ${fileName}`)
    }
    
    console.log(`✅ Auto-saved ${results.length} class files`)
    res.json({ success: true, message: `Saved ${results.length} files`, files: results })
  } catch (error) {
    console.error(`❌ Error saving classes:`, error)
    res.status(500).json({ error: error.message })
  }
})

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Development auto-save server running on http://localhost:${PORT}`)
  })
}
