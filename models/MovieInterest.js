const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieInterestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  mediaId: {
    type: Number,
    required: true,
  },
  movieId: {
    type: Number,
    // required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  overview: {
    type: String,
    required: true,
  },
  runtime: {
    type: Number,
    required: true,
  },
  voteAverage: {
    type: Number,
    required: true,
  },
  voteCount: {
    type: Number,
    required: true,
  },
  genres: {
    type: Array,
    required: true,
  },
});

module.exports = MovieInterest = mongoose.model("MovieInterest", MovieInterestSchema);
