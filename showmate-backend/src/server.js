import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import skillRoutes from './routes/skillRoutes.js'
import practiceRoutes from './routes/practiceRoutes.js'
import clubRoutes from './routes/clubRoutes.js'

const app = express()
const port = Number(process.env.PORT || 5000)

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set in backend/.env and contain at least 32 characters.')
  process.exit(1)
}

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'ShowMate API' }))
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/practice', practiceRoutes)
app.use('/api/club', clubRoutes)

app.use((_req, res) => res.status(404).json({ message: 'Route API introuvable.' }))
app.use((error, _req, res, _next) => {
  console.error(error)
  if (error?.code === 11000) return res.status(409).json({ message: 'Cette valeur existe déjà.' })
  if (error?.name === 'ValidationError' || error?.name === 'CastError') return res.status(400).json({ message: 'Données invalides.' })
  res.status(500).json({ message: 'Erreur serveur. Réessaie plus tard.' })
})

try {
  await connectDB()
  app.listen(port, () => console.log(`ShowMate API running at http://localhost:${port}`))
} catch (error) {
  console.error('Impossible de démarrer le serveur:', error.message)
  process.exit(1)
}