const express = require("express");
const router = express.Router();
const passport = require("passport");
const Genre = require("../../models/Genre");

router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
  Genre.find({ user: req.user.id })
    .then(genres => res.json(genres))
    .catch(err => console.log(err));
});

const TIER_THRESHOLD = {
  SUPERLIKE: 0.5,
  LIKE: 0.25
};

// Evaluates the preference tier of a genre depending on weighted threshold values
const tierEvaluator = (currUserId, newGenre, mediaType) => {
  let countPromises;
  if (mediaType === "movie") {
      countPromises = [
        MovieInterest.countDocuments({ user: currUserId }).then((count) => {
          const tierRatio = newGenre.movieCount / count;
          // console.log(newGenre.count);
          // console.log(newGenre.movieCount);
          // console.log(count);

          if (tierRatio >= TIER_THRESHOLD.SUPERLIKE) {
            newGenre.tier = "superLike";
            newGenre.movieTier = "superLike";
          } else if (tierRatio > TIER_THRESHOLD.LIKE) {
            newGenre.tier = "like";
            newGenre.movieTier = "like";
          } else {
            newGenre.tier = "low";
            newGenre.movieTier = "low";
          }
        }),
      ];
  } else {
    countPromises = [
      TVInterest.countDocuments({ user: currUserId }).then(count => {
        const tierRatio = newGenre.tvCount / (count);
          if (tierRatio >= TIER_THRESHOLD.SUPERLIKE) {
            newGenre.tier = "superLike";
            newGenre.tvTier = "superLike";
          } else if (tierRatio > TIER_THRESHOLD.LIKE) {
            newGenre.tier = "like";
            newGenre.tvTier = "like";
          } else {
            newGenre.tier = "low";
            newGenre.tvTier = "low";
          }
      })
    ];

  }

  return Promise.all(countPromises);
};

const tierEvaluator2 = (genreCount, count) => {
  console.log(genreCount);
  console.log(count);
  console.log("--------------")
  const tierRatio = genreCount / count;

  if (tierRatio >= TIER_THRESHOLD.SUPERLIKE) {
    return "superlike";
  } else if (tierRatio > TIER_THRESHOLD.LIKE) {
    return "like";
  } else {
    return "low";
  }
}

router.post("/", passport.authenticate('jwt', { session: false }), (req, res) => {
  Genre.findOne({ user: req.user.id, name: req.body.genre.name })
    .then(genre => {
      if (genre) {
        return res.status(400).json({ title: "You have already added this genre" });
      } else {

        const tvCount = (req.body.mediaType === 'tv') ? 1 : 0;
        const movieCount = (req.body.mediaType === 'movie') ? 1 : 0;

        const newGenre = new Genre({
          user: req.user.id,
          name: req.body.genre.name,
          id: req.body.genre.id,
          count: 1,
          movieCount,
          tvCount
        });
        tierEvaluator(req.user.id, newGenre, req.body.mediaType);
        setTimeout(() => {newGenre.save()
          .then(genre => res.json(genre))
          .catch(err => console.log(err));
        },30);
      }
    });
  }
);

router.patch("/:genreId", passport.authenticate('jwt', { session: false }), (req, res) => {
  Genre.findOne({ user: req.user.id, _id: req.params.genreId })
    .then(genre => {
      if (!genre) {
        return res.status(400).json({ title: "No genre found" });
      } else {
        
        const {value, interestCount, mediaType} = req.body;
        genre.count += value;
        (mediaType === "movie") ? genre.movieCount += value : genre.tvCount += value;
        
      Promise.all([tierEvaluator(req.user.id, genre, mediaType)]).then(() => {
        genre.save()
          .then(genre => res.json(genre))
          .catch(err => console.log(err));
      });
      }
    });
  }
);


router.patch("/", passport.authenticate('jwt', { session: false }), (req, res) => {

  if (req.body.data.mediaType === "movie") {
    Genre.find({ user: req.user.id })
    .then(genres => {
        MovieInterest.countDocuments({ user: req.user.id })
          .then(count => {
                genres.forEach(genre => {
                  Genre.update({ _id: genre._id }, [{ $set: { tier: tierEvaluator2(genre.count, count), movieTier: tierEvaluator2(genre.movieCount, count) } }])
                    .catch(err => console.error(`Failed to update ${genre.name}`));
                })
          })
            .then(() => {
              Genre.find({user: req.user.id})
                .then(genres => {
                  return res.json(genres);
                })
            })
          .catch(err => console.error(`Failed to update genres`));
        });
  
  } else {
    Genre.find({ user: req.user.id })
      .then(genres => {
        TVInterest.countDocuments({ user: req.user.id })
          .then(count => {
            genres.forEach(genre => {
              Genre.update({ _id: genre._id }, [{ $set: { tier: tierEvaluator2(genre.count, count), tvTier: tierEvaluator2(genre.movieCount, count) } }])
                .catch(err => console.error(`Failed to update ${genre.name}`));
            })
          })
          .then(() => {
            Genre.find({ user: req.user.id })
              .then(genres => {
                return res.json(genres);
              })
          })
          .catch(err => console.error(`Failed to update genres`));
      });
    }
  }

);

// router.patch("/", passport.authenticate('jwt', { session: false }), (req, res) => {
//   Genre.findOne({ user: req.user.id, _id: { $in: req.body.genreIds} })
//     .then(genres => {
//       if (!genres.length) {
//         return res.status(400).json({ title: "No genres found" });
//       } else {
//         genres.forEach(genre => {
//           const {value, mediaType} = req.body.data;
//           genre.count += value;
//           (mediaType === "movie") ? genre.movieCount += value : genre.tvCount += value;
          
//           Promise.all([tierEvaluator(req.user.id, genre, mediaType)]).then(() => {
//             genre.save()

//           }).then(genres => res.json(genres))
//             .catch(err => console.log(err));

//         })
//       }
//     });
//   }
// );

module.exports = router;