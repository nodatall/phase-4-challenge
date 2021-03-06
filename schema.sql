CREATE TABLE albums (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  joined timestamp default current_timestamp
);

CREATE TABLE reviews (
  id SERIAL,
  content VARCHAR(2000) NOT NULL,
  user_id INTEGER REFERENCES users,
  album_id INTEGER REFERENCES albums,
  date timestamp default current_timestamp
);
