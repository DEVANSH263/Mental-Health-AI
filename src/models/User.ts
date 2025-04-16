import { ObjectId } from 'mongodb';
import { getDatabase } from '../utils/mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  lastLogin: Date;
  profile: {
    age?: number;
    gender?: string;
    bio?: string;
    interests?: string[];
    goals?: string[];
    emergencyContact?: {
      name: string;
      phone: string;
    };
  };
}

export async function createUser(userData: Omit<User, '_id'>): Promise<User> {
  const db = await getDatabase();
  const result = await db.collection<User>('users').insertOne({
    ...userData,
    createdAt: new Date(),
    lastLogin: new Date(),
  });
  return { ...userData, _id: result.insertedId };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase();
  return db.collection<User>('users').findOne({ email });
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
): Promise<User | null> {
  const db = await getDatabase();
  const result = await db
    .collection<User>('users')
    .findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { ...updates, lastLogin: new Date() } },
      { returnDocument: 'after' }
    );
  return result ?? null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const db = await getDatabase();
  return db.collection<User>('users').findOne({ _id: new ObjectId(userId) });
} 