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
import express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service.js";
// Global Config
export const router = express.Router();
router.use(express.json());
// GET
router.get("/tasks", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const task = (yield ((_a = collections.tasks) === null || _a === void 0 ? void 0 : _a.find({}).toArray()));
        res.status(200).send(task);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { _id: new ObjectId(id) };
        const task = (yield ((_b = collections.tasks) === null || _b === void 0 ? void 0 : _b.findOne(query)));
        if (task) {
            res.status(200).send(task);
        }
    }
    catch (error) {
        res
            .status(404)
            .send(`Unable to find matching document with id: ${req.params.id}`);
    }
}));
// POST
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newGame = req.body;
        const result = yield ((_a = collections.tasks) === null || _a === void 0 ? void 0 : _a.insertOne(newGame));
        result
            ? res
                .status(201)
                .send(`Successfully created a new game with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new game.");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(400).send(error.message);
        }
    }
}));
// PUT
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const updatedGame = req.body;
        const query = { _id: new ObjectId(id) };
        const result = yield ((_b = collections.tasks) === null || _b === void 0 ? void 0 : _b.updateOne(query, {
            $set: updatedGame,
        }));
        result
            ? res.status(200).send(`Successfully updated game with id ${id}`)
            : res.status(304).send(`Game with id: ${id} not updated`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    }
}));
// DELETE
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { _id: new ObjectId(id) };
        const result = yield ((_b = collections.tasks) === null || _b === void 0 ? void 0 : _b.deleteOne(query));
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed game with id ${id}`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove game with id ${id}`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Game with id ${id} does not exist`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    }
}));
