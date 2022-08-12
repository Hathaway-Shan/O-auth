-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS github_users;
DROP TABLE IF EXISTS posts

CREATE TABLE github_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT,
  avatar TEXT
);

CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title TEXT,
  content VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES github_users(id)
);

INSERT INTO github_users
(username, email, avatar)
VALUES
('Kugrash', 'example@example.com','http://placekitten.com/200/300' ),
('Wally', 'example2@example.com', 'http://placekitten.com/200/300'),
('Misty-Moore', 'example3@example.com', 'http://placekitten.com/200/300');

INSERT INTO posts
(user_id, title, content)
VALUES
('1', 'post 1', 'this is a post'),
('2', 'post 2', 'this is also a post'),
('3', 'post 3', 'this is the final post');