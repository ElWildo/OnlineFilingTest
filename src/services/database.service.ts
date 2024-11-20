import mongoDB from "mongodb";
import dotenv from "dotenv";

/**
 * Create collections object
 */
export const collections: {
  tasks?: mongoDB.Collection;
  projects?: mongoDB.Collection;
} = {};

/**
 * Initialize connection
 */
export async function connectToDatabase() {
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.MONGO_URI!
  );

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  /**
   * Get or create tasks collection
   */
  const tasksCollection: mongoDB.Collection = db.collection(
    process.env.TASK_COLLECTION_NAME!
  );

  /**
   * Get or create projects collection
   */
  const projectsCollection: mongoDB.Collection = db.collection(
    process.env.PROJECTS_COLLECTION_NAME!
  );

  collections.tasks = tasksCollection;
  collections.projects = projectsCollection;

  console.log(`Successfully connected to database: ${db.databaseName}`);
}
