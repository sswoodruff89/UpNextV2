
    //   TMDBAPIUtil.getAllRecommendations(mixLikeArr)
    //     .then(response => {
    //       const promisesA = [];
    //       for (let i=0; i < Math.min(response.data.results.length,promiseAExpected); i++) {
    //         let recommendation = response.data.results[i];
    //         let recId = recommendation.id;
    //         promisesA.push(TMDBAPIUtil.getMovieInfo(recId)
    //           .then(movie => {
    //             if (!this.props.interests[movie.data.id] && TMDBAPIUtil.hasValidMovieFields(movie.data)) {
    //               recommendation.genres = movie.data.genres;
    //               recommendation.runtime = movie.data.runtime;
    //               recommendations.push(recommendation);
    //             }
    //           })
    //         );
    //       }

    //       Promise.all(promisesA)
    //         .then(() => {
    //           if (!this.loadingTimeout) {
    //             this.loadingTimeout = setTimeout(() => {
    //               this.props.endLoadingAll();
    //             }, 700);
    //           } else {
    //             clearTimeout(this.loadingTimeout);
    //             this.loadingTimeout = setTimeout(() => {
    //               this.props.endLoadingAll();
    //             }, 700);
    //           }

    //           if ( checkSuperLikeArr.length >= 2 ) {
    //             mixLikeArr = checkSuperLikeArr;
    //           // } else if (checkLikeArr.length >= 1 && checkSuperLikeArr.length >= 1) {
    //           //   let randSuperLikeIndex = Math.floor(Math.random() * (checkSuperLikeArr.length-1));
    //           //   let randLikeIndex = Math.floor(Math.random() * (checkLikeArr.length-1));
    //           //   mixLikeArr = [].push(checkSuperLikeArr[randSuperLikeIndex],checkLikeArr[randLikeIndex]);
    //           } else {
    //             mixLikeArr = [];
    //           }
    //           // Pull out random 2 liked-tier genres, joined by OR
    //           TMDBAPIUtil.getAllRecommendations(mixLikeArr, 2, "%2C")
    //             .then(response => {
    //               const promisesB = [];

    //               if (recommendations.length < promiseAExpected) promiseBExpected = promiseBExpected + (promiseAExpected - recommendations.length);
    //               promiseBExpected = Math.min(20, promiseBExpected);
    //               for (let i=0; i < Math.min(response.data.results.length,promiseBExpected); i++) {
    //                 let recommendation = response.data.results[i];
    //                 let recId = recommendation.id;
    //                 if (!movieIdTrack.has(recId)) {
    //                   promisesB.push(TMDBAPIUtil.getMovieInfo(recId)
    //                     .then(movie => {
    //                       if (!this.props.interests[movie.data.id] && TMDBAPIUtil.hasValidMovieFields(movie.data)) {
    //                         recommendation.genres = movie.data.genres;
    //                         recommendation.runtime = movie.data.runtime;
    //                         recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
    //                         recommendations.push(recommendation);
    //                       }
    //                     })
    //                   );
    //                 }
    //               }
    //               Promise.all(promisesB)
    //                 .then(() => {
    //                   if (!this.loadingTimeout) {
    //                     this.loadingTimeout = setTimeout(() => {
    //                       this.props.endLoadingAll();
    //                     }, 700);
    //                   } else {
    //                     clearTimeout(this.loadingTimeout);
    //                     this.loadingTimeout = setTimeout(() => {
    //                       this.props.endLoadingAll();
    //                     }, 700);
    //                   }

    //                   if (checkLikeArr.length >= 1 && checkSuperLikeArr.length >= 1) {
    //                     let randSuperLikeIndex = Math.floor(Math.random() * (checkSuperLikeArr.length-1));
    //                     let randLikeIndex = Math.floor(Math.random() * (checkLikeArr.length-1));
    //                     mixLikeArr = [];
    //                     mixLikeArr.push(checkSuperLikeArr[randSuperLikeIndex],checkLikeArr[randLikeIndex]);
    //                   } else {
    //                     mixLikeArr = [];
    //                   }
    //                   // Pull out random 2 liked-tier genres, joined by OR
    //                   TMDBAPIUtil.getAllRecommendations(mixLikeArr, 2, "%2C")
    //                     .then(response => {
    //                       const promisesC = [];

    //                       if (recommendations.length < promiseBExpected) promiseCExpected = promiseCExpected + (promiseBExpected - recommendations.length);
    //                       promiseCExpected = Math.min(20, promiseCExpected);
    //                       for (let i=0; i < Math.min(response.data.results.length,promiseCExpected); i++) {
    //                         let recommendation = response.data.results[i];
    //                         let recId = recommendation.id;
    //                         if (!movieIdTrack.has(recId)) {
    //                           promisesC.push(TMDBAPIUtil.getMovieInfo(recId)
    //                             .then(movie => {
    //                               if (!this.props.interests[movie.data.id] && TMDBAPIUtil.hasValidMovieFields(movie.data)) {
    //                                 recommendation.genres = movie.data.genres;
    //                                 recommendation.runtime = movie.data.runtime;
    //                                 recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
    //                                 recommendations.push(recommendation);
    //                               }
    //                             })
    //                           );
    //                         }
    //                       }

    //                       Promise.all(promisesC)
    //                         .then(() => {
    //                           // check if there are at least two like-tier genres
    //                           if (checkLikeArr.length >= 2) {
    //                             mixLikeArr = checkLikeArr;
    //                           } else {
    //                             mixLikeArr = [];
    //                           }
    //                           // Pull out random 2 liked-tier genres, joined by AND
    //                           TMDBAPIUtil.getAllRecommendations(mixLikeArr, 2, "%2C")
    //                             .then(response => {
    //                               const promisesD = [];

    //                               if (recommendations.length < promiseCExpected) promiseDExpected = promiseDExpected + (promiseCExpected - recommendations.length);
    //                               promiseDExpected = Math.min(20, promiseDExpected);
    //                               for (let i=0; i < Math.min(response.data.results.length,promiseDExpected); i++) {
    //                                 let recommendation = response.data.results[i];
    //                                 let recId = recommendation.id;
    //                                 if (!movieIdTrack.has(recId)) {
    //                                   promisesD.push(TMDBAPIUtil.getMovieInfo(recId)
    //                                     .then(movie => {
    //                                       if (!this.props.interests[movie.data.id] && TMDBAPIUtil.hasValidMovieFields(movie.data)) {
    //                                         recommendation.genres = movie.data.genres;
    //                                         recommendation.runtime = movie.data.runtime;
    //                                         recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
    //                                         recommendations.push(recommendation);
    //                                       }
    //                                     })
    //                                   );
    //                                 }
    //                               }

    //                               Promise.all(promisesD)
    //                                 .then(() => {
    //                                   // check if there are at least two like-tier genres
    //                                     mixLikeArr = checkLikeArr.concat(checkSuperLikeArr);
    //                                   // Pull out random 2 liked-tier genres, joined by AND
    //                                   let remainder = Math.max(0,totalExpected - recommendations.length);
    //                                   remainder = Math.min(20,remainder);
    //                                   TMDBAPIUtil.getAllRecommendations(mixLikeArr, mixLikeArr.length, "%7C")
    //                                     .then(response => {
    //                                       const promisesE = [];

    //                                       for (let i=0; i < Math.min(response.data.results.length,remainder); i++) {
    //                                         let recommendation = response.data.results[i];
    //                                         let recId = recommendation.id;
    //                                         if (!movieIdTrack.has(recId)) {
    //                                           promisesE.push(TMDBAPIUtil.getMovieInfo(recId)
    //                                             .then(movie => {
    //                                               if (!this.props.interests[movie.data.id] && TMDBAPIUtil.hasValidMovieFields(movie.data)) {
    //                                                 recommendation.genres = movie.data.genres;
    //                                                 recommendation.runtime = movie.data.runtime;
    //                                                 recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
    //                                                 recommendations.push(recommendation);
    //                                               }
    //                                             })
    //                                           );
    //                                         }
    //                                       }

    //                                       Promise.all(promisesE)
    //                                         .then(() => {
    //                                           if (!this.loadingTimeout) {
    //                                             this.loadingTimeout = setTimeout(() => {
    //                                               this.props.endLoadingAll();
    //                                             }, 700);
    //                                           } else {
    //                                             clearTimeout(this.loadingTimeout);
    //                                             this.loadingTimeout = setTimeout(() => {
    //                                               this.props.endLoadingAll();
    //                                             }, 700);
    //                                           }
    //                                           this.props.createAllRecommendations(recommendations);
    //                                         });
    //                                     });
    //                                 });
    //                             });
    //                         });
    //                     });
    //                 });
    //             });
    //         });
    //     });
    // }

