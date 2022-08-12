const pool = require('../utils/pool');

module.exports = class Post {
  id;
  title;
  content;

  constructor({ id, title, content }) {
    this.id = id;
    this.title = title;
    this.content = content;
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
