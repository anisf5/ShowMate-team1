# ShowMate API

Backend Express + MongoDB du site ShowMate. Dossier `showmate-backend`, à la racine du projet.

## Installation

1. `cd showmate-backend`
2. `npm install`
3. Copier `.env.example` vers `.env` et remplir les valeurs (ne jamais envoyer `.env` sur GitHub). La base MongoDB Atlas est partagée : demander l'URI à l'équipe
4. `npm run create-admin` : crée le compte admin (une seule fois, si aucun admin n'existe dans la base)
5. `npm run dev` : API sur `http://localhost:5000`

Prérequis : Node.js 20+ et une base MongoDB (locale ou Atlas).

## `.env`

| Variable | Rôle |
|---|---|
| `MONGODB_URI` | URI MongoDB, avec le nom de la base (ex. `.../showmate?...`) |
| `JWT_SECRET` | Secret des jetons, 32 caractères minimum |
| `CLIENT_URL` | URL du front autorisée (`http://localhost:5173`) |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Compte admin (mot de passe : 12 caractères minimum) |

## Routes

| Collection | Route |
|---|---|
| projects | `/api/projects` |
| events | `/api/events` |
| skills | `/api/skills` |
| practices | `/api/practice` |
| clubcontents | `/api/club` |

Pour chacune :
- `GET /` et `GET /slug/:slug` : public, fiches publiées uniquement
- `GET /admin/all` : admin, tous les statuts
- `POST /`, `PATCH /:id`, `DELETE /:id` : admin

Auth : `POST /api/auth/login` renvoie un jeton, à envoyer dans l'en-tête `Authorization: Bearer <token>`. Test : `GET /api/health`.

## Statut

`status` vaut `draft` (brouillon) ou `published` (visible). Un nouvel événement créé dans l'admin démarre en brouillon.