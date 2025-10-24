const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const DEFAULT_BASE_PATH = path.join(__dirname, '../../.local-data');

const ensureDir = async (dirPath) => {
  await fsp.mkdir(dirPath, { recursive: true });
};

const readCollectionFile = async (filePath) => {
  try {
    const buffer = await fsp.readFile(filePath, 'utf-8');
    return JSON.parse(buffer);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const writeCollectionFile = async (filePath, data) => {
  await ensureDir(path.dirname(filePath));
  await fsp.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

const clone = (data) => JSON.parse(JSON.stringify(data));

const createDocSnapshot = (doc) => ({
  id: doc?.id,
  exists: !!doc,
  data: () => clone(doc)
});

const createQuerySnapshot = (docs) => ({
  docs: docs.map((doc) => ({
    id: doc.id,
    data: () => clone(doc)
  }))
});

const compareValue = (a, operator, b) => {
  switch (operator) {
    case '==':
      return a === b;
    case '>=':
      return a >= b;
    case '<=':
      return a <= b;
    case '>':
      return a > b;
    case '<':
      return a < b;
    default:
      return false;
  }
};

function createCollection(basePath, name) {
  const filePath = path.join(basePath, `${name}.json`);

  const loadDocs = async () => {
    const docs = await readCollectionFile(filePath);
    return docs.map((doc) => ({ ...doc }));
  };

  const saveDocs = async (docs) => {
    await writeCollectionFile(filePath, docs);
  };

  const createQuery = (filters = [], limitCount = null) => ({
    where(field, operator, value) {
      return createQuery([...filters, { field, operator, value }], limitCount);
    },
    limit(count) {
      return createQuery(filters, count);
    },
    async get() {
      const docs = await loadDocs();
      let filtered = docs.filter((doc) =>
        filters.every((filter) => compareValue(doc[filter.field], filter.operator, filter.value))
      );
      
      // Apply limit if specified
      if (limitCount !== null && limitCount > 0) {
        filtered = filtered.slice(0, limitCount);
      }
      
      return createQuerySnapshot(filtered);
    }
  });

  return {
    async get() {
      const docs = await loadDocs();
      return createQuerySnapshot(docs);
    },
    where(field, operator, value) {
      return createQuery([{ field, operator, value }], null);
    },
    limit(count) {
      return createQuery([], count);
    },
    doc(id) {
      return {
        async get() {
          const docs = await loadDocs();
          const doc = docs.find((item) => item.id === id);
          return createDocSnapshot(doc);
        },
        async set(data, options = {}) {
          const docs = await loadDocs();
          const idx = docs.findIndex((item) => item.id === id);
          if (idx === -1) {
            docs.push({ id, ...clone(data) });
          } else if (options.merge) {
            docs[idx] = { ...docs[idx], ...clone(data) };
          } else {
            docs[idx] = { id, ...clone(data) };
          }
          await saveDocs(docs);
          return { id };
        },
        async update(data) {
          const docs = await loadDocs();
          const idx = docs.findIndex((item) => item.id === id);
          if (idx === -1) {
            throw new Error(`Documento ${id} no encontrado en colección ${name}`);
          }
          docs[idx] = { ...docs[idx], ...clone(data) };
          await saveDocs(docs);
          return { id };
        },
        async delete() {
          const docs = await loadDocs();
          const filtered = docs.filter((item) => item.id !== id);
          await saveDocs(filtered);
          return { id };
        }
      };
    },
    async add(data) {
      const docs = await loadDocs();
      const id = data.id || randomUUID();
      docs.push({ id, ...clone(data) });
      await saveDocs(docs);
      return { id };
    }
  };
}

function createMockFirestore(options = {}) {
  const basePath = options.basePath || DEFAULT_BASE_PATH;
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  return {
    _isMock: true,
    collection(name) {
      return createCollection(basePath, name);
    }
  };
}

function createMockAuth() {
  return {
    _isMock: true,
    async createUser(data = {}) {
      return { uid: randomUUID(), ...data };
    },
    async getUser(uid) {
      // Return a mock user record
      return { uid, email: '', displayName: '' };
    },
    async updateUser() {
      return {};
    },
    async deleteUser() {
      return {};
    },
    async createCustomToken(uid, claims = {}) {
      // Return a mock token
      return Buffer.from(JSON.stringify({ uid, ...claims })).toString('base64');
    },
    async verifyIdToken(token) {
      // Mock verification - decode the token
      try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        return { uid: decoded.uid || 'mock-user-id', ...decoded };
      } catch (error) {
        throw new Error('Token inválido');
      }
    }
  };
}

module.exports = {
  createMockFirestore,
  createMockAuth
};
