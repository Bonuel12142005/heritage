import { db } from './db.js';

class HeritageGallery {
    // Get all heritage items with filters
    static async findAll(filters = {}) {
        try {
            let query = `
                SELECT h.*, 
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.contributor')) as contributor_name,
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.source')) as source,
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.historical_date')) as historical_date,
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.location')) as location,
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.tags')) as tags,
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.duration')) as duration,
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.transcript')) as transcript,
                       COALESCE(JSON_EXTRACT(h.metadata, '$.view_count'), 0) as view_count,
                       h.file_url as media_url
                FROM heritage_gallery h 
                WHERE h.status = 'active'
            `;
            const params = [];

            if (filters.category) {
                query += ' AND h.category = ?';
                params.push(filters.category);
            }

            if (filters.media_type) {
                // Map 'photo' to 'image' for compatibility
                let mediaType = filters.media_type;
                if (mediaType === 'photo') mediaType = 'image';
                query += ' AND h.media_type = ?';
                params.push(mediaType);
            }

            if (filters.search) {
                query += ' AND (h.title LIKE ? OR h.description LIKE ? OR JSON_EXTRACT(h.metadata, "$.tags") LIKE ?)';
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }

            query += ' ORDER BY h.created_at DESC';

            if (filters.limit) {
                query += ' LIMIT ?';
                params.push(parseInt(filters.limit));
            }

            const [rows] = await db.query(query, params);
            
            // Transform rows to expected format
            return rows.map(row => ({
                ...row,
                media_url: row.file_url || row.media_url,
                media_type: row.media_type === 'image' ? 'photo' : row.media_type,
                status: row.status === 'active' ? 'published' : row.status
            }));
        } catch (err) {
            console.error('Heritage findAll error:', err.message);
            return [];
        }
    }

    // Get single item by ID
    static async findById(id) {
        try {
            const [rows] = await db.query(`
                SELECT h.*, 
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.contributor')) as contributor_name,
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.source')) as source,
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.historical_date')) as historical_date,
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.location')) as location,
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.tags')) as tags,
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.duration')) as duration,
                       JSON_UNQUOTE(JSON_EXTRACT(h.metadata, '$.transcript')) as transcript,
                       COALESCE(JSON_EXTRACT(h.metadata, '$.view_count'), 0) as view_count,
                       h.file_url as media_url
                FROM heritage_gallery h 
                WHERE h.id = ?
            `, [id]);
            
            if (!rows[0]) return null;
            
            const row = rows[0];
            return {
                ...row,
                media_url: row.file_url || row.media_url,
                media_type: row.media_type === 'image' ? 'photo' : row.media_type,
                status: row.status === 'active' ? 'published' : row.status
            };
        } catch (err) {
            console.error('Heritage findById error:', err.message);
            return null;
        }
    }

    // Create new heritage item
    static async create(data) {
        try {
            const metadata = {
                contributor: data.contributor_name,
                source: data.source,
                historical_date: data.historical_date,
                location: data.location,
                tags: data.tags,
                duration: data.duration,
                transcript: data.transcript,
                view_count: 0
            };

            // Map 'photo' to 'image' for database
            let mediaType = data.media_type;
            if (mediaType === 'photo') mediaType = 'image';

            const [result] = await db.query(`
                INSERT INTO heritage_gallery 
                (title, description, category, media_type, file_url, thumbnail_url, metadata, uploaded_by, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
            `, [
                data.title,
                data.description,
                data.category,
                mediaType,
                data.media_url || data.file_url,
                data.thumbnail_url,
                JSON.stringify(metadata),
                data.created_by || null
            ]);

            return result.insertId;
        } catch (err) {
            console.error('Heritage create error:', err.message);
            throw err;
        }
    }

