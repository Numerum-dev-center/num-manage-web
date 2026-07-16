// Serveur mock (json-server) pour développer le frontend sans l'API NestJS ni MySQL.
// Reproduit les endpoints réels utilisés par le frontend, avec les mêmes formes de
// réponse (voir num-manage-api). Les données vivent dans mock-server/db.json.
const path = require('path');
const jsonServer = require('json-server');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = process.env.MOCK_PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const db = router.db;

server.use(jsonServer.defaults());
server.use(cors({ origin: FRONTEND_URL, credentials: true }));
server.use(cookieParser());
server.use(jsonServer.bodyParser);

function serializeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  const promotion = user.promotionId ? db.get('promotions').find({ id: user.promotionId }).value() : null;
  return {
    ...safe,
    promotion: promotion ? { id: promotion.id, name: promotion.name, isArchived: promotion.isArchived } : null,
  };
}

function serializeFormateur(user) {
  if (!user) return null;
  return { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email };
}

function serializePromotion(promotion) {
  if (!promotion) return null;
  const apprenants = db
    .get('users')
    .filter({ promotionId: promotion.id, role: 'student', isDeleted: false })
    .value()
    .map(serializeUser);
  const formateur = promotion.formateurId
    ? db.get('users').find({ id: promotion.formateurId }).value()
    : null;
  return { ...promotion, apprenants, formateur: serializeFormateur(formateur) };
}

function findUserByToken(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token || !token.startsWith('mock-token-')) return null;
  const userId = token.replace('mock-token-', '');
  return db.get('users').find({ id: userId, isDeleted: false }).value() || null;
}

function requireAuth(req, res) {
  const user = findUserByToken(req);
  if (!user) {
    res.status(401).json({ statusCode: 401, message: 'Non authentifié' });
    return null;
  }
  return user;
}

function issueSession(res, user) {
  res.cookie('refreshToken', `mock-refresh-${user.id}`, { httpOnly: true, sameSite: 'lax' });
  return { accessToken: `mock-token-${user.id}`, user: serializeUser(user) };
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

server.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = db.get('users').find({ email, isDeleted: false }).value();
  if (!user || user.password !== password) {
    return res.status(401).json({ statusCode: 401, message: 'Email ou mot de passe incorrect' });
  }
  res.json(issueSession(res, user));
});

server.post('/auth/register', (req, res) => {
  const { firstname, lastname, email, password } = req.body || {};
  if (db.get('users').find({ email }).value()) {
    return res.status(409).json({ statusCode: 409, message: 'Cet email est déjà utilisé' });
  }
  const now = new Date().toISOString();
  const user = {
    id: `u-${Date.now()}`,
    firstname,
    lastname,
    email,
    password,
    role: 'student',
    isActive: true,
    isDeleted: false,
    phoneNumber: null,
    promotionId: null,
    createdAt: now,
    updatedAt: now,
  };
  db.get('users').push(user).write();
  res.status(201).json(issueSession(res, user));
});

server.get('/auth/me', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  res.json(serializeUser(user));
});

server.post('/auth/refresh', (req, res) => {
  const refreshCookie = req.cookies?.refreshToken;
  const userId = refreshCookie?.startsWith('mock-refresh-') ? refreshCookie.replace('mock-refresh-', '') : null;
  const user = userId ? db.get('users').find({ id: userId, isDeleted: false }).value() : null;
  if (!user) {
    return res.status(401).json({ statusCode: 401, message: 'Refresh token invalide ou expiré' });
  }
  res.json({ accessToken: `mock-token-${user.id}` });
});

server.post('/auth/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Déconnecté avec succès' });
});

// Court-circuite le vrai OAuth Google : redirige directement vers le callback
// frontend avec un utilisateur de test, pour pouvoir travailler sur ce flux
// sans identifiants Google réels. ?as=admin|manager|student (défaut: student).
server.get('/auth/google', (req, res) => {
  const role = ['admin', 'manager', 'student'].includes(req.query.as) ? req.query.as : 'student';
  const user = db.get('users').find({ role, isDeleted: false }).value();
  if (!user) return res.status(404).send('Aucun utilisateur de test pour ce rôle');
  const { accessToken } = issueSession(res, user);
  res.redirect(`${FRONTEND_URL}/auth/google/callback?token=${accessToken}`);
});

// ---------------------------------------------------------------------------
// Mon espace (apprenant)
// ---------------------------------------------------------------------------

server.get('/mon-espace/ma-promotion', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  if (!user.promotionId) {
    return res.json({ promotion: null, camarades: [] });
  }
  const promotion = db.get('promotions').find({ id: user.promotionId }).value();
  const camarades = db
    .get('users')
    .filter({ promotionId: user.promotionId, role: 'student', isDeleted: false })
    .value()
    .filter((u) => u.id !== user.id)
    .map(serializeUser);
  res.json({
    promotion: promotion ? { id: promotion.id, name: promotion.name, description: promotion.description } : null,
    camarades,
  });
});

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

server.get('/users', (req, res) => {
  res.json(db.get('users').filter({ isDeleted: false }).value().map(serializeUser));
});

