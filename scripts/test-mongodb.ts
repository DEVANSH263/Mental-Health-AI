import { MongoClient } from 'mongodb';

async function testMongoDB() {
  const uri = 'mongodb://localhost:27017/mental-health-AI';
  const client = new MongoClient(uri);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully');

    const db = client.db('mental-health-AI');
    console.log('Using database:', db.databaseName);

    // Test inserting a document
    const testMessage = {
      message: 'Test message',
      response: 'Test response',
      timestamp: new Date(),
      userId: null,
      sentiment: 0
    };

    console.log('Inserting test document...');
    const result = await db.collection('chat_messages').insertOne(testMessage);
    console.log('Insert result:', result);

    // Verify the document was inserted
    const insertedDoc = await db.collection('chat_messages').findOne({ _id: result.insertedId });
    console.log('Found document:', insertedDoc);

    // List all documents in the collection
    const allDocs = await db.collection('chat_messages').find({}).toArray();
    console.log('All documents in chat_messages:', allDocs);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

testMongoDB(); 