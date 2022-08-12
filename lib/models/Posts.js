const pool = require('../utils/pool');

module.exports = class Post {
  id;
  title;
  content;
  created_at;

  constructor({ id, title, content, created_at }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.created_at = created_at;
  }
  static async getAll() {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM posts
      `
    );
    return rows.map((row) => new Post(row));
  }
};
