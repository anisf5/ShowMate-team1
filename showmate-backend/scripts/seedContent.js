import 'dotenv/config'
import mongoose from 'mongoose'
import Project from '../src/models/Project.js'
import Event from '../src/models/Event.js'
import Skill from '../src/models/Skill.js'
import Practice from '../src/models/Practice.js'
import ClubContent from '../src/models/ClubContent.js'
import records from './content.json' with { type: 'json' }
if (!process.env.MONGODB_URI) { console.error('MONGODB_URI est manquant dans .env'); process.exit(1) }
const models = { Projects: Project, Events: Event, Skills: Skill, Practice, Club: ClubContent }
try {
 await mongoose.connect(process.env.MONGODB_URI)
 let created = 0
 for (const source of records) {
  const Model = models[source.group]
  if (!Model) continue
  const item = { ...source }; delete item.group
  if (source.group === 'Events') { item.title = item.name; item.date = null; item.endDate = null; item.location = item.location || ''; item.organizer = item.team || 'Shellmates'; item.status = 'published' }
  if (source.group === 'Skills') { item.level = item.format || 'Beginner'; item.outcomes = item.highlights || []; delete item.team; delete item.highlights }
  if (source.group === 'Practice') { item.difficulty = item.audience || 'All levels'; item.rules = item.highlights || []; item.schedule = ''; delete item.team; delete item.highlights }
  if (source.group === 'Club') { item.mission = item.summary || ''; item.activities = item.highlights || []; item.membership = item.audience || ''; item.contact = item.team || ''; delete item.team; delete item.highlights }
  const result = await Model.updateOne({ slug: source.slug }, { $setOnInsert: item }, { upsert: true })
  if (result.upsertedCount) created++
  else if (source.visual) await Model.updateOne({ slug: source.slug, visual: { $exists: false } }, { $set: { visual: source.visual } }) // complète les fiches déjà importées sans visual
 }
 console.log(`${created} contenus importés dans leurs collections dédiées. Les contenus déjà présents ont été conservés.`)
} catch (error) { console.error('Import impossible:', error.message); process.exitCode = 1 } finally { await mongoose.disconnect() }
