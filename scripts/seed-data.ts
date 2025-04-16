import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb://localhost:27017/mental-health-AI';
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db();
    
    // Add test users
    const users = await db.collection('users').insertMany([
      {
        _id: new ObjectId(),
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: 'Jane Smith',
        email: 'jane@example.com',
        createdAt: new Date(),
      }
    ]);

    // Add test journal entries
    await db.collection('journal_entries').insertMany([
      {
        userId: users.insertedIds[0],
        content: "Had a productive day at work. Feeling accomplished!",
        mood: 4,
        tags: ['work', 'productivity'],
        activities: ['working', 'exercise'],
        timestamp: new Date(),
      },
      {
        userId: users.insertedIds[0],
        content: "Feeling a bit stressed about upcoming deadlines.",
        mood: 2,
        tags: ['work', 'stress'],
        activities: ['working'],
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      },
      {
        userId: users.insertedIds[1],
        content: "Great meditation session this morning. Feeling peaceful.",
        mood: 5,
        tags: ['meditation', 'morning'],
        activities: ['meditation', 'breathing'],
        timestamp: new Date(),
      }
    ]);

    // Add test chat messages
    await db.collection('chat_messages').insertMany([
      {
        userId: users.insertedIds[0],
        message: "I'm feeling anxious about my presentation tomorrow",
        response: "It's normal to feel anxious about presentations. Would you like to try some breathing exercises?",
        timestamp: new Date(),
        context: { previousMood: 2, timeOfDay: 'evening' },
        sentiment: -1
      },
      {
        userId: users.insertedIds[0],
        message: "The breathing exercises helped, feeling better now",
        response: "I'm glad the exercises helped! Remember you can use them anytime you feel anxious.",
        timestamp: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes later
        context: { previousMood: 3, timeOfDay: 'evening' },
        sentiment: 1
      },
      {
        userId: users.insertedIds[1],
        message: "Hi, just checking in!",
        response: "Hello! How are you feeling today?",
        timestamp: new Date(),
        context: { previousMood: 4, timeOfDay: 'morning' },
        sentiment: 0
      }
    ]);

    console.log('Database seeded successfully!');
    console.log('Users created:', users.insertedIds);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase(); 