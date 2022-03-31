const express = require("express");
const router = express.Router();
const Track = require("../models/Track");
const QUERY_LIMIT = 50;

// Get all tracks
router.get("/getAll", async (req, res) => {
  const tracks = await Track.find();
  res.send(tracks);
});

// Get all tracks with artist name containing string
router.get("/getTracksByQuery/:q", async (req, res) => {
  // Searching artists by query term and matching (not case sensitive)
  const tracks = await Track.find({
    artist: new RegExp(req.params.q, "i"),
  }).limit(QUERY_LIMIT);
  res.send(tracks);
});

router.get("/getTopList/:n", async (req, res) => {
  const tracks = await Track.find({
    tracks_size: { $gt: 40 },
  })
    .sort([["playCountPercent", -1]])
    .limit(Math.min(req.params.n, 50));
  res.send(tracks);
});

// Get by ID
router.get("/getTrack/:id", async (req, res) => {
  const track = await Track.findOne({ _id: req.params.id });
  res.send(track);
});

// Get by Artist Name Method
router.get("/getTrackByArtist/:artistName", async (req, res) => {
  const track = await Track.findOne({ artist: req.params.artistName });
  res.send(track);
});

// Get by Track Name Method
router.get("/getTrackByName/:trackName", async (req, res) => {
  const track = await Track.findOne({ name: req.params.trackName });
  res.send(track);
});

// Get data for graph (aggregation of data into 0.05 sized buckets)
router.get("/getGraphData/", async (req, res) => {
  const pipeline = [
    {
      $match: {
        tracks_size: {
          $gt: 25,
        },
      },
    },
    {
      $addFields: {
        playCountPercent: {
          $cond: {
            if: {
              $in: [
                {
                  $type: "$playCountPercent",
                },
                ["double", "int", "long", "decimal"],
              ],
            },
            then: "$playCountPercent",
            else: null,
          },
        },
      },
    },
    {
      $addFields: {
        __alias_0: {
          $multiply: [
            {
              $floor: {
                $divide: ["$playCountPercent", 0.05],
              },
            },
            0.05,
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          __alias_0: "$__alias_0",
        },
        __alias_1: {
          $sum: {
            $cond: [
              {
                $ne: [
                  {
                    $type: "$playCountPercent",
                  },
                  "missing",
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        __alias_0: "$_id.__alias_0",
        __alias_1: 1,
      },
    },
    {
      $project: {
        x: "$__alias_0",
        y: "$__alias_1",
        _id: 0,
      },
    },
    {
      $sort: {
        x: 1,
      },
    },
  ];
  const aggTracks = await (
    await Track.aggregate(pipeline)
  ).map((group) => ({
    y: group.y,
    x: `${(group.x * 100).toFixed()}-${(5 + group.x * 100).toFixed()}%`,
  }));
  res.send(aggTracks);
});
module.exports = router;
