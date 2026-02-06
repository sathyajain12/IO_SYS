import { Hono } from 'hono';
import { toCamelCase } from '../utils/caseConverter.js';

const app = new Hono();

// Get all messages for a user
app.get('/', async (c) => {
  try {
    const db = c.env.DB;
    const userEmail = c.req.query('email');

    if (!userEmail) {
      return c.json({ success: false, message: 'Email parameter required' }, 400);
    }

    const { results } = await db.prepare(
      'SELECT * FROM messages WHERE to_email = ? OR from_email = ? ORDER BY created_at DESC LIMIT 50'
    ).bind(userEmail, userEmail).all();

    const messages = toCamelCase(results);
    return c.json({ success: true, messages });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Get unread message count
app.get('/unread/count', async (c) => {
  try {
    const db = c.env.DB;
    const userEmail = c.req.query('email');

    if (!userEmail) {
      return c.json({ success: false, message: 'Email parameter required' }, 400);
    }

    const result = await db.prepare(
      'SELECT COUNT(*) as count FROM messages WHERE to_email = ? AND is_read = 0'
    ).bind(userEmail).first();

    return c.json({ success: true, count: result?.count || 0 });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Mark message as read
app.put('/:id/read', async (c) => {
  try {
    const db = c.env.DB;
    const id = c.req.param('id');
    const now = new Date().toISOString();

    await db.prepare(`
      UPDATE messages
      SET is_read = 1, read_at = ?
      WHERE id = ?
    `).bind(now, id).run();

    return c.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Mark all messages as read
app.put('/read-all', async (c) => {
  try {
    const db = c.env.DB;
    const body = await c.req.json();
    const { userEmail } = body;

    if (!userEmail) {
      return c.json({ success: false, message: 'Email required' }, 400);
    }

    const now = new Date().toISOString();

    await db.prepare(`
      UPDATE messages
      SET is_read = 1, read_at = ?
      WHERE to_email = ? AND is_read = 0
    `).bind(now, userEmail).run();

    return c.json({ success: true, message: 'All messages marked as read' });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Send a message
app.post('/', async (c) => {
  try {
    const db = c.env.DB;
    const body = await c.req.json();
    const { fromEmail, toEmail, subject, body: messageBody, relatedType, relatedId } = body;

    const now = new Date().toISOString();

    const result = await db.prepare(`
      INSERT INTO messages (
        from_email, to_email, subject, body, related_type, related_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `).bind(
      fromEmail, toEmail, subject, messageBody || '',
      relatedType || null, relatedId || null, now
    ).first();

    return c.json({ success: true, id: result.id });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default app;
