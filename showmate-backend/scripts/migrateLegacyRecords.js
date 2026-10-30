import 'dotenv/config'
import mongoose from 'mongoose'
import Project from '../src/models/Project.js'
import Event from '../src/models/Event.js'
import Skill from '../src/models/Skill.js'
import Practice from '../src/models/Practice.js'
import ClubContent from '../src/models/ClubContent.js'

const models = { Projects: Project, Events: Event, Skills: Skill, Practice, Club: ClubContent }
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI est manquant dans backend/.env')

const asArray = value => Array.isArray(value) ? value : value ? [String(value)] : []
try {
  await mongoose.connect(process.env.MONGODB_URI)
  const legacy = await mongoose.connection.collection('records').find({}).toArray()
  let migrated = 0
  for (const old of legacy) {
    const Model = models[old.group]
    if (!Model || !old.slug || !old.name) continue
    const common = {
      slug: old.slug, name: old.name, tagline: old.tagline || '', summary: old.summary || '',
      description: asArray(old.description), category: old.category || old.group,
      status: old.status === 'draft' ? 'draft' : 'published', imageUrl: old.imageUrl || '',
      links: Array.isArray(old.links) ? old.links : [],
    }
    let data = common
    if (old.group === 'Projects') data = { ...common, format: old.format || '', audience: old.audience || 'Internal', topics: asArray(old.topics), highlights: asArray(old.highlights), team: old.team || '', visual: old.visual || undefined }
    if (old.group === 'Events') data = { ...common, title: old.title || old.name, tagline: old.tagline || '', format: old.format || '', audience: old.audience || 'Open to all', date: old.date || null, endDate: old.endDate || null, location: old.location || '', organizer: old.organizer || old.team || 'Shellmates', registrationDeadline: old.registrationDeadline || null, capacity: old.capacity ?? null, price: old.price || '', registrationUrl: old.registrationUrl || '', gallery: asArray(old.gallery), topics: asArray(old.topics), highlights: asArray(old.highlights), team: old.team || '' }
    if (old.group === 'Skills') data = { ...common, level: old.level || old.format || 'Beginner', duration: old.duration || '', prerequisites: asArray(old.prerequisites), topics: asArray(old.topics), outcomes: asArray(old.outcomes || old.highlights), instructor: old.instructor || old.team || '' }
    if (old.group === 'Practice') data = { ...common, format: old.format || '', difficulty: old.difficulty || old.audience || 'All levels', rules: asArray(old.rules || old.highlights), topics: asArray(old.topics), equipment: asArray(old.equipment), schedule: old.schedule || '', team: old.team || '' }
    if (old.group === 'Club') data = { ...common, mission: old.mission || old.summary || '', activities: asArray(old.activities || old.highlights), membership: old.membership || old.audience || '', audience: old.audience || 'Members', contact: old.contact || old.team || '' }
    const result = await Model.updateOne({ slug: old.slug }, { $setOnInsert: data }, { upsert: true })
    if (result.upsertedCount) migrated++
  }
  console.log(`${migrated} contenus migrés vers leurs collections dédiées. La collection legacy records a été conservée par sécurité.`)
} catch (error) {
  console.error('Migration impossible :', error.message)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
