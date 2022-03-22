const mongoose = require("mongoose");

const schema = mongoose.Schema({
  artist: String,
  name: String,
  playcount: String,
  url: String,
  playCountPercent: Number,
  artist_popularity_index: Number,
  tracks_size: Number,
});

module.exports = mongoose.model("Track", schema);
