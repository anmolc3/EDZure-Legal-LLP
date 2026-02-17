const db = require('../config/db');

class Insight {
  // Get all insights with pagination
  static async getAll(page = 1, limit = 10, status = null, category = null) {
    try {
      const offset = (page - 1) * limit;
      let query = 'SELECT * FROM insights';
      const conditions = [];
      const params = [];

      if (status) {
        conditions.push('status = ?');
        params.push(status);
      }

      if (category) {
        conditions.push('category = ?');
        params.push(category);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await db.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM insights';
      if (conditions.length > 0) {
        countQuery += ' WHERE ' + conditions.join(' AND ');
      }
      const [countResult] = await db.query(countQuery, params.slice(0, -2));

      return {
        insights: rows,
        total: countResult[0].total,
        page,
        totalPages: Math.ceil(countResult[0].total / limit)
      };
    } catch (error) {
      throw error;
    }
  }

  // Get insight by ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM insights WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get insight by slug
  static async getBySlug(slug) {
    try {
      const [rows] = await db.query('SELECT * FROM insights WHERE slug = ?', [slug]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create new insight
  static async create(insightData) {
    try {
      const {
        title,
        slug,
        content,
        excerpt,
        image_url,
        image_type,
        category,
        author,
        status
      } = insightData;

      const [result] = await db.query(
        `INSERT INTO insights (title, slug, content, excerpt, image_url, image_type, category, author, status, published_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          slug,
          content,
          excerpt,
          image_url,
          image_type,
          category,
          author,
          status,
          status === 'published' ? new Date() : null
        ]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update insight
  static async update(id, insightData) {
    try {
      const {
        title,
        slug,
        content,
        excerpt,
        image_url,
        image_type,
        category,
        author,
        status
      } = insightData;

      const [result] = await db.query(
        `UPDATE insights 
         SET title = ?, slug = ?, content = ?, excerpt = ?, image_url = ?, image_type = ?, 
             category = ?, author = ?, status = ?, 
             published_at = CASE WHEN status = 'published' AND published_at IS NULL THEN NOW() ELSE published_at END
         WHERE id = ?`,
        [title, slug, content, excerpt, image_url, image_type, category, author, status, id]
      );

      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Delete insight
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM insights WHERE id = ?', [id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Increment views
  static async incrementViews(id) {
    try {
      await db.query('UPDATE insights SET views = views + 1 WHERE id = ?', [id]);
    } catch (error) {
      throw error;
    }
  }

  // Get recent insights
  static async getRecent(limit = 5) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM insights WHERE status = "published" ORDER BY published_at DESC LIMIT ?',
        [limit]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Search insights
  static async search(searchTerm, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const searchPattern = `%${searchTerm}%`;

      const [rows] = await db.query(
        `SELECT * FROM insights 
         WHERE (title LIKE ? OR content LIKE ? OR excerpt LIKE ?) AND status = 'published'
         ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [searchPattern, searchPattern, searchPattern, limit, offset]
      );

      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM insights 
         WHERE (title LIKE ? OR content LIKE ? OR excerpt LIKE ?) AND status = 'published'`,
        [searchPattern, searchPattern, searchPattern]
      );

      return {
        insights: rows,
        total: countResult[0].total,
        page,
        totalPages: Math.ceil(countResult[0].total / limit)
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Insight;