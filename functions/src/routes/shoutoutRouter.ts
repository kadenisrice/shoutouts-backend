import express from "express";
import { getClient } from "../db";
import Shoutout from "../models/Shoutout";
import { ObjectId } from "mongodb";

// importing router from express
const shoutoutRouter = express.Router();

// creating initial error response message:
const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

// END POINTS BELOW ---------------------------------------------------------------------------

// Get all shoutouts: (can add query string parameters here)
shoutoutRouter.get("/shoutouts", async (req, res) => {
  const { name } = req.query;
  const query: any = {};

  if (name) {
    query.to = name;
  }

  try {
    const client = await getClient();

    // mongo command to get all shoutouts:
    const getsAllShoutouts = client
      .db()
      .collection<Shoutout>("shoutouts")
      .find(query);

    // displays all shoutouts:
    const results = await getsAllShoutouts.toArray();
    res.status(200).json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

// Get shoutout by ID:
shoutoutRouter.get("/shoutouts/:id", async (req, res) => {
  try {
    const _id: ObjectId = new ObjectId(req.params.id);
    const client = await getClient();

    // mongo command to get shoutout:
    const getOneShoutout = await client
      .db()
      .collection<Shoutout>("shoutouts")
      .findOne({ _id });

    // err message
    if (getOneShoutout) {
      res.status(200).json(getOneShoutout);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// Make a new shoutout:
shoutoutRouter.post("/shoutouts", async (req, res) => {
  try {
    const shoutout: Shoutout = req.body;

    const client = await getClient();

    // mongo command to get shoutout:
    const makeNewShoutout = await client
      .db()
      .collection<Shoutout>("shoutouts")
      .insertOne(shoutout);
    res.status(201).json(makeNewShoutout);
  } catch (err) {
    errorResponse(err, res);
  }
});

// Delete Shoutout by ID:
shoutoutRouter.delete("/shoutouts/:id", async (req, res) => {
  try {
    const _id: ObjectId = new ObjectId(req.params.id);
    const client = await getClient();
    const result = await client
      .db()
      .collection<Shoutout>("shoutouts")
      .deleteOne({ _id });
    if (result.deletedCount) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// replace / update Shoutout by ID
shoutoutRouter.put("/shoutouts/:id", async (req, res) => {
  try {
    const _id: ObjectId = new ObjectId(req.params.id);
    const updatedShoutout: Shoutout = req.body;
    delete updatedShoutout._id; // remove _id from body so we only have one.
    const client = await getClient();

    // mongoCMD:
    const result = await client
      .db()
      .collection<Shoutout>("shoutouts")
      .replaceOne({ _id }, updatedShoutout);

    // Status messsage:
    if (result.modifiedCount) {
      updatedShoutout._id = _id;
      res.status(200).json(updatedShoutout);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// get top five shoutouts:

export default shoutoutRouter;
