import { Router } from 'express'
import { requireAdmin } from '../middleware/requireAdmin.js'
import controller from '../controllers/clubController.js'
const router = Router()
router.get('/', (req, res, next) => controller.list(req, res, next))
router.get('/slug/:slug', (req, res, next) => controller.get(req, res, next))
router.get('/admin/all', requireAdmin, (req, res, next) => { req.adminList = true; controller.list(req, res, next) })
router.post('/', requireAdmin, (req, res, next) => controller.create(req, res, next))
router.patch('/:id', requireAdmin, (req, res, next) => controller.update(req, res, next))
router.delete('/:id', requireAdmin, (req, res, next) => controller.remove(req, res, next))
export default router
