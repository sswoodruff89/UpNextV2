const express = require("express");
const router = express.Router();
const passport = require("passport");
const Interest = require("../../models/Interest");
const MovieInterest = require("../../models/MovieInterest");
const TVInterest = require("../../models/TVInterest");

router.get("/:type", passport.authenticate('jwt', { session: false }), (req, res) => {

  if (req.params.type === "movie") {
    MovieInterest.find({ user: req.user.id })
      .then(interests => res.json(interests))
      .catch(err => console.log(err));
  } else {
    TVInterest.find({ user: req.user.id })
      .then(interests => res.json(interests))
      .catch(err => console.log(err));
  }
});

router.post("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    // user id: req.user.id
    if (req.body.type === "movie") {
      MovieInterest.findOne({ user: req.user.id, mediaId: req.body.id })
        .then(interest => {
          if (interest) {
            return res.status(400).json({ title: "You have already added this movie"}); 
          } else {
            const newInterest = new MovieInterest({
              user: req.user.id,
              mediaId: req.body.id,
              movieId: req.body.id,
              title: req.body.title,
              year: req.body.release_date,
              genres: req.body.genres,
              type: req.body.type,
              poster: req.body.poster_path,
              overview: req.body.overview,
              runtime: req.body.runtime,
              voteAverage: req.body.vote_average,
              voteCount: req.body.vote_count
            });
            
            Promise.all([newInterest]).then((values) => {
              const returnedInterest = values[0];
              const newGen = returnedInterest.genres.map(genre => {
                return genre.name;
              });
              returnedInterest.genres = newGen;
      
              returnedInterest.save()
                .then(interest => res.json(interest))
                .catch(err => console.log(err));
            });
          }     
      });
    } else {
      TVInterest.findOne({ user: req.user.id, mediaId: req.body.id })
        .then(interest => {
          if (interest) {
            return res.status(400).json({ title: "You have already added this tv show" });
          } else {
            const newInterest = new TVInterest({
              user: req.user.id,
              mediaId: req.body.id,
              tvId: req.body.id,
              title: req.body.name,
              year: req.body.first_air_date,
              genres: req.body.genres,
              type: req.body.type,
              poster: req.body.poster_path,
              overview: req.body.overview,
              seasons: req.body.number_of_seasons,
              voteAverage: req.body.vote_average,
              voteCount: req.body.vote_count
            });

            Promise.all([newInterest]).then((values) => {
              const returnedInterest = values[0];
              const newGen = returnedInterest.genres.map(genre => {
                return genre.name;
              });
              returnedInterest.genres = newGen;

              returnedInterest.save()
                .then(interest => res.json(interest))
                .catch(err => console.log(err));
            });
          }
        });
    }
  }
);

router.delete(`/:interestId`, passport.authenticate('jwt', {session: false}), (req, res) => {
  let currInterestId;
  if (req.body.type === "movie") {
    MovieInterest.findOne({ _id: req.params.interestId })
      .then(interest => {
        currInterestId = interest.mediaId;
      })
      .then(interest => {
        MovieInterest.findOneAndDelete({ _id: req.params.interestId })
          .then(() => {
            return res.json({ id: currInterestId, mediaType: 'movie' });
          })
          .catch(err => console.log(err));
      });

  } else {
    TVInterest.findOne({ _id: req.params.interestId })
      .then(interest => {
        currInterestId = interest.mediaId;
      })
      .then(interest => {
        TVInterest.findOneAndDelete({ _id: req.params.interestId })
          .then(() => {
            return res.json({ id: currInterestId, mediaType: "tv" });
          })
          .catch(err => console.log(err));
      });
  }
});

// router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
//   Interest.find({ user: req.user.id })
//     .then(interests => res.json(interests))
//     .catch(err => console.log(err));
// });

// router.post("/", passport.authenticate('jwt', { session: false }), (req, res) => {
//     // user id: req.user.id
//     Interest.findOne({ user: req.user.id, movieId: req.body.id })
//       .then(interest => {
//         if (interest) {
//           return res.status(400).json({ title: "You have already added this movie"}); 
//         } else {
//           const newInterest = new Interest({
//             user: req.user.id,
//             mediaId: req.body.id,
//             movieId: req.body.id,
//             title: req.body.title,
//             year: req.body.release_date,
//             genres: req.body.genres,
//             type: req.body.type,
//             poster: req.body.poster_path,
//             overview: req.body.overview,
//             runtime: req.body.runtime,
//             voteAverage: req.body.vote_average,
//             voteCount: req.body.vote_count
//           });
          
//           Promise.all([newInterest]).then((values) => {
//             const returnedInterest = values[0];
//             const newGen = returnedInterest.genres.map(genre => {
//               return genre.name;
//             });
//             returnedInterest.genres = newGen;
    
//             returnedInterest.save()
//               .then(interest => res.json(interest))
//               .catch(err => console.log(err));
//           });
//         }     
//     });
//   }
// );

// router.delete(`/:interestId`, passport.authenticate('jwt', {session: false}), (req, res) => {
//   let currInterestId;

//   Interest.findOne({ _id: req.params.interestId })
//     .then(interest => {
//       currInterestId = interest.movieId;
//     })
//     .then(interest => {
//       Interest.findOneAndDelete({ _id: req.params.interestId })
//         .then(() => {
//           return res.json({ id: currInterestId });
//         })
//         .catch(err => console.log(err));
//     });
// });


module.exports = router;