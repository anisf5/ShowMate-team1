const slugify = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
export function makeEntityController(Model, entityName) {
  return {
    async list(req, res, next) { try { const filter = req.adminList === true ? {} : { status: 'published' }; res.json({ items: await Model.find(filter).sort({ updatedAt: -1 }).lean() }) } catch (e) { next(e) } },
    async get(req, res, next) { try { const filter = { slug: req.params.slug }; if (req.query.admin !== 'true') filter.status = 'published'; const item = await Model.findOne(filter).lean(); if (!item) return res.status(404).json({ message: `${entityName} introuvable.` }); res.json({ item }) } catch (e) { next(e) } },
    async create(req, res, next) { try { const body = { ...req.body }; body.slug = slugify(body.slug || body.name || body.title); body.name = String(body.name || body.title || '').trim(); if (!body.name || !body.slug) return res.status(400).json({ message: 'Le nom est obligatoire.' }); const item = await Model.create(body); res.status(201).json({ message: `${entityName} créé(e).`, item }) } catch (e) { next(e) } },
    async update(req, res, next) { try { const body = { ...req.body }; if (body.slug || body.name || body.title) body.slug = slugify(body.slug || body.name || body.title); const item = await Model.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }); if (!item) return res.status(404).json({ message: `${entityName} introuvable.` }); res.json({ message: `${entityName} modifié(e).`, item }) } catch (e) { next(e) } },
    async remove(req, res, next) { try { const item = await Model.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ message: `${entityName} introuvable.` }); res.json({ message: `${entityName} supprimé(e).` }) } catch (e) { next(e) } },
  }
}
