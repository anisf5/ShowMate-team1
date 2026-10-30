import mongoose from 'mongoose'

export const visualSchema = new mongoose.Schema(
  {
    id: { type: String, enum: ['path', 'attack', 'brief', 'checklist'], default: 'brief' },
    file: { type: String, default: '' },
    status: { type: String, default: '' }, 
    command: { type: String, default: '' },
    rows: [{ _id: false, label: String, note: String, value: String }],
    foot: { type: String, default: '' },
  },
  { _id: false },
)
