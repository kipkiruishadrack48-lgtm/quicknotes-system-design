
# QuickNotes Data Model

## 1. Database Overview

QuickNotes uses PostgreSQL, a relational database, to store users, notes, tags, and the relationships between notes and tags.

## 2. Database Entities and Columns

### Users Table

| Column | Data Type | Key / Constraint |
|---|---|---|
| id | BIGINT | Primary Key |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

### Notes Table

| Column | Data Type | Key / Constraint |
|---|---|---|
| id | BIGINT | Primary Key |
| user_id | BIGINT | Foreign Key |
| title | VARCHAR(100) | NOT NULL |
| body | TEXT | Optional |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### Tags Table

| Column | Data Type | Key / Constraint |
|---|---|---|
| id | BIGINT | Primary Key |
| user_id | BIGINT | Foreign Key |
| name | VARCHAR(50) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

### Note_Tags Table

| Column | Data Type | Key / Constraint |
|---|---|---|
| note_id | BIGINT | Foreign Key, Primary Key |
| tag_id | BIGINT | Foreign Key, Primary Key |

## 3. Relationships

- **Users and Notes:** One user can create many notes. Each note belongs to one user. This is a one-to-many relationship.
- **Users and Tags:** One user can create many tags. Each tag belongs to one user. This is a one-to-many relationship.
- **Notes and Tags:** One note can have many tags, and one tag can be used on many notes. This is a many-to-many relationship managed through the note_tags table.

## 4. SQL Table Creation

The following SQL statements create the four tables.

### Create Users Table

```sql
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Create Notes Table

```sql
CREATE TABLE notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Create Tags Table

```sql
CREATE TABLE tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);
```

### Create Note_Tags Table

```sql
CREATE TABLE note_tags (
    note_id BIGINT REFERENCES notes(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);
```

## 5. Example SQL Queries

### Query 1: Get all notes belonging to a user

```sql
SELECT *
FROM notes
WHERE user_id = 1;
```

### Query 2: Get notes with their tags

```sql
SELECT notes.title, tags.name AS tag
FROM notes
JOIN note_tags ON notes.id = note_tags.note_id
JOIN tags ON note_tags.tag_id = tags.id;
```

### Query 3: Count notes created by each user

```sql
SELECT users.name, COUNT(notes.id) AS total_notes
FROM users
LEFT JOIN notes ON users.id = notes.user_id
GROUP BY users.id, users.name;
```

## 6. Database Indexing

```sql
CREATE INDEX idx_notes_user_created_at
ON notes(user_id, created_at DESC);
```

This index improves performance when retrieving a user's notes, especially when displaying the newest notes first.

## 7. SQL vs NoSQL

QuickNotes uses SQL because its data has clear relationships between users, notes, and tags. PostgreSQL supports primary keys, foreign keys, joins, and transactions, which help maintain data accuracy and consistency.

NoSQL databases are useful for flexible or unstructured data, but a relational database is more suitable for the structured relationships required by QuickNotes.
