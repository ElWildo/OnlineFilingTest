var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
// Global Variables
export const collections = {};
// Initialize Connection
export function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        dotenv.config();
        const client = new mongoDB.MongoClient(process.env.MONGO_URI);
        yield client.connect();
        const db = client.db(process.env.DB_NAME);
        const tasksCollection = db.collection(process.env.TASK_COLLECTION_NAME);
        const projectsCollection = db.collection(process.env.TASK_COLLECTION_NAME);
        collections.tasks = tasksCollection;
        collections.projects = projectsCollection;
        console.log(`Successfully connected to database: ${db.databaseName} and collection: ${tasksCollection.collectionName}`);
    });
}
