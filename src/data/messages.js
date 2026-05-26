export const CONVERSATIONS = [
  { id: 'c1', name: 'Sarah Khalil', last: 'Top, on cale ça dimanche alors 🏃‍♀️', time: '09:12', unread: true },
  { id: 'c2', name: 'Yanis Benali', last: 'Je regarde ton repo ce soir et je te dis', time: 'Hier', unread: true },
  { id: 'c3', name: 'Claire Moreau', last: 'Avec plaisir, on en parle jeudi après la sortie', time: 'Hier', unread: false },
  { id: 'c4', name: 'Léa Fontaine', last: 'Ton profil m’intéresse pour le poste Growth', time: 'Lun.', unread: false },
  { id: 'c5', name: 'Karim Haddad', last: 'Envoie-moi ton deck, je regarde 👀', time: '23 mai', unread: false },
]

export const THREADS = {
  c1: [
    { from: 'them', text: 'Salut Thomas ! J’ai vu qu’on courait tous les deux le dimanche 🙂' },
    { from: 'me', text: 'Salut Sarah ! Oui, sur les quais. Tu prépares une levée aussi non ?' },
    { from: 'them', text: 'Exactement, une seed. On échange nos pitchs en courant ?' },
    { from: 'me', text: 'Parfait. Dimanche 8h au pont de l’Alma ?' },
    { from: 'them', text: 'Top, on cale ça dimanche alors 🏃‍♀️' },
  ],
  c2: [
    { from: 'me', text: 'Hello Yanis, je cherche un dev React pour mon MVP, tu prends des missions ?' },
    { from: 'them', text: 'Yes carrément, parle-moi du projet' },
    { from: 'me', text: 'SaaS B2B : dashboard + onboarding. Dispo sur 2-3 semaines ?' },
    { from: 'them', text: 'Je regarde ton repo ce soir et je te dis' },
  ],
  c3: [
    { from: 'me', text: 'Bonjour Claire, j’aimerais beaucoup avoir vos conseils sur le scaling.' },
    { from: 'them', text: 'Avec plaisir, on en parle jeudi après la sortie' },
  ],
  c4: [
    { from: 'them', text: 'Ton profil m’intéresse pour le poste Growth' },
    { from: 'me', text: 'Merci ! Je suis plutôt côté fondateur, mais je connais des gens 🙂' },
  ],
  c5: [
    { from: 'me', text: 'Bonjour Karim, je lève une seed pour mon SaaS B2B.' },
    { from: 'them', text: 'Envoie-moi ton deck, je regarde 👀' },
  ],
}

export const GROUPS = [
  {
    id: 'g1',
    name: 'Seine Sunday Runners',
    topic: 'Sorties longues du dimanche · Paris',
    members: 128,
    avatars: ['Sarah Khalil', 'Claire Moreau', 'Marc Dubois'],
    time: '09:40',
    unread: 3,
  },
  {
    id: 'g2',
    name: 'Founders & Seed',
    topic: 'Levée de fonds, pitch & deals',
    members: 56,
    avatars: ['Karim Haddad', 'Inès Roy', 'Sarah Khalil'],
    time: 'Hier',
    unread: 0,
  },
  {
    id: 'g3',
    name: 'React & MVP Builders',
    topic: 'Tech, freelances & side-projects',
    members: 41,
    avatars: ['Yanis Benali', 'Hugo Bernard'],
    time: 'Mar.',
    unread: 0,
  },
]

export const GROUP_THREADS = {
  g1: [
    { from: 'Claire Moreau', text: 'Hello la team ! Qui est chaud pour la sortie longue dimanche ?' },
    { from: 'Marc Dubois', text: '12 km le long de la Seine, ça me va 🙌' },
    { from: 'me', text: 'Présent. On part d’où exactement ?' },
    { from: 'Sarah Khalil', text: 'RDV 8h pont de l’Alma 🏃‍♀️ on pitchera en courant' },
  ],
  g2: [
    { from: 'Inès Roy', text: 'Je partage un template de deck qui convertit bien 📊' },
    { from: 'Karim Haddad', text: 'Top. Pensez aussi à un one-pager metrics.' },
    { from: 'me', text: 'Merci ! Je vous envoie le mien pour feedback.' },
  ],
  g3: [
    { from: 'Yanis Benali', text: 'Qui est chaud pour un coworking jeudi aprem ?' },
    { from: 'Hugo Bernard', text: 'Moi si c’est près de République 👍' },
    { from: 'me', text: 'Je peux ramener le café ☕' },
  ],
}

export const GROUP_SUGGESTIONS = [
  { id: 'gs1', name: 'Trail Runners IDF', topic: 'Sorties trail le week-end', members: 92, avatars: ['Marc Dubois', 'Nadia Cherif'] },
  { id: 'gs2', name: 'Growth & Marketplace', topic: 'Acquisition, SEO, marketplaces', members: 64, avatars: ['Léa Fontaine', 'Nadia Cherif'] },
]
