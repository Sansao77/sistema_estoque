CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT UNIQUE NOT NULL,
    codigo TEXT NOT NULL,
    preco REAL NOT NULL,
    quantidade INTEGER NOT NULL
  );

CREATE TABLE IF NOT EXISTS entradas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER,
    quantidade INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saidas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER,
    quantidade INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);