if (!isEmpty(this.props.genres) && !isEmpty(this.props.interests)) {
    // filter genre slice of state to get superlike genre array
    // call getAllRecommendations'
    debugger
    let mixLikeArr = [];
    // Only set superLikeArr if we have at least 3 superLiked-tier genres
    // let checkSuperLikeArr = Object.values(this.props.genres).filter(ele => ele.tier === "superLike").map(el => el.id);
    // let checkLikeArr = Object.values(this.props.genres).filter(ele => ele.tier === "like").map(el => el.id);
    let checkSuperLikeArr = [];
    let checkLikeArr = [];
    Object.values(this.props.genres).forEach(genre => (
        (genre[this.props.mediaType] === "superlike") ? checkSuperLikeArr.push(genre.id) :
            (genre[this.props.mediaType] === "like") ? checkLikeArr.push(genre.id) : ""
    ));
    if (checkSuperLikeArr.length >= 3) mixLikeArr = checkSuperLikeArr;

    this.props.startLoadingAll();


    let recommendations = [];
    let mediaIdTrack = new Set();
    let totalExpected = 50;
    let promiseAExpected = 15;
    let promiseBExpected = 15;
    let promiseCExpected = 10;
    let promiseDExpected = 10;
    // Pull out random 3 superLiked-tier genres, joined by AND
    debugger
    console.time("allRec");
    console.log(".................................");


    const type = (this.props.mediaType === "movie") ? "Movie" : "TV"
    TMDBAPIUtil.getAllRecommendations(mixLikeArr)
        .then(response => {
            const promisesA = [];
            debugger

            for (let i = 0; i < Math.min(response.data.results.length, promiseAExpected); i++) {
                let recommendation = response.data.results[i];
                let recId = recommendation.id;
                promisesA.push(TMDBAPIUtil.getMediaInfo(recId, this.props.mediaType)
                    .then(media => {
                        debugger
                        if (!this.props.interests[media.data.id] && TMDBAPIUtil[`hasValid${type}Fields`](media.data)) {
                            recommendation.genres = media.data.genres;
                            recommendation.runtime = media.data.runtime;
                            recommendation.type = this.props.mediaType;
                            recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
                            if (type === "Movie") {
                                recommendation.runtime = media.data.runtime;
                            } else {
                                recommendation.seasons = media.data.seasons;
                            }
                            recommendations.push(recommendation);
                        }
                    })
                );
            }

            Promise.all(promisesA)
                .then(() => {
                    if (!this.loadingTimeout) {
                        this.loadingTimeout = setTimeout(() => {
                            this.props.endLoadingAll();
                        }, 700);
                    } else {
                        clearTimeout(this.loadingTimeout);
                        this.loadingTimeout = setTimeout(() => {
                            this.props.endLoadingAll();
                        }, 700);
                    }

                    if (checkSuperLikeArr.length >= 2) {
                        mixLikeArr = checkSuperLikeArr;
                        // } else if (checkLikeArr.length >= 1 && checkSuperLikeArr.length >= 1) {
                        //   let randSuperLikeIndex = Math.floor(Math.random() * (checkSuperLikeArr.length-1));
                        //   let randLikeIndex = Math.floor(Math.random() * (checkLikeArr.length-1));
                        //   mixLikeArr = [].push(checkSuperLikeArr[randSuperLikeIndex],checkLikeArr[randLikeIndex]);
                    } else {
                        mixLikeArr = [];
                    }
                    // Pull out random 2 liked-tier genres, joined by OR
                    TMDBAPIUtil.getAllRecommendations(mixLikeArr, 2, "%2C")
                        .then(response => {
                            const promisesB = [];

                            if (recommendations.length < promiseAExpected) promiseBExpected = promiseBExpected + (promiseAExpected - recommendations.length);
                            promiseBExpected = Math.min(20, promiseBExpected);
                            for (let i = 0; i < Math.min(response.data.results.length, promiseBExpected); i++) {
                                let recommendation = response.data.results[i];
                                let recId = recommendation.id;
                                if (!mediaIdTrack.has(recId)) {
                                    promisesB.push(TMDBAPIUtil.getMediaInfo(recId, this.props.mediaType)
                                        .then(media => {
                                            if (!this.props.interests[media.data.id] && TMDBAPIUtil[`hasValid${type}Fields`](media.data)) {
                                                recommendation.genres = media.data.genres;
                                                recommendation.runtime = media.data.runtime;
                                                recommendation.type = this.props.mediaType;
                                                recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
                                                if (type === "Movie") {
                                                    recommendation.runtime = media.data.runtime;
                                                } else {
                                                    recommendation.seasons = media.data.seasons;
                                                }
                                                recommendations.push(recommendation);
                                            }
                                        })
                                    );
                                }
                            }
                            Promise.all(promisesB)
                                .then(() => {
                                    if (!this.loadingTimeout) {
                                        this.loadingTimeout = setTimeout(() => {
                                            this.props.endLoadingAll();
                                        }, 700);
                                    } else {
                                        clearTimeout(this.loadingTimeout);
                                        this.loadingTimeout = setTimeout(() => {
                                            this.props.endLoadingAll();
                                        }, 700);
                                    }

                                    if (checkLikeArr.length >= 1 && checkSuperLikeArr.length >= 1) {
                                        let randSuperLikeIndex = Math.floor(Math.random() * (checkSuperLikeArr.length - 1));
                                        let randLikeIndex = Math.floor(Math.random() * (checkLikeArr.length - 1));
                                        mixLikeArr = [];
                                        mixLikeArr.push(checkSuperLikeArr[randSuperLikeIndex], checkLikeArr[randLikeIndex]);
                                    } else {
                                        mixLikeArr = [];
                                    }
                                    // Pull out random 2 liked-tier genres, joined by OR
                                    TMDBAPIUtil.getAllRecommendations(mixLikeArr, 2, "%2C")
                                        .then(response => {
                                            const promisesC = [];

                                            if (recommendations.length < promiseBExpected) promiseCExpected = promiseCExpected + (promiseBExpected - recommendations.length);
                                            promiseCExpected = Math.min(20, promiseCExpected);
                                            for (let i = 0; i < Math.min(response.data.results.length, promiseCExpected); i++) {
                                                let recommendation = response.data.results[i];
                                                let recId = recommendation.id;
                                                if (!mediaIdTrack.has(recId)) {
                                                    promisesC.push(TMDBAPIUtil.getMediaInfo(recId, this.props.mediaType)
                                                        .then(media => {
                                                            if (!this.props.interests[media.data.id] && TMDBAPIUtil[`hasValid${type}Fields`](media.data)) {
                                                                recommendation.genres = media.data.genres;
                                                                recommendation.runtime = media.data.runtime;
                                                                recommendation.type = this.props.mediaType;
                                                                recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
                                                                if (type === "Movie") {
                                                                    recommendation.runtime = media.data.runtime;
                                                                } else {
                                                                    recommendation.seasons = media.data.seasons;
                                                                }
                                                                recommendations.push(recommendation);
                                                            }
                                                        })
                                                    );
                                                }
                                            }

                                            Promise.all(promisesC)
                                                .then(() => {
                                                    // check if there are at least two like-tier genres
                                                    if (checkLikeArr.length >= 2) {
                                                        mixLikeArr = checkLikeArr;
                                                    } else {
                                                        mixLikeArr = [];
                                                    }
                                                    // Pull out random 2 liked-tier genres, joined by AND
                                                    TMDBAPIUtil.getAllRecommendations(mixLikeArr, 2, "%2C")
                                                        .then(response => {
                                                            const promisesD = [];

                                                            if (recommendations.length < promiseCExpected) promiseDExpected = promiseDExpected + (promiseCExpected - recommendations.length);
                                                            promiseDExpected = Math.min(20, promiseDExpected);
                                                            for (let i = 0; i < Math.min(response.data.results.length, promiseDExpected); i++) {
                                                                let recommendation = response.data.results[i];
                                                                let recId = recommendation.id;
                                                                if (!mediaIdTrack.has(recId)) {
                                                                    promisesD.push(TMDBAPIUtil.getMediaInfo(recId, this.props.mediaType)
                                                                        .then(media => {
                                                                            if (!this.props.interests[media.data.id] && TMDBAPIUtil[`hasValid${type}Fields`](media.data)) {
                                                                                recommendation.genres = media.data.genres;
                                                                                recommendation.runtime = media.data.runtime;
                                                                                recommendation.type = this.props.mediaType;
                                                                                recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
                                                                                if (type === "Movie") {
                                                                                    recommendation.runtime = media.data.runtime;
                                                                                } else {
                                                                                    recommendation.seasons = media.data.seasons;
                                                                                }
                                                                                recommendations.push(recommendation);
                                                                            }
                                                                        })
                                                                    );
                                                                }
                                                            }

                                                            Promise.all(promisesD)
                                                                .then(() => {
                                                                    // check if there are at least two like-tier genres
                                                                    mixLikeArr = checkLikeArr.concat(checkSuperLikeArr);
                                                                    // Pull out random 2 liked-tier genres, joined by AND
                                                                    let remainder = Math.max(0, totalExpected - recommendations.length);
                                                                    remainder = Math.min(20, remainder);
                                                                    TMDBAPIUtil.getAllRecommendations(mixLikeArr, mixLikeArr.length, "%7C")
                                                                        .then(response => {
                                                                            const promisesE = [];

                                                                            for (let i = 0; i < Math.min(response.data.results.length, remainder); i++) {
                                                                                let recommendation = response.data.results[i];
                                                                                let recId = recommendation.id;
                                                                                if (!mediaIdTrack.has(recId)) {
                                                                                    promisesE.push(TMDBAPIUtil.getMediaInfo(recId, this.props.mediaType)
                                                                                        .then(media => {
                                                                                            if (!this.props.interests[media.data.id] && TMDBAPIUtil[`hasValid${type}Fields`](media.data)) {
                                                                                                recommendation.genres = media.data.genres;
                                                                                                recommendation.runtime = media.data.runtime;
                                                                                                recommendation.type = this.props.mediaType;
                                                                                                recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
                                                                                                if (type === "Movie") {
                                                                                                    recommendation.runtime = media.data.runtime;
                                                                                                } else {
                                                                                                    recommendation.seasons = media.data.seasons;
                                                                                                }
                                                                                                recommendations.push(recommendation);
                                                                                            }
                                                                                        })
                                                                                    );
                                                                                }
                                                                            }

                                                                            Promise.all(promisesE)
                                                                                .then(() => {
                                                                                    if (!this.loadingTimeout) {
                                                                                        this.loadingTimeout = setTimeout(() => {
                                                                                            this.props.endLoadingAll();
                                                                                        }, 700);
                                                                                    } else {
                                                                                        clearTimeout(this.loadingTimeout);
                                                                                        this.loadingTimeout = setTimeout(() => {
                                                                                            this.props.endLoadingAll();
                                                                                        }, 700);
                                                                                    }
                                                                                    this.props.createAllRecommendations(recommendations);
                                                                                });
                                                                        });
                                                                });
                                                        });
                                                });
                                        });
                                });
                        });
                });
        });
}

if (isEmpty(this.props.interests)) {
    if (!this.loadingTimeout) {
        this.loadingTimeout = setTimeout(() => {
            this.props.endLoadingAll();
        }, 700);
    } else {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = setTimeout(() => {
            this.props.endLoadingAll();
        }, 700);
    }
    this.props.deleteAllRecommendations();
}
  }