server.get('/users/:id', (req, res) => {
  const user = db.get('users').find({ id: req.params.id, isDeleted: false }).value();
  if (!user) return res.status(404).json({ statusCode: 404, message: 'Utilisateur non trouvé' });
  res.json(serializeUser(user));
});

server.post('/users', (req, res) => {
  const now = new Date().toISOString();
  const user = {
    id: `u-${Date.now()}`,
    isActive: true,
    isDeleted: false,
    phoneNumber: null,
    promotionId: null,
    role: 'student',
    createdAt: now,
    updatedAt: now,
    ...req.body,
  };
  db.get('users').push(user).write();
  res.status(201).json(serializeUser(user));
});

server.patch('/users/me', (req, res) => {
  const current = requireAuth(req, res);
  if (!current) return;
  db.get('users').find({ id: current.id }).assign({ ...req.body, updatedAt: new Date().toISOString() }).write();
  res.json(serializeUser(db.get('users').find({ id: current.id }).value()));
});

server.patch('/users/:id/toggle-active', (req, res) => {
  const user = db.get('users').find({ id: req.params.id }).value();
  if (!user) return res.status(404).json({ statusCode: 404, message: 'Utilisateur non trouvé' });
  db.get('users').find({ id: req.params.id }).assign({ isActive: !user.isActive }).write();
  res.json(serializeUser(db.get('users').find({ id: req.params.id }).value()));
});

server.patch('/users/:id', (req, res) => {
  if (!db.get('users').find({ id: req.params.id }).value()) {
    return res.status(404).json({ statusCode: 404, message: 'Utilisateur non trouvé' });
  }
  db.get('users').find({ id: req.params.id }).assign({ ...req.body, updatedAt: new Date().toISOString() }).write();
  res.json(serializeUser(db.get('users').find({ id: req.params.id }).value()));
});

server.delete('/users/:id', (req, res) => {
  db.get('users').find({ id: req.params.id }).assign({ isDeleted: true }).write();
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// Promotions
// ---------------------------------------------------------------------------

server.get('/promotions', (req, res) => {
  const includeArchived = req.query.includeArchived === 'true';
  const all = db.get('promotions').value();
  const filtered = includeArchived ? all : all.filter((p) => !p.isArchived);
  res.json(filtered.map(serializePromotion));
});

server.get('/promotions/:id', (req, res) => {
  const promotion = db.get('promotions').find({ id: req.params.id }).value();
  if (!promotion) return res.status(404).json({ statusCode: 404, message: 'Promotion non trouvée' });
  res.json(serializePromotion(promotion));
});

server.post('/promotions', (req, res) => {
  const now = new Date().toISOString();
  const promotion = {
    id: `p-${Date.now()}`,
    description: null,
    isArchived: false,
    startDate: null,
    endDate: null,
    formateurId: null,
    createdAt: now,
    updatedAt: now,
    ...req.body,
  };
  db.get('promotions').push(promotion).write();
  res.status(201).json(serializePromotion(promotion));
});

server.patch('/promotions/:id/archive', (req, res) => {
  if (!db.get('promotions').find({ id: req.params.id }).value()) {
    return res.status(404).json({ statusCode: 404, message: 'Promotion non trouvée' });
  }
  db.get('promotions').find({ id: req.params.id }).assign({ isArchived: true }).write();
  res.json(serializePromotion(db.get('promotions').find({ id: req.params.id }).value()));
});

server.patch('/promotions/:id/apprenants', (req, res) => {
  const promotion = db.get('promotions').find({ id: req.params.id }).value();
  if (!promotion) return res.status(404).json({ statusCode: 404, message: 'Promotion non trouvée' });
  if (promotion.isArchived) {
    return res.status(400).json({ statusCode: 400, message: 'Impossible d’affecter des apprenants à une promotion archivée' });
  }
  const { apprenantIds } = req.body || {};
  (apprenantIds || []).forEach((userId) => {
    db.get('users').find({ id: userId }).assign({ promotionId: req.params.id }).write();
  });
  res.json(serializePromotion(db.get('promotions').find({ id: req.params.id }).value()));
});

server.delete('/promotions/:id/apprenants/:userId', (req, res) => {
  db.get('users').find({ id: req.params.userId }).assign({ promotionId: null }).write();
  res.json(serializePromotion(db.get('promotions').find({ id: req.params.id }).value()));
});

server.patch('/promotions/:id', (req, res) => {
  if (!db.get('promotions').find({ id: req.params.id }).value()) {
    return res.status(404).json({ statusCode: 404, message: 'Promotion non trouvée' });
  }
  db.get('promotions').find({ id: req.params.id }).assign({ ...req.body, updatedAt: new Date().toISOString() }).write();
  res.json(serializePromotion(db.get('promotions').find({ id: req.params.id }).value()));
});

// Filet de sécurité : toute route non gérée ci-dessus retombe sur le routeur
// REST par défaut de json-server (utile pour explorer db.json directement).
server.use(router);

server.listen(PORT, () => {
  console.log(`Mock API (json-server) démarrée sur http://localhost:${PORT}`);
  console.log(`CORS autorisé pour ${FRONTEND_URL} (withCredentials)`);
  console.log('Comptes de test : admin@numerum.com / manager@numerum.com / student@numerum.com (mot de passe voir mock-server/README.md)');
});
