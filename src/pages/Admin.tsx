
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, LogOut, Plus, Save, Trash2, RefreshCw } from 'lucide-react'
import '../styles/admin.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

type ContentItem = {
  _id?: string
  slug: string
  name: string
  group: string
  [key: string]: any
}

const endpointFor = (group: string) => ({
  Projects: '/projects',
  Events: '/events',
  Skills: '/skills',
  Practice: '/practice',
  Club: '/club',
} as Record<string, string>)[group] || '/projects'

const groupsForApi = ['Projects', 'Events', 'Skills', 'Practice', 'Club']

const getItem = (data: any) =>
  data?.item ||
  data?.event ||
  data?.project ||
  data?.skill ||
  data?.practice ||
  data?.content

const emptyContent: ContentItem = {
  slug: '',
  name: '',
  tagline: '',
  summary: '',
  description: [],
  group: 'Projects',
  category: '',
  format: '',
  audience: '',
  topics: [],
  highlights: [],
  team: '',
  visual: {
    id: 'brief',
    file: '',
    status: '',
    command: '',
    rows: [],
    foot: '',
  },
  links: [],
  date: '',
  endDate: '',
  registrationDeadline: '',
  location: '',
  organizer: 'Shellmates',
  capacity: null,
  price: '',
  imageUrl: '',
  registrationUrl: '',
  gallery: [],
  level: 'Beginner',
  duration: '',
  prerequisites: [],
  outcomes: [],
  instructor: '',
  difficulty: 'All levels',
  rules: [],
  equipment: [],
  schedule: '',
  mission: '',
  activities: [],
  membership: '',
  contact: '',
  status: 'draft',
}

const tokenKey = 'showmate_admin_token'
const groups = ['Projects', 'Events', 'Skills', 'Practice', 'Club']
const visualTypes = ['brief', 'path', 'attack', 'checklist']

