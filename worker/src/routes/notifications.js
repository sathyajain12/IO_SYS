import { Hono } from 'hono';
import { toCamelCase } from '../utils/caseConverter.js';

const app = new Hono();

// Get all notifications for a user
app.get('/', async (c) => {
  try {
    const db = c.env.DB;
    const userEmail = c.req.query('email');

    if (!userEmail) {
      return c.json({ success: false, message: 'Email parameter required' }, 400);
    }

    const { results } = await db.prepare(
      'SELECT * FROM notifications WHERE user_email = ? ORDER BY created_at DESC LIMIT 50'
    ).bind(userEmail).all();

    const notifications = toCamelCase(results);
    return c.json({ success: true, notifications });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Get unread notification count
app.get('/unread/count', async (c) => {
  try {
    const db = c.env.DB;
    const userEmail = c.req.query('email');

    if (!userEmail) {
      return c.json({ success: false, message: 'Email parameter required' }, 400);
    }

    const result = await db.prepare(
      'SELECT COUNT(*) as count FROM notifications WHERE user_email = ? AND is_read = 0'
    ).bind(userEmail).first();

    return c.json({ success: true, count: result?.count || 0 });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Mark notification as read
app.put('/:id/read', async (c) => {
  try {
    const db = c.env.DB;
    const id = c.req.param('id');
    const now = new Date().toISOString();

    await db.prepare(`
      UPDATE notifications
      SET is_read = 1, read_at = ?
      WHERE id = ?
    `).bind(now, id).run();

    return c.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Mark all notifications as read
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
      UPDATE notifications
      SET is_read = 1, read_at = ?
      WHERE user_email = ? AND is_read = 0
    `).bind(now, userEmail).run();

    return c.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Create a notification (internal use)
app.post('/', async (c) => {
  try {
    const db = c.env.DB;
    const body = await c.req.json();
    const { userEmail, title, message, type, relatedType, relatedId } = body;

    const now = new Date().toISOString();

    const result = await db.prepare(`
      INSERT INTO notifications (
        user_email, title, message, type, related_type, related_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `).bind(
      userEmail, title, message || '', type || 'info',
      relatedType || null, relatedId || null, now
    ).first();

    return c.json({ success: true, id: result.id });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default app;
