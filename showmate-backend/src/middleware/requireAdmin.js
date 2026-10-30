import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export async function requireAdmin(req, res, next) {
  try {
    const authorization = req.headers.authorization || ''
    const [scheme, token] = authorization.split(' ')

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        message: 'Connexion administrateur requise.',
      })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)

    if (payload.role !== 'admin' || !payload.sub) {
      return res.status(403).json({
        message: 'Accès réservé à l’administrateur.',
      })
    }

    const admin = await Admin.findById(payload.sub)
      .select('_id name email role')

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        message: 'Accès réservé à l’administrateur.',
      })
    }

    req.admin = admin
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError' ||
        error.name === 'JsonWebTokenError' ||
        error.name === 'NotBeforeError') {
      return res.status(401).json({
        message: 'Jeton invalide ou expiré. Reconnecte-toi.',
      })
    }

    next(error)
  }
}