async function api(path: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem(tokenKey)

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Erreur ${response.status}`)
  }

  return data
}

const listToText = (value: unknown) =>
  Array.isArray(value) ? value.join('\n') : ''

const textToList = (value: string) =>
  value.split('\n').map(v => v.trim()).filter(Boolean)

export default function Admin() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem(tokenKey) || ''
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [contents, setContents] = useState<ContentItem[]>([])
  const [selected, setSelected] = useState<ContentItem | null>(null)

  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  // Charger tous les contenus
  async function loadContents() {
    const collections = await Promise.all(
      groupsForApi.map(async group => {
        const data = await api(`${endpointFor(group)}/admin/all`)
        const items = Array.isArray(data.items) ? data.items : []

        return items.map((item: ContentItem) => ({
          ...item,
          name: item.name || '',
          slug: item.slug || '',
          status: item.status || 'draft',
          links: group === 'Skills'
            ? (item.resources || [])
            : (item.links || []),
          group,
        }))
      })
    )

    const allContents = collections.flat()

    console.log(
      'Fiches sans nom :',
      allContents.filter(item => !item.name)
    )

    const next = allContents.sort((a: ContentItem, b: ContentItem) =>
      (a.name || '').localeCompare(b.name || '')
    )

    setContents(next)

    if (selected?._id) {
      const current = next.find(
        (item: ContentItem) =>
          item._id === selected._id &&
          item.group === selected.group
      )

      if (current) setSelected(current)
    }
  }

  useEffect(() => {
    if (token) {
      loadContents().catch(error => setMessage(error.message))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const visible = useMemo(
    () =>
      contents.filter(r =>
        (filter === 'All' || r.group === filter) &&
        `${r.name || ''} ${r.slug || ''}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [contents, filter, query]
  )

  // Connexion
  async function login(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')

    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      sessionStorage.setItem(tokenKey, data.token)
      setToken(data.token)
      setMessage('Connexion réussie.')
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Connexion impossible.'
      )
    } finally {
      setBusy(false)
    }
  }

  // Déconnexion
  function logout() {
    sessionStorage.removeItem(tokenKey)
    setToken('')
    setContents([])
    setSelected(null)
  }

  // Sélectionner une fiche
  function choose(content: ContentItem) {
    setSelected(JSON.parse(JSON.stringify(content)))
    setMessage('')
  }

  // Nouveau contenu
  function createNew() {
    setSelected(JSON.parse(JSON.stringify(emptyContent)))
    setMessage('Complète les champs puis enregistre la fiche.')
  }

  // Modifier un champ
  function patch(key: string, value: any) {
    setSelected(current =>
      current ? { ...current, [key]: value } : current
    )
  }

  // Modifier le visuel
  function patchVisual(key: string, value: any) {
    setSelected(current =>
      current
        ? {
            ...current,
            visual: {
              ...(current.visual || {}),
              [key]: value,
            },
          }
        : current
    )
  }

  // Enregistrer
  async function saveContent() {
    if (!selected) return

    if (!selected.name?.trim()) {
      setMessage('Le nom de la fiche est obligatoire.')
      return
    }

    setBusy(true)
    setMessage('')

    try {
      const payload = { ...selected }

      if (selected.group === 'Skills') {
        payload.resources = payload.links || []
        delete payload.links
      }

      delete payload._id
      delete payload.__v
      delete payload.createdAt
      delete payload.updatedAt

      if (!payload.slug?.trim()) {
        payload.slug = payload.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }

      const isNew = !selected._id
      const endpoint = endpointFor(selected.group)

      const data = await api(
        isNew ? endpoint : `${endpoint}/${selected._id}`,
        {
          method: isNew ? 'POST' : 'PATCH',
          body: JSON.stringify(payload),
        }
      )

      const savedItem = getItem(data) || data

      setSelected({
        ...savedItem,
        group: selected.group,
      })

      await loadContents()

      setMessage(
        `Contenu enregistré avec le statut : ${
          payload.status === 'published' ? 'Publié' : 'Brouillon'
        }.`
      )
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Enregistrement impossible.'
      )
    } finally {
      setBusy(false)
    }
  }

  // Supprimer
  async function deleteContent() {
    if (
      !selected?._id ||
      !window.confirm(`Supprimer « ${selected.name} » ?`)
    ) {
      return
    }

    setBusy(true)

    try {
      await api(
        `${endpointFor(selected.group)}/${selected._id}`,
        { method: 'DELETE' }
      )

      setSelected(null)
      await loadContents()
      setMessage('Fiche supprimée.')
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Suppression impossible.'
      )
    } finally {
      setBusy(false)
    }
  }

  // Page de connexion
  if (!token) {
    return (
      <main className="admin-page">
        <section className="admin-login">
          <Link className="admin-back" to="/">
            <ArrowLeft size={15} />
            Retour au site
          </Link>

          <p className="admin-eyebrow">SHOWMATE / ACCÈS PRIVÉ</p>
          <h1>Admin<span>.</span></h1>

          <p className="admin-muted">
            Connexion réservée à l’administration du club.
          </p>

          <form onSubmit={login}>
            <label>
              Email administrateur
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </label>

            <label>
              Mot de passe
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </label>

            <button className="admin-primary" disabled={busy}>
              {busy ? 'Connexion…' : 'Se connecter ↗'}
            </button>
          </form>

          {message && <p className="admin-message">{message}</p>}
        </section>
      </main>
    )
  }

  return (
    <main className="admin-page admin-workspace">

      <header className="admin-top">
        <Link className="admin-brand" to="/">
          ▸ SHOW<span>MATE</span>
        </Link>

        <div>
          <span className="admin-eyebrow">GESTION DES CONTENUS</span>

          <button className="admin-ghost" onClick={logout}>
            <LogOut size={15} />
            Déconnexion
          </button>
        </div>
      </header>

      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">ARCHIVE / CONTENU</p>
          <h1>Gérer les contenus<span>.</span></h1>

          <p className="admin-muted">
            Modifie chaque champ des projets, événements,
            compétences, pratiques et contenus du club.
          </p>
        </div>

        <button
          className="admin-primary admin-new"
          onClick={createNew}
        >
          <Plus size={16} />
          Nouveau contenu
        </button>
      </div>

      <div className="admin-layout">

        {/* Liste des contenus */}
        <aside className="admin-list">
          <div className="admin-list-tools">
            <input
              placeholder="Rechercher un contenu…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />

            <button
              title="Actualiser"
              className="admin-icon"
              onClick={() =>
                loadContents().catch(e => setMessage(e.message))
              }
            >
              <RefreshCw size={15} />
            </button>
          </div>

          <div className="admin-filters">
            {['All', ...groups].map(group => (
              <button
                key={group}
                className={filter === group ? 'active' : ''}
                onClick={() => setFilter(group)}
              >
                {group}
              </button>
            ))}
          </div>

          <p className="admin-count">
            {visible.length} / {contents.length} CONTENUS
          </p>

          <div className="admin-records">
            {visible.map(content => (
              <button
                key={content._id || `${content.group}-${content.slug}`}
                className={`admin-record ${
                  selected?._id === content._id && content._id
                    ? 'selected'
                    : ''
                }`}
                onClick={() => choose(content)}
              >
                <span>{content.group}</span>
                <strong>{content.name || 'Sans nom'}</strong>
                <small>/{content.slug || 'sans-slug'}</small>
                <small>
                  {content.status === 'published' ? 'Publié' : 'Brouillon'}
                </small>
              </button>
            ))}
          </div>
        </aside>

        {/* Éditeur */}
        <section className="admin-editor">

          {selected ? (
            <>
              <div className="admin-editor-head">
                <div>
                  <p className="admin-eyebrow">ÉDITEUR DE CONTENU</p>
                  <h2>{selected.name || 'Nouveau contenu'}</h2>
                </div>

                <div className="admin-editor-actions">
                  {selected._id && (
                    <button
                      className="admin-danger"
                      onClick={deleteContent}
                      disabled={busy}
                    >
                      <Trash2 size={15} />
                      Supprimer
                    </button>
                  )}

                  <button
                    className="admin-primary"
                    onClick={saveContent}
                    disabled={busy}
                  >
                    <Save size={15} />
                    {busy ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                </div>
              </div>

              <div className="admin-form">

                {/* Informations principales */}
                <h3>Informations principales</h3>

                <div className="admin-fields two">

                  <label>
                    Nom de la fiche *
                    <input
                      value={selected.name || ''}
                      onChange={e => patch('name', e.target.value)}
                      placeholder="Ex. Cybersecurity-Attacks"
                    />
                  </label>

                  <label>
                    Identifiant URL (slug)
                    <input
                      value={selected.slug || ''}
                      onChange={e => patch('slug', e.target.value)}
                      placeholder="Généré automatiquement si vide"
                    />
                  </label>

                  <label>
                    Catégorie du contenu
                    <select
                      disabled={Boolean(selected._id)}
                      value={selected.group || 'Projects'}
                      onChange={e => patch('group', e.target.value)}
                    >
                      {groups.map(g => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Catégorie
                    <input
                      value={selected.category || ''}
                      onChange={e => patch('category', e.target.value)}
                      placeholder="Ex. Cybersécurité"
                    />
                  </label>

                  {['Projects', 'Events', 'Practice'].includes(selected.group) && (
                    <label>
                      Format
                      <input
                        value={selected.format || ''}
                        onChange={e => patch('format', e.target.value)}
                        placeholder="Ex. Workshop, CTF…"
                      />
                    </label>
                  )}

                  {['Projects', 'Events', 'Club'].includes(selected.group) && (
                    <label>
                      Public cible
                      <input
                        value={selected.audience || ''}
                        onChange={e => patch('audience', e.target.value)}
                        placeholder="À qui s'adresse cette fiche ?"
                      />
                    </label>
                  )}

                  <label className="wide">
                    Accroche
                    <input
                      value={selected.tagline || ''}
                      onChange={e => patch('tagline', e.target.value)}
                      placeholder="Courte phrase sous le titre"
                    />
                  </label>

                  <label className="wide">
                    Résumé
                    <textarea
                      rows={3}
                      value={selected.summary || ''}
                      onChange={e => patch('summary', e.target.value)}
                      placeholder="Résumé affiché sur la carte"
                    />
                  </label>

                  <label className="wide">
                    Description <small>Une ligne par paragraphe</small>
                    <textarea
                      rows={5}
                      value={listToText(selected.description)}
                      onChange={e => patch('description', textToList(e.target.value))}
                      placeholder="Décris le contenu…"
                    />
                  </label>

                  {['Projects', 'Events'].includes(selected.group) && (
                    <>
                      <label>
                        Thèmes <small>Un thème par ligne</small>
                        <textarea
                          rows={4}
                          value={listToText(selected.topics)}
                          onChange={e => patch('topics', textToList(e.target.value))}
                          placeholder={'Web\nPentest\nLinux'}
                        />
                      </label>

                      <label>
                        Points forts <small>Un élément par ligne</small>
                        <textarea
                          rows={4}
                          value={listToText(selected.highlights)}
                          onChange={e => patch('highlights', textToList(e.target.value))}
                          placeholder={'Ateliers pratiques\nTravail en équipe'}
                        />
                      </label>

                      <label className="wide">
                        Équipe / informations complémentaires
                        <textarea
                          rows={2}
                          value={selected.team || ''}
                          onChange={e => patch('team', e.target.value)}
                          placeholder="Équipe, encadrement ou autres précisions"
                        />
                      </label>
                    </>
                  )}
                </div>

                {/* Statut commun à toutes les catégories */}
                <h3>Publication</h3>

                <div className="admin-fields two">
                  <label>
                    Statut de publication
                    <select
                      value={selected.status || 'draft'}
                      onChange={e => patch('status', e.target.value)}
                    >
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                    </select>
                  </label>
                </div>

                {/* Visuel du projet */}
                {selected.group === 'Projects' && (
                  <>
                    <h3>Visuel du projet</h3>

                    <div className="admin-fields two">
                      <label>
                        Type de visuel
                        <select
                          value={selected.visual?.id || 'brief'}
                          onChange={e => patchVisual('id', e.target.value)}
                        >
                          {visualTypes.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Nom du fichier / visuel
                        <input
                          value={selected.visual?.file || ''}
                          onChange={e => patchVisual('file', e.target.value)}
                          placeholder="Nom du visuel si applicable"
                        />
                      </label>

                      <label>
                        Statut affiché dans le visuel
                        <input
                          value={selected.visual?.status || ''}
                          onChange={e => patchVisual('status', e.target.value)}
                          placeholder="Ex. contained"
                        />
                      </label>

                      <label>
                        Commande terminal
                        <input
                          value={selected.visual?.command || ''}
                          onChange={e => patchVisual('command', e.target.value)}
                          placeholder="Ex. run lab/attack-chain"
                        />
                      </label>

                      <label className="wide">
                        Lignes du visuel
                        <small>Une ligne par élément : titre | détail | valeur</small>
                        <textarea
                          rows={5}
                          value={(selected.visual?.rows || [])
                            .map((r: any) =>
                              [r.label || '', r.note || '', r.value || ''].join(' | ')
                            )
                            .join('\n')}
                          onChange={e =>
                            patchVisual(
                              'rows',
                              e.target.value.split('\n')
                                .filter(Boolean)
                                .map(line => {
                                  const [
                                    label = '',
                                    note = '',
                                    value = '',
                                  ] = line.split('|').map(s => s.trim())

                                  return { label, note, value }
                                })
                            )
                          }
                          placeholder={'01 | reconnaissance | 4 modules\n02 | accès initial |'}
                        />
                      </label>

                      <label className="wide">
                        Texte de bas de visuel
                        <input
                          value={selected.visual?.foot || ''}
                          onChange={e => patchVisual('foot', e.target.value)}
                          placeholder="Texte en bas du visuel"
                        />
                      </label>
                    </div>
                  </>
                )}

                {/* Informations événement */}
                {selected.group === 'Events' && (
                  <>
                    <h3>Informations de l’événement</h3>

                    <div className="admin-fields two">
                      <label>
                        Date et heure de début
                        <input
                          type="datetime-local"
                          value={selected.date ? String(selected.date).slice(0, 16) : ''}
                          onChange={e => patch('date', e.target.value || null)}
                        />
                      </label>

                      <label>
                        Date et heure de fin
                        <input
                          type="datetime-local"
                          value={selected.endDate ? String(selected.endDate).slice(0, 16) : ''}
                          onChange={e => patch('endDate', e.target.value || null)}
                        />
                      </label>

                      <label>
                        Lieu
                        <input
                          value={selected.location || ''}
                          onChange={e => patch('location', e.target.value)}
                          placeholder="ESI, Oued Smar, Alger"
                        />
                      </label>

                      <label>
                        Organisateur
                        <input
                          value={selected.organizer || ''}
                          onChange={e => patch('organizer', e.target.value)}
                          placeholder="Shellmates"
                        />
                      </label>

                      <label>
                        Date limite d’inscription
                        <input
                          type="datetime-local"
                          value={selected.registrationDeadline ? String(selected.registrationDeadline).slice(0, 16) : ''}
                          onChange={e => patch('registrationDeadline', e.target.value || null)}
                        />
                      </label>

                      <label>
                        Capacité
                        <input
                          type="number"
                          min="0"
                          value={selected.capacity ?? ''}
                          onChange={e => patch('capacity', e.target.value === '' ? null : Number(e.target.value))}
                        />
                      </label>

                      <label>
                        Prix
                        <input
                          value={selected.price || ''}
                          onChange={e => patch('price', e.target.value)}
                          placeholder="Gratuit, 500 DA…"
                        />
                      </label>

                      <label>
                        URL de l’image
                        <input
                          type="url"
                          value={selected.imageUrl || ''}
                          onChange={e => patch('imageUrl', e.target.value)}
                          placeholder="https://…"
                        />
                      </label>

                      <label>
                        URL d’inscription
                        <input
                          type="url"
                          value={selected.registrationUrl || ''}
                          onChange={e => patch('registrationUrl', e.target.value)}
                          placeholder="https://…"
                        />
                      </label>

                      <label className="wide">
                        Galerie d’images <small>Une URL par ligne</small>
                        <textarea
                          rows={3}
                          value={listToText(selected.gallery)}
                          onChange={e => patch('gallery', textToList(e.target.value))}
                        />
                      </label>
                    </div>
                  </>
                )}

                {/* Informations compétence */}
                {selected.group === 'Skills' && (
                  <>
                    <h3>Informations de la compétence</h3>

                    <div className="admin-fields two">
                      <label>
                        Niveau
                        <input
                          value={selected.level || ''}
                          onChange={e => patch('level', e.target.value)}
                          placeholder="Débutant, intermédiaire…"
                        />
                      </label>

                      <label>
                        Durée
                        <input
                          value={selected.duration || ''}
                          onChange={e => patch('duration', e.target.value)}
                          placeholder="4 semaines, 8 heures…"
                        />
                      </label>

                      <label className="wide">
                        Thèmes <small>Un thème par ligne</small>
                        <textarea
                          rows={3}
                          value={listToText(selected.topics)}
                          onChange={e => patch('topics', textToList(e.target.value))}
                        />
                      </label>

                      <label className="wide">
                        Prérequis <small>Un élément par ligne</small>
                        <textarea
                          rows={3}
                          value={listToText(selected.prerequisites)}
                          onChange={e => patch('prerequisites', textToList(e.target.value))}
                        />
                      </label>

                      <label className="wide">
                        Objectifs d’apprentissage
                        <small>Un élément par ligne</small>
                        <textarea
                          rows={3}
                          value={listToText(selected.outcomes)}
                          onChange={e => patch('outcomes', textToList(e.target.value))}
                        />
                      </label>

                      <label>
                        Encadrant
                        <input
                          value={selected.instructor || ''}
                          onChange={e => patch('instructor', e.target.value)}
                        />
                      </label>

                      <label>
                        Image
                        <input
                          value={selected.imageUrl || ''}
                          onChange={e => patch('imageUrl', e.target.value)}
                          placeholder="https://…"
                        />
                      </label>
                    </div>
                  </>
                )}

                {/* Organisation pratique */}
                {selected.group === 'Practice' && (
                  <>
                    <h3>Organisation de la pratique</h3>

                    <div className="admin-fields two">
                      <label>
                        Difficulté
                        <input
                          value={selected.difficulty || ''}
                          onChange={e => patch('difficulty', e.target.value)}
                        />
                      </label>

                      <label>
                        Planning
                        <input
                          value={selected.schedule || ''}
                          onChange={e => patch('schedule', e.target.value)}
                        />
                      </label>

                      <label className="wide">
                        Thèmes <small>Un thème par ligne</small>
                        <textarea
                          rows={3}
                          value={listToText(selected.topics)}
                          onChange={e => patch('topics', textToList(e.target.value))}
                        />
                      </label>

                      <label className="wide">
                        Règles <small>Une règle par ligne</small>
                        <textarea
                          rows={3}
                          value={listToText(selected.rules)}
                          onChange={e => patch('rules', textToList(e.target.value))}
                        />
                      </label>

                      <label className="wide">
                        Matériel / outils <small>Un élément par ligne</small>
                        <textarea
                          rows={3}
                          value={listToText(selected.equipment)}
                          onChange={e => patch('equipment', textToList(e.target.value))}
                        />
                      </label>

                      <label>
                        Image
                        <input
                          value={selected.imageUrl || ''}
                          onChange={e => patch('imageUrl', e.target.value)}
                          placeholder="https://…"
                        />
                      </label>
                    </div>
                  </>
                )}

                {/* Vie du club */}
                {selected.group === 'Club' && (
                  <>
                    <h3>Vie du club</h3>

                    <div className="admin-fields two">
                      <label className="wide">
                        Mission
                        <textarea
                          rows={3}
                          value={selected.mission || ''}
                          onChange={e => patch('mission', e.target.value)}
                        />
                      </label>

                      <label className="wide">
                        Activités <small>Une activité par ligne</small>
                        <textarea
                          rows={3}
                          value={listToText(selected.activities)}
                          onChange={e => patch('activities', textToList(e.target.value))}
                        />
                      </label>

                      <label>
                        Adhésion
                        <input
                          value={selected.membership || ''}
                          onChange={e => patch('membership', e.target.value)}
                        />
                      </label>

                      <label>
                        Contact
                        <input
                          value={selected.contact || ''}
                          onChange={e => patch('contact', e.target.value)}
                        />
                      </label>

                      <label>
                        Image
                        <input
                          value={selected.imageUrl || ''}
                          onChange={e => patch('imageUrl', e.target.value)}
                          placeholder="https://…"
                        />
                      </label>
                    </div>
                  </>
                )}

                {/* Liens externes */}
                <h3>Liens externes</h3>

                <p className="admin-form-note">
                  Un lien par ligne, au format{' '}
                  <code>Nom du lien | https://…</code>.
                </p>

                <textarea
                  className="admin-list-editor"
                  rows={4}
                  value={(selected.links || [])
                    .map((l: any) => `${l.label || ''} | ${l.href || ''}`)
                    .join('\n')}
                  onChange={e =>
                    patch(
                      'links',
                      e.target.value
                        .split('\n')
                        .filter(line => line.trim())
                        .map(line => {
                          const [label = '', ...hrefParts] = line.split('|')

                          return {
                            label: label.trim(),
                            href: hrefParts.join('|').trim(),
                          }
                        })
                    )
                  }
                  placeholder={'GitHub | https://github.com/…\nDocumentation | https://…'}
                />

              </div>
            </>
          ) : (
            <div className="admin-empty">
              <span>▸</span>
              <h2>Sélectionne une fiche</h2>
              <p>
                Choisis une fiche dans la liste ou crée-en une nouvelle.
                Tu pourras modifier chaque champ dans un formulaire.
              </p>
            </div>
          )}

          {message && (
            <p className="admin-message">{message}</p>
          )}

        </section>
      </div>
    </main>
  )
}
