/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Database setup
// Ensure users.db is created in the current directory
const db = new Database('users.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Açık',
    created_at TEXT NOT NULL,
    replies TEXT DEFAULT '[]',
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT, -- NULL for global announcements
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'system', -- 'system', 'ticket', 'announcement'
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  )
`);

// Migration: Add missing columns if they don't exist
const columns = db.prepare("PRAGMA table_info(users)").all();
const columnNames = columns.map(c => c.name);

const requiredColumns = [
    { name: 'major', type: 'TEXT' },
    { name: 'target_rank', type: 'TEXT' },
    { name: 'target_goal', type: 'TEXT' },
    { name: 'education_status', type: 'TEXT' },
    { name: 'base_level', type: 'TEXT' },
    { name: 'current_nets', type: 'TEXT' },
    { name: 'daily_study_hours', type: 'TEXT' },
    { name: 'school_status', type: 'TEXT' },
    { name: 'hardest_subject', type: 'TEXT' },
    { name: 'photo_url', type: 'TEXT' },
    { name: 'phone', type: 'TEXT' },
    { name: 'school_name', type: 'TEXT' },
    { name: 'subscription_plan', type: 'TEXT DEFAULT "Free"' },
    { name: 'is_2fa_enabled', type: 'INTEGER DEFAULT 0' },
    { name: 'notification_prefs', type: 'TEXT' },
    { name: 'ai_difficulty', type: 'TEXT DEFAULT "Orta"' },
    { name: 'off_days', type: 'TEXT' },
    { name: 'max_study_hours', type: 'TEXT' },
    { name: 'library', type: 'TEXT' },
    { name: 'role', type: 'TEXT DEFAULT "user"' }
];

requiredColumns.forEach(col => {
    if (!columnNames.includes(col.name)) {
        console.log(`Adding missing column: ${col.name}`);
        const defaultClause = col.type.includes('DEFAULT') ? '' : ''; // In sqlite3, you can't always easily add NOT NULL with DEFAULT in ALTER if table is not empty but we're adding NULLABLE or with DEFAULT
        db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
    }
});

// Helper function to map camelCase fields to snake_case columns
const mapToColumn = (field) => {
    const mapping = {
        name: 'name',
        email: 'email',
        major: 'major',
        targetRank: 'target_rank',
        targetGoal: 'target_goal',
        educationStatus: 'education_status',
        baseLevel: 'base_level',
        currentNets: 'current_nets',
        dailyStudyHours: 'daily_study_hours',
        schoolStatus: 'school_status',
        hardestSubject: 'hardest_subject',
        photoURL: 'photo_url',
        phone: 'phone',
        schoolName: 'school_name',
        subscriptionPlan: 'subscription_plan',
        is2FAEnabled: 'is_2fa_enabled',
        notificationPrefs: 'notification_prefs',
        aiDifficulty: 'ai_difficulty',
        offDays: 'off_days',
        maxStudyHours: 'max_study_hours',
        library: 'library'
    };
    return mapping[field] || field;
};

app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/register', (req, res) => {
    const {
        name,
        email,
        password,
        major,
        targetRank,
        targetGoal,
        educationStatus,
        baseLevel,
        currentNets,
        dailyStudyHours,
        schoolStatus,
        hardestSubject
    } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Eksik bilgiler.' });
    }

    try {
        const id = Math.random().toString(36).substr(2, 9);
        const insert = db.prepare(`
            INSERT INTO users (
                id, name, email, password, major, target_rank, target_goal, 
                education_status, base_level, current_nets, daily_study_hours, 
                school_status, hardest_subject
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insert.run(
            id, name, email, password, major, targetRank, targetGoal,
            educationStatus, JSON.stringify(baseLevel), JSON.stringify(currentNets),
            dailyStudyHours, schoolStatus, hardestSubject
        );

        res.status(201).json({
            id, name, email, major, targetRank, targetGoal,
            educationStatus, baseLevel, currentNets,
            dailyStudyHours, schoolStatus, hardestSubject,
            photoURL: null,
            phone: null,
            schoolName: null,
            subscriptionPlan: 'Free',
            is2FAEnabled: false,
            notificationPrefs: { email: true, push: true, sms: false },
            aiDifficulty: 'Orta',
            offDays: [],
            maxStudyHours: '6',
            library: []
        });
    } catch (err) {
        if (err.message && err.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ error: 'Bu e-posta adresi zaten kullanımda.' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Sunucu hatası.' });
        }
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Eksik bilgiler.' });
    }

    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);

        if (user) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                major: user.major,
                targetRank: user.target_rank,
                targetGoal: user.target_goal,
                educationStatus: user.education_status,
                baseLevel: user.base_level ? JSON.parse(user.base_level) : null,
                currentNets: user.current_nets ? JSON.parse(user.current_nets) : null,
                dailyStudyHours: user.daily_study_hours,
                schoolStatus: user.school_status,
                hardestSubject: user.hardest_subject,
                photoURL: user.photo_url,
                phone: user.phone,
                schoolName: user.school_name,
                subscriptionPlan: user.subscription_plan,
                is2FAEnabled: user.is_2fa_enabled === 1,
                notificationPrefs: user.notification_prefs ? JSON.parse(user.notification_prefs) : { email: true, push: true, sms: false },
                aiDifficulty: user.ai_difficulty,
                offDays: user.off_days ? JSON.parse(user.off_days) : [],
                maxStudyHours: user.max_study_hours,
                library: user.library ? JSON.parse(user.library) : [],
                role: user.role
            });
        } else {
            res.status(401).json({ error: 'Giriş yapılamadı. Bilgilerinizi kontrol edin.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

app.post('/api/update-profile', (req, res) => {
    const { id, ...updates } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const setClauses = [];
        const values = [];

        for (const [key, value] of Object.entries(updates)) {
            const column = mapToColumn(key);
            setClauses.push(`${column} = ?`);

            if (typeof value === 'object' && value !== null) {
                values.push(JSON.stringify(value));
            } else if (typeof value === 'boolean') {
                values.push(value ? 1 : 0);
            } else {
                values.push(value);
            }
        }

        if (setClauses.length > 0) {
            values.push(id);
            const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`;
            db.prepare(sql).run(...values);
        }

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

        if (user) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                major: user.major,
                targetRank: user.target_rank,
                targetGoal: user.target_goal,
                educationStatus: user.education_status,
                baseLevel: user.base_level ? JSON.parse(user.base_level) : null,
                currentNets: user.current_nets ? JSON.parse(user.current_nets) : null,
                dailyStudyHours: user.daily_study_hours,
                schoolStatus: user.school_status,
                hardestSubject: user.hardest_subject,
                photoURL: user.photo_url,
                phone: user.phone,
                schoolName: user.school_name,
                subscriptionPlan: user.subscription_plan,
                is2FAEnabled: user.is_2fa_enabled === 1,
                notificationPrefs: user.notification_prefs ? JSON.parse(user.notification_prefs) : { email: true, push: true, sms: false },
                aiDifficulty: user.ai_difficulty,
                offDays: user.off_days ? JSON.parse(user.off_days) : [],
                maxStudyHours: user.max_study_hours,
                library: user.library ? JSON.parse(user.library) : [],
                role: user.role
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// Support Ticket Routes
app.post('/api/support/create', (req, res) => {
    const { userId, subject, category, message } = req.body;
    const ticketId = Math.random().toString(36).substring(2, 15);
    const createdAt = new Date().toISOString();

    try {
        db.prepare('INSERT INTO support_tickets (id, user_id, subject, category, message, created_at) VALUES (?, ?, ?, ?, ?, ?)')
            .run(ticketId, userId, subject, category, message, createdAt);

        // Notify admins
        const admins = db.prepare('SELECT id FROM users WHERE role = ?').all('admin');
        const user = db.prepare('SELECT name FROM users WHERE id = ?').get(userId);
        admins.forEach(admin => {
            db.prepare('INSERT INTO notifications (id, user_id, title, message, type, created_at) VALUES (?, ?, ?, ?, ?, ?)')
                .run(Math.random().toString(36).substring(2, 11), admin.id, 'Yeni Destek Talebi', `${user.name} yeni bir destek talebi açtı: ${subject}`, 'ticket', createdAt);
        });

        res.json({ success: true, ticketId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Talep oluşturulamadı.' });
    }
});

app.get('/api/support/tickets/:userId', (req, res) => {
    const { userId } = req.params;

    try {
        const tickets = db.prepare('SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC').all(userId);
        const parsedTickets = tickets.map(t => ({
            ...t,
            replies: JSON.parse(t.replies)
        }));
        res.json(parsedTickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Talepler alınamadı.' });
    }
});

app.post('/api/support/reply', (req, res) => {
    const { ticketId, message } = req.body;
    const replyId = Math.random().toString(36).substring(2, 11);
    const createdAt = new Date().toISOString();

    try {
        const ticket = db.prepare('SELECT replies FROM support_tickets WHERE id = ?').get(ticketId);
        if (!ticket) return res.status(404).json({ error: 'Talep bulunamadı.' });

        const replies = JSON.parse(ticket.replies);
        replies.push({
            id: replyId,
            sender: 'user',
            message,
            created_at: createdAt
        });

        db.prepare('UPDATE support_tickets SET replies = ?, status = ? WHERE id = ?')
            .run(JSON.stringify(replies), 'Açık', ticketId);

        // Notify admins on user reply
        const admins = db.prepare('SELECT id FROM users WHERE role = ?').all('admin');
        const ticketInfo = db.prepare('SELECT subject, user_id FROM support_tickets WHERE id = ?').get(ticketId);
        const user = db.prepare('SELECT name FROM users WHERE id = ?').get(ticketInfo.user_id);
        admins.forEach(admin => {
            db.prepare('INSERT INTO notifications (id, user_id, title, message, type, created_at) VALUES (?, ?, ?, ?, ?, ?)')
                .run(Math.random().toString(36).substring(2, 11), admin.id, 'Destek Talebi Güncellendi', `${user.name} talebine yanıt verdi: ${ticketInfo.subject}`, 'ticket', createdAt);
        });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Yanıt gönderilemedi.' });
    }
});

// Admin Support Routes
app.get('/api/admin/tickets', (req, res) => {
    try {
        const tickets = db.prepare(`
            SELECT support_tickets.*, users.name as user_name, users.email as user_email 
            FROM support_tickets 
            JOIN users ON support_tickets.user_id = users.id 
            ORDER BY created_at DESC
        `).all();
        const parsedTickets = tickets.map(t => ({
            ...t,
            replies: JSON.parse(t.replies)
        }));
        res.json(parsedTickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Tüm talepler alınamadı.' });
    }
});

app.post('/api/admin/reply', (req, res) => {
    const { ticketId, message } = req.body;
    const replyId = Math.random().toString(36).substring(2, 11);
    const createdAt = new Date().toISOString();

    try {
        const ticket = db.prepare('SELECT replies FROM support_tickets WHERE id = ?').get(ticketId);
        if (!ticket) return res.status(404).json({ error: 'Talep bulunamadı.' });

        const replies = JSON.parse(ticket.replies);
        replies.push({
            id: replyId,
            sender: 'admin',
            message,
            created_at: createdAt
        });

        db.prepare('UPDATE support_tickets SET replies = ?, status = ? WHERE id = ?')
            .run(JSON.stringify(replies), 'Cevaplandı', ticketId);

        // Notify user on admin reply
        const ticketInfo = db.prepare('SELECT user_id, subject FROM support_tickets WHERE id = ?').get(ticketId);
        db.prepare('INSERT INTO notifications (id, user_id, title, message, type, created_at) VALUES (?, ?, ?, ?, ?, ?)')
            .run(Math.random().toString(36).substring(2, 11), ticketInfo.user_id, 'Destek Talebiniz Yanıtlandı', `"${ticketInfo.subject}" konulu talebiniz yanıtlandı.`, 'ticket', createdAt);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Yanıt gönderilemedi.' });
    }
});

app.post('/api/admin/close-ticket', (req, res) => {
    const { ticketId } = req.body;
    try {
        db.prepare('UPDATE support_tickets SET status = ? WHERE id = ?').run('Kapandı', ticketId);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Talep kapatılamadı.' });
    }
});

// Admin User Management Routes
app.get('/api/admin/users', (req, res) => {
    try {
        const users = db.prepare('SELECT id, name, email, major, target_rank, subscription_plan, role, created_at FROM users').all();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kullanıcılar alınamadı.' });
    }
});

app.get('/api/admin/users/:userId', (req, res) => {
    const { userId } = req.params;
    try {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

        // Parse JSON fields
        const userData = {
            ...user,
            base_level: user.base_level ? JSON.parse(user.base_level) : null,
            current_nets: user.current_nets ? JSON.parse(user.current_nets) : null,
            notification_prefs: user.notification_prefs ? JSON.parse(user.notification_prefs) : null,
            off_days: user.off_days ? JSON.parse(user.off_days) : [],
            library: user.library ? JSON.parse(user.library) : []
        };
        res.json(userData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kullanıcı detayları alınamadı.' });
    }
});

app.post('/api/admin/users/reset-password', (req, res) => {
    const { userId, newPassword } = req.body;
    try {
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newPassword, userId);
        res.json({ success: true, message: 'Şifre başarıyla güncellendi.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Şifre sıfırlanamadı.' });
    }
});

app.post('/api/admin/users/update', (req, res) => {
    const { userId, updates } = req.body;
    try {
        const setClauses = [];
        const values = [];
        for (const [key, value] of Object.entries(updates)) {
            setClauses.push(`${mapToColumn(key)} = ?`);
            values.push(value);
        }
        values.push(userId);
        db.prepare(`UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`).run(...values);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kullanıcı güncellenemedi.' });
    }
});

app.delete('/api/admin/users/:userId', (req, res) => {
    const { userId } = req.params;
    try {
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);
        db.prepare('DELETE FROM support_tickets WHERE user_id = ?').run(userId);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kullanıcı silinemedi.' });
    }
});

app.get('/api/admin/stats', (req, res) => {
    try {
        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
        const totalTickets = db.prepare('SELECT COUNT(*) as count FROM support_tickets').get().count;
        const openTickets = db.prepare("SELECT COUNT(*) as count FROM support_tickets WHERE status = 'Açık'").get().count;
        const premiumUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE subscription_plan = 'Premium' OR subscription_plan = 'UVA Pro'").get().count;

        res.json({
            totalUsers,
            totalTickets,
            openTickets,
            premiumUsers
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'İstatistikler alınamadı.' });
    }
});

// Notifications Endpoints
app.get('/api/notifications/:userId', (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = db.prepare(`
            SELECT * FROM notifications 
            WHERE (user_id = ? OR user_id IS NULL) 
            ORDER BY created_at DESC 
            LIMIT 50
        `).all(userId);
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Bildirimler alınamadı.' });
    }
});

app.post('/api/notifications/mark-read', (req, res) => {
    const { notificationId } = req.body;
    try {
        db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(notificationId);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Bildirim güncellenemedi.' });
    }
});

app.post('/api/admin/announcement', (req, res) => {
    const { title, message } = req.body;
    const id = Math.random().toString(36).substring(2, 11);
    const createdAt = new Date().toISOString();
    try {
        db.prepare('INSERT INTO notifications (id, user_id, title, message, type, created_at) VALUES (?, NULL, ?, ?, ?, ?)')
            .run(id, title, message, 'announcement', createdAt);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Duyuru oluşturulamadı.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
    console.log(`Database columns check:`, db.prepare("PRAGMA table_info(users)").all().map(c => c.name));
});
