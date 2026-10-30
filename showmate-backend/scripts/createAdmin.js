import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Admin from '../src/models/Admin.js'

const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Complète MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL et ADMIN_PASSWORD dans backend/.env.')
  process.exit(1)
}
if (ADMIN_PASSWORD.length < 12) {
  console.error('ADMIN_PASSWORD doit contenir au moins 12 caractères.')
  process.exit(1)
}

try {
  await mongoose.connect(MONGODB_URI)
  const email = ADMIN_EMAIL.trim().toLowerCase()
  const exists = await Admin.findOne({ email })
  if (exists) {
    console.error('Un compte administrateur avec cet email existe déjà.')
    process.exitCode = 1
  } else {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)
    await Admin.create({ name: ADMIN_NAME.trim(), email, passwordHash })
    console.log(`Compte administrateur créé pour ${email}.`)
  }
} catch (error) {
  console.error('Création impossible:', error.message)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
