import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import Admin from '../models/Admin.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

const router = Router()
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Trop de tentatives. Réessaie dans quelques minutes.' } })

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe obligatoires.' })

    const admin = await Admin.findOne({ email }).select('+passwordHash')
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' })
    }

    const token = jwt.sign({ sub: admin._id.toString(), role: admin.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' })
    return res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } })
  } catch (error) { next(error) }
})

router.get('/me', requireAdmin, (req, res) => {
  res.json({ admin: { id: req.admin._id, name: req.admin.name, email: req.admin.email } })
})

export default router
