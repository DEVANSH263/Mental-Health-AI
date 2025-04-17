import { getDatabase } from '@/src/utils/mongodb';

async function initializeDatabase() {
  try {
    console.log('Connecting to database...');
    const db = await getDatabase();
    
    // Create collections if they don't exist
    console.log('Creating collections...');
    
    await db.createCollection('chat_messages');
    console.log('Created chat_messages collection');
    
    await db.createCollection('journal_entries');
    console.log('Created journal_entries collection');
    
    // Create indexes
    await db.collection('chat_messages').createIndex({ userId: 1 });
    await db.collection('chat_messages').createIndex({ timestamp: -1 });
    
    await db.collection('journal_entries').createIndex({ userId: 1 });
    await db.collection('journal_entries').createIndex({ timestamp: -1 });
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 