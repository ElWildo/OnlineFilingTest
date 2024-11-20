var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();
const client = new MongoClient(process.env.MONGO_URI);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const db = yield client.db("todoList");
        db.createCollection("taks");
        yield client.close();
    }
    catch (e) {
        if (e instanceof Error) {
            console.log("Error: ", e.message);
        }
    }
}))();
export { client };