    // Update heritage item
    static async update(id, data) {
        try {
            // First get existing metadata
            const [existing] = await db.query('SELECT metadata FROM heritage_gallery WHERE id = ?', [id]);
            let metadata = {};
            try {
                metadata = existing[0]?.metadata ? JSON.parse(existing[0].metadata) : {};
            } catch (e) {
                metadata = existing[0]?.metadata || {};
            }

            // Update metadata fields
            if (data.contributor_name !== undefined) metadata.contributor = data.contributor_name;
            if (data.source !== undefined) metadata.source = data.source;
            if (data.historical_date !== undefined) metadata.historical_date = data.historical_date;
            if (data.location !== undefined) metadata.location = data.location;
            if (data.tags !== undefined) metadata.tags = data.tags;
            if (data.duration !== undefined) metadata.duration = data.duration;
            if (data.transcript !== undefined) metadata.transcript = data.transcript;

            const fields = ['metadata = ?'];
            const params = [JSON.stringify(metadata)];

            if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title); }
            if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }
            if (data.category !== undefined) { fields.push('category = ?'); params.push(data.category); }
            if (data.media_type !== undefined) { 
                let mediaType = data.media_type === 'photo' ? 'image' : data.media_type;
                fields.push('media_type = ?'); 
                params.push(mediaType); 
            }
            if (data.media_url !== undefined) { fields.push('file_url = ?'); params.push(data.media_url); }
            if (data.file_url !== undefined) { fields.push('file_url = ?'); params.push(data.file_url); }
            if (data.thumbnail_url !== undefined) { fields.push('thumbnail_url = ?'); params.push(data.thumbnail_url); }
            if (data.status !== undefined) { 
                let status = data.status === 'published' ? 'active' : (data.status === 'deleted' ? 'inactive' : data.status);
                fields.push('status = ?'); 
                params.push(status); 
            }

            params.push(id);
            await db.query(`UPDATE heritage_gallery SET ${fields.join(', ')} WHERE id = ?`, params);
        } catch (err) {
            console.error('Heritage update error:', err.message);
            throw err;
        }
    }

    // Soft delete
    static async delete(id) {
        try {
            await db.query('UPDATE heritage_gallery SET status = ? WHERE id = ?', ['inactive', id]);
        } catch (err) {
            console.error('Heritage delete error:', err.message);
            throw err;
        }
    }

    // Get all categories
    static async getCategories() {
        try {
            const [rows] = await db.query(`
                SELECT DISTINCT category FROM heritage_gallery 
                WHERE status = 'active' AND category IS NOT NULL 
                ORDER BY category
            `);
            return rows.map(row => row.category);
        } catch (err) {
            console.error('Heritage getCategories error:', err.message);
            return ['dance', 'music', 'craft', 'tradition', 'historical'];
        }
    }

    // Get statistics
    static async getStats() {
        try {
            const [total] = await db.query('SELECT COUNT(*) as count FROM heritage_gallery WHERE status = ?', ['active']);
            const [photos] = await db.query('SELECT COUNT(*) as count FROM heritage_gallery WHERE media_type = ? AND status = ?', ['image', 'active']);
            const [videos] = await db.query('SELECT COUNT(*) as count FROM heritage_gallery WHERE media_type = ? AND status = ?', ['video', 'active']);
            const [audio] = await db.query('SELECT COUNT(*) as count FROM heritage_gallery WHERE media_type = ? AND status = ?', ['audio', 'active']);

            return {
                total: total[0]?.count || 0,
                photos: photos[0]?.count || 0,
                videos: videos[0]?.count || 0,
                audio: audio[0]?.count || 0,
                documents: 0
            };
        } catch (err) {
            console.error('Heritage getStats error:', err.message);
            return { total: 0, photos: 0, videos: 0, audio: 0, documents: 0 };
        }
    }

    // Increment view count
    static async incrementViews(id) {
        try {
            // Get current metadata
            const [rows] = await db.query('SELECT metadata FROM heritage_gallery WHERE id = ?', [id]);
            if (!rows[0]) return;
            
            let metadata = {};
            try {
                metadata = rows[0].metadata ? JSON.parse(rows[0].metadata) : {};
            } catch (e) {
                metadata = rows[0].metadata || {};
            }
            
            metadata.view_count = (metadata.view_count || 0) + 1;
            
            await db.query('UPDATE heritage_gallery SET metadata = ? WHERE id = ?', [JSON.stringify(metadata), id]);
        } catch (err) {
            console.error('Heritage incrementViews error:', err.message);
        }
    }
}

export { HeritageGallery };
