const { MongoClient } = require('mongodb');

async function testConnection() {
    const uri = 'mongodb://localhost:27017/mental-health-AI';
    const client = new MongoClient(uri);

    try {
        console.log('Attempting to connect to MongoDB...');
        await client.connect();
        console.log('Successfully connected to MongoDB');

        const db = client.db('mental-health-AI');
        await db.command({ ping: 1 });
        console.log('Database ping successful');

        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        await client.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Error:', error);
    }
}

testConnection(); 