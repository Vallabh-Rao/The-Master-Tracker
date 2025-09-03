const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        const dbPath = path.join(__dirname, 'security_karma.db');
        console.log('📍 Database path:', dbPath);
        
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ Error opening database:', err);
            } else {
                console.log('✅ Connected to SQLite database');
                this.initializeDatabase();
            }
        });
    }

    initializeDatabase() {
        const schemaPath = path.join(__dirname, 'schema.sql');
        
        // Check if schema file exists
        if (!fs.existsSync(schemaPath)) {
            console.log('⚠️ Schema file not found, creating tables manually...');
            this.createTablesManually();
            return;
        }

        try {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            
            this.db.exec(schema, (err) => {
                if (err) {
                    console.error('❌ Error creating tables:', err);
                    this.createTablesManually();
                } else {
                    console.log('✅ Database tables initialized from schema');
                }
            });
        } catch (error) {
            console.error('❌ Error reading schema file:', error);
            this.createTablesManually();
        }
    }

    createTablesManually() {
        console.log('🔧 Creating tables manually...');
        
        const createTables = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                karma_score INTEGER DEFAULT 0,
                security_level VARCHAR(20) DEFAULT 'Rookie',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_active DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS actions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                action_type VARCHAR(50) NOT NULL,
                points_earned INTEGER NOT NULL,
                details TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS badges (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                badge_name VARCHAR(50) NOT NULL,
                badge_description TEXT,
                earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `;

        this.db.exec(createTables, (err) => {
            if (err) {
                console.error('❌ Error creating tables manually:', err);
            } else {
                console.log('✅ Tables created successfully');
            }
        });
    }

    getDatabase() {
        return this.db;
    }
}

// Export singleton instance
module.exports = new Database().getDatabase();