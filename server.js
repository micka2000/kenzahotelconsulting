const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const dbPath = path.join(__dirname, 'kenzah.db');

const db = new sqlite3.Database(dbPath);

const contactTableSql = `CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT NOT NULL,
  message TEXT,
  CHECK(email IS NOT NULL OR phone IS NOT NULL)
)`;

function ensureContactsTable() {
  db.serialize(() => {
    db.run(contactTableSql, (err) => {
      if (err) {
        console.error('Erreur lors de la création de la table contacts :', err);
      }
    });

    db.all(`PRAGMA table_info(contacts)`, (err, columns) => {
      if (err || !Array.isArray(columns) || columns.length === 0) return;

      const emailCol = columns.find((col) => col.name === 'email');
      const companyCol = columns.find((col) => col.name === 'company');
      const needsMigration = (emailCol && emailCol.notnull === 1) || (companyCol && companyCol.notnull !== 1);

      if (!needsMigration) return;

      db.run('ALTER TABLE contacts RENAME TO contacts_old', (renameErr) => {
        if (renameErr) {
          console.error('Erreur lors du renommage de la table contacts :', renameErr);
          return;
        }

        db.run(contactTableSql, (createErr) => {
          if (createErr) {
            console.error('Erreur lors de la recréation de la table contacts :', createErr);
            return;
          }

          db.run(
            `INSERT INTO contacts (id, date, name, email, phone, company, message)
             SELECT id, date, name, email, phone, COALESCE(company, 'Non renseigné'), message FROM contacts_old`,
            (copyErr) => {
              if (copyErr) {
                console.error('Erreur lors de la copie des contacts :', copyErr);
                return;
              }

              db.run('DROP TABLE contacts_old');
            }
          );
        });
      });
    });
  });
}

ensureContactsTable();

const hotels = [
  {
    id: 1,
    name: 'Lakeview Boutique Hotel',
    neighborhood: 'Harbourfront',
    rating: 4.7,
    price: 289,
    description:
      'Boutique sur le front de lac avec spa nordique, proche de l’Aquarium de Ripley et de la Tour CN.',
    amenities: ['Spa', 'Piscine intérieure', 'Restaurant', 'Wi-Fi', 'Conciergerie'],
    image: 'lakeview.jpg'
  },
  {
    id: 2,
    name: 'King West Design Hotel',
    neighborhood: 'Entertainment District',
    rating: 4.5,
    price: 245,
    description:
      'Adresse design au cœur des restaurants et théâtres, à deux pas du TIFF Bell Lightbox.',
    amenities: ['Bar rooftop', 'Salle de sport', 'Wi-Fi', 'Service voiturier'],
    image: 'kingwest.jpg'
  },
  {
    id: 3,
    name: 'Yorkville Gallery Suites',
    neighborhood: 'Yorkville',
    rating: 4.8,
    price: 325,
    description:
      'Suites inspirées d’art contemporain près des boutiques de luxe et du ROM.',
    amenities: ['Suites familiales', 'Room service 24/7', 'Centre bien-être', 'Wi-Fi'],
    image: 'yorkville.jpg'
  },
  {
    id: 4,
    name: 'Distillery Heritage Inn',
    neighborhood: 'Distillery District',
    rating: 4.4,
    price: 210,
    description:
      'Ancien entrepôt victorien converti en hôtel chaleureux, entouré de galeries et cafés.',
    amenities: ['Location vélos', 'Café artisanal', 'Wi-Fi', 'Espaces événementiels'],
    image: 'distillery.jpg'
  },
  {
    id: 5,
    name: 'Financial District Executive',
    neighborhood: 'Financial District',
    rating: 4.6,
    price: 260,
    description:
      'Hôtel affaires avec grandes salles de réunion et accès direct au PATH.',
    amenities: ['Business lounge', 'Salle de sport', 'Wi-Fi', 'Late check-out'],
    image: 'financial.jpg'
  }
];

function sendJson(res, data, statusCode = 200) {
  const json = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(json)
  });
  res.end(json);
}

function serveStatic(res, pathname) {
  const filePath = path.join(publicDir, pathname === '/' ? 'index.html' : pathname);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const typeMap = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.json': 'application/json'
    };

    res.writeHead(200, { 'Content-Type': typeMap[ext] || 'text/plain' });
    res.end(content);
  });
}

function filterHotels(query) {
  const { neighborhood, minRating, sort } = query;
  let filtered = [...hotels];

  if (neighborhood) {
    const q = String(neighborhood).toLowerCase();
    filtered = filtered.filter((hotel) => hotel.neighborhood.toLowerCase().includes(q));
  }

  if (minRating) {
    const min = parseFloat(minRating);
    if (!Number.isNaN(min)) {
      filtered = filtered.filter((hotel) => hotel.rating >= min);
    }
  }

  if (sort === 'price') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return filtered;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = body ? JSON.parse(body) : {};
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });

    req.on('error', reject);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/api/hotels' && req.method === 'GET') {
    const filtered = filterHotels(parsedUrl.query);
    return sendJson(res, filtered);
  }

  if (parsedUrl.pathname.startsWith('/api/hotels/') && req.method === 'GET') {
    const id = Number(parsedUrl.pathname.split('/').pop());
    const hotel = hotels.find((item) => item.id === id);

    if (!hotel) {
      return sendJson(res, { message: 'Hotel non trouvé' }, 404);
    }

    return sendJson(res, hotel);
  }

  if (parsedUrl.pathname === '/api/contact' && req.method === 'POST') {
    return parseBody(req)
      .then((data) => {
        const name = data.name && String(data.name).trim();
        const email = data.email ? String(data.email).trim() : '';
        const phoneNumber = data.phoneNumber ? String(data.phoneNumber).trim() : '';
        const phonePrefix = data.phonePrefix ? String(data.phonePrefix).trim() : '';
        const rawPhone = data.phone ? String(data.phone).trim() : '';
        const phone = rawPhone || `${phonePrefix} ${phoneNumber}`.trim();
        const company = data.company ? String(data.company).trim() : '';
        const message = data.message ? String(data.message).trim() : null;

        if (!name) {
          return sendJson(res, { message: 'Nom obligatoire' }, 400);
        }

        if (!email && !phone) {
          return sendJson(res, { message: 'Email ou téléphone obligatoire' }, 400);
        }

        if (!company) {
          return sendJson(res, { message: 'Entreprise obligatoire' }, 400);
        }

        db.run(
          `INSERT INTO contacts (name, email, phone, company, message) VALUES (?, ?, ?, ?, ?)`,
          [name, email || null, phone || null, company, message],
          function (err) {
            if (err) {
              console.error('Erreur lors de l\'insertion du contact :', err);
              return sendJson(res, { message: 'Erreur serveur' }, 500);
            }

            return sendJson(res, { id: this.lastID, message: 'Contact enregistré' }, 201);
          }
        );
      })
      .catch(() => sendJson(res, { message: 'Données invalides' }, 400));
  }

  return serveStatic(res, parsedUrl.pathname);
});

server.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
