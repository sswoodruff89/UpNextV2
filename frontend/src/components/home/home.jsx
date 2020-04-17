import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { fetchGenres } from '../../actions/genre_actions';
import Nav from './nav/nav';
import Interests from './interests/interests';
import Recommendations from './recommendations/recommendations';
import {useDispatch} from 'react-redux';

const Home = () => {

  const [mediaType, setMediaType] = useState("Movie");
  const dispatch = useDispatch();

  useEffect(() => {
      console.time("newGenreTime");
      console.log("............................");
    dispatch(fetchGenres()).then(() => {
      console.timeEnd("newGenreTime");
      console.log("............................");
     });
  }, [])

  // useEffect(() => {
    
  // }, mediaType);


    return (
      <main className="home-main">
        <Nav />
        <Interests mediaType={mediaType} />
        <Recommendations mediaType={mediaType} type="similar" />
        <Recommendations mediaType={mediaType} type="all" />
      </main>
    );
}
// class Home extends React.Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       mediaType: "movie"
//     }
//   }
//   componentDidMount() {
//     console.time("genreTime");
//     console.log("............................");
//     this.props.fetchGenres().then(() => {
//       console.timeEnd("genreTime");
//       console.log("............................");

//     });
//   }

//   render() {
//     return(
//       <main className='home-main'>
//         <Nav />
//         <Interests />
//         <Recommendations type="similar"/>
//         <Recommendations type="all"/>
//       </main>
//     )
//   }
// }

const mdp = dispatch => ({
  fetchGenres: () => dispatch(fetchGenres())
});

export default connect(null, mdp)(Home);