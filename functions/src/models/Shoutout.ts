import { ObjectId } from "mongodb";

export default interface Shoutout {
  _id?: ObjectId;
  to: string;
  from: string;
  text: string;
  photoURL?: string; // profile image of sender
  shoutoutImg?: string; // file upload
}
