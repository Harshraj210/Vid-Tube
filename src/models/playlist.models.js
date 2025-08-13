import mongoose, { Schema, SchemaType } from "mongoose";
const PlaylistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
// this creates the user model in database if it not exist which will import schema from --> fro userSchmea
export const Playlist = mongoose.model("Playlist", Playlistchema);
