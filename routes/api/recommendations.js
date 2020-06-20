const express = require("express");
const router = express.Router();
const passport = require('passport');
const Recommendation = require('../../models/Recommendation');
const Interest = require('../../models/Interest');
const MovieInterest = require('../../models/MovieInterest')
const TVInterest = require('../../models/TVInterest')

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Recommendation.find({ user: req.user.id })
    .then(recommendations => res.json(recommendations))
    .catch(err => console.log(err));
});
router.get('/similar/:mediaType', passport.authenticate('jwt', { session: false }), (req, res) => {

  
  if (req.params.mediaType === "movie") {

    MovieInterest.find({user: req.user.id}).sort({ "date": -1 }).limit(1).then(interest => {
      if (interest.length === 0) return res.json({});
      Recommendation.find({ similarMediaId: interest[0].mediaId, type: 'movie' })
        .then(recommendations => {
          let newSimilarRecommendations = {};
          let count = 0;
          // convert recommendations array to an object of objects
          // need count so that we only send back the response once everything
            // has been put into the newSimilarRecommendations object
          recommendations.forEach((recommendation, i) => {
            newSimilarRecommendations[i] = recommendation;
            count += 1;
  
            if (count === recommendations.length) {
              
              res.json(newSimilarRecommendations);
            }
          });
        })
        .catch(err => console.log(err));
    });
    
  } else {
      TVInterest.find({user: req.user.id}).sort({ "date": -1 }).limit(1).then(interest => {
        if (interest.length === 0) return res.json({});
        Recommendation.find({ similarMediaId: interest[0].mediaId, type: req.body.mediaType })
          .then(recommendations => {
            let newSimilarRecommendations = {};
            let count = 0;
    
            // convert recommendations array to an object of objects
            // need count so that we only send back the response once everything
              // has been put into the newSimilarRecommendations object
            recommendations.forEach((recommendation, i) => {
              newSimilarRecommendations[i] = recommendation;
              count += 1;
    
              if (count === recommendations.length) {
                
                res.json(newSimilarRecommendations);
              }
            });
          })
          .catch(err => console.log(err));
      });

  }
});
// router.get('/similar', passport.authenticate('jwt', { session: false }), (req, res) => {

//   // Interest.find({user: req.user.id}).sort({ "date": -1 }).limit(1).then(interest => {
//   //   if (interest.length === 0) return res.json({});
//   //   Recommendation.find({ similarMovieId: interest[0].movieId })
//   //     .then(recommendations => {
//   //       let newSimilarRecommendations = {};
//   //       let count = 0;

//   //       // convert recommendations array to an object of objects
//   //       // need count so that we only send back the response once everything
//   //         // has been put into the newSimilarRecommendations object
//   //       recommendations.forEach((recommendation, i) => {
//   //         newSimilarRecommendations[i] = recommendation;
//   //         count += 1;

//   //         if (count === recommendations.length) {
            
//   //           res.json(newSimilarRecommendations);
//   //         }
//   //       });
//   //     })
//   //     .catch(err => console.log(err));
//   // });

//   console.log(req.params);

//   if (req.body.mediaType === "movie") {
//     MovieInterest.find({user: req.user.id}).sort({ "date": -1 }).limit(1).then(interest => {
//       if (interest.length === 0) return res.json({});
//       Recommendation.find({ similarMedia: interest[0].mediaId, type: req.body.mediaType })
//         .then(recommendations => {
//           let newSimilarRecommendations = {};
//           let count = 0;
  
//           // convert recommendations array to an object of objects
//           // need count so that we only send back the response once everything
//             // has been put into the newSimilarRecommendations object
//           recommendations.forEach((recommendation, i) => {
//             newSimilarRecommendations[i] = recommendation;
//             count += 1;
  
//             if (count === recommendations.length) {
              
//               res.json(newSimilarRecommendations);
//             }
//           });
//         })
//         .catch(err => console.log(err));
//     });
    
//   } else {
//       TVInterest.find({user: req.user.id}).sort({ "date": -1 }).limit(1).then(interest => {
//         if (interest.length === 0) return res.json({});
//         Recommendation.find({ similarMedia: interest[0].mediaId, type: req.body.mediaType })
//           .then(recommendations => {
//             let newSimilarRecommendations = {};
//             let count = 0;
    
