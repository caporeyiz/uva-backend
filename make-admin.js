const Database = require('better-sqlite3');
const db = new Database('users.db');

const email = process.argv[2];

if (!email) {
    console.log('Lütfen bir e-posta adresi belirtin: node make-admin.js ornek@email.com');
    process.exit(1);
}

const result = db.prepare('UPDATE users SET role = ? WHERE email = ?').run('admin', email);

if (result.changes > 0) {
    console.log(`Başarılı! ${email} artık bir admin.`);
} else {
    console.log('Kullanıcı bulunamadı.');
}
