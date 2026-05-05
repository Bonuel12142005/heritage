import { db } from '../models/db.js';

class EventController {
  async getAllEvents(req, res) {
    try {
      const [events] = await db.query(`
        SELECT * FROM events ORDER BY event_date DESC
      `);
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  }

  async createEvent(req, res) {
    try {
      const { title, description, event_date, event_time, venue, organizer } = req.body;
      
      const [result] = await db.query(`
        INSERT INTO events (title, description, event_date, event_time, venue, organizer)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [title, description, event_date, event_time, venue, organizer]);

      res.status(201).json({ 
        message: 'Event created successfully', 
        id: result.insertId 
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  }

  // Placeholder method for future implementation
  async deleteEvent(req, res) {
    res.status(501).json({ error: 'Not implemented yet' });
  }
}

export default new EventController();