//             // convert recommendations array to an object of objects
//             // need count so that we only send back the response once everything
//               // has been put into the newSimilarRecommendations object
//             recommendations.forEach((recommendation, i) => {
//               newSimilarRecommendations[i] = recommendation;
//               count += 1;
    
//               if (count === recommendations.length) {
                
//                 res.json(newSimilarRecommendations);
//               }
//             });
//           })
//           .catch(err => console.log(err));
//       });

//   }
// });


router.post('/similar', passport.authenticate('jwt', { session: false }), (req, res) => {
  // if this recommendation has already been made for this similar movie, just return it back
  Recommendation.find({ similarMediaId: req.body.data[0].similarMediaId })
    .then(similarRecommendations => {
      if (similarRecommendations.length !== 0) {
        // return res.status(400).json({ title: "You have already added this movie" });
        return res.json(similarRecommendations);
      // otherwise, make the recommendation for this similar movie, and then return it back
      } else {
        const newSimilarRecommendations = {};
        
        req.body.data.forEach((recommendation, i) => {          
          newSimilarRecommendations[i] = new Recommendation({
            similarMediaId: recommendation.similarMediaId,
            similarMovieId: recommendation.similarMediaId,
            user: req.user.id,
            movieId: recommendation.id,
            mediaId: recommendation.id,
            title: recommendation.title,
            year: recommendation.release_date,
            genres: recommendation.genres,
            type: recommendation.type,
            poster: recommendation.poster_path,
            overview: recommendation.overview,
            runtime: recommendation.runtime,
            voteAverage: recommendation.vote_average,
            voteCount: recommendation.vote_count
          });
        });

        let count = 0;
        Object.values(newSimilarRecommendations).forEach(recommendation => {
          recommendation
            .save()
            .then(() => {
              count += 1;
              if (count === req.body.data.length)
                res.json(newSimilarRecommendations);
            })
            .catch(err => console.log(err));
        });
          
      }
    });
});

router.post('/all', passport.authenticate('jwt', { session: false }), (req, res) => {
  Recommendation.deleteMany({ user: req.user.id, similarMovieId: null }).then(() => {
    const allRecommendations = {};
    req.body.data.forEach((recommendation, i) => {
      allRecommendations[i] = new Recommendation({
        similarMovieId: null,
        user: req.user.id,
        mediaId: recommendation.id,
        movieId: recommendation.id,
        title: recommendation.title,
        year: recommendation.release_date,
        genres: recommendation.genres,
        type: recommendation.type,
        poster: recommendation.poster_path,
        overview: recommendation.overview,
        runtime: recommendation.runtime,
        seasons: recommendation.seasons,
        voteAverage: recommendation.vote_average,
        voteCount: recommendation.vote_count
      });
    });

    let count = 0;
    if (Object.values(allRecommendations).length > 0) {
      Object.values(allRecommendations).forEach(recommendation => {
        recommendation
          .save()
          .then(() => {
            count += 1;
            if (count === req.body.data.length)
              res.json(allRecommendations);
          })
          .catch(err => console.log(err));
      });
    } else {
      res.json(allRecommendations);
    }
    
  });
});

router.get('/all/:mediaType', passport.authenticate('jwt', { session: false }), (req, res) => {
  Recommendation.find({ user: req.user.id, similarMovieId: null, type: req.params.mediaType })
    .then(recommendations => {
      if (recommendations.length === 0) {
        return res.json({});
      }

      let newAllRecommendations = {};
      let count = 0;

      recommendations.forEach((recommendation, i) => {
        newAllRecommendations[i] = recommendation;
        count += 1;

        if (count === recommendations.length) {
          res.json(newAllRecommendations);
        }
      });
    })
    .catch(err => console.log(err));
});

router.delete('/similar', passport.authenticate('jwt', { session: false }), (req, res) => {
  Recommendation.deleteMany({ user: req.user.id, similarMovieId: {$ne: null} }).then(() => {
    res.json({});
  });
});

router.delete('/all', passport.authenticate('jwt', { session: false }), (req, res) => {
  Recommendation.deleteMany({ user: req.user.id, similarMovieId: null }).then(() => {
    res.json({});
  });
});

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id
  });
});

module.exports = router;