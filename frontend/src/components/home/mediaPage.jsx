import React from 'react';
import { connect } from 'react-redux';
import { fetchGenres } from '../../actions/genre_actions';
import Nav from './nav/nav';
import Interests from './interests/interests';
import Recommendations from './recommendations/recommendations';

// class mediaPage extends React.Component {

//     render() {
//         return (
//             <main className='home-main'>
//                 <Interests />
//                 <Recommendations type="similar" />
//                 <Recommendations type="all" />
//             </main>
//         )
//     }
// }

export const MoviePage = () => {

    return (
        <main className='home-main'>
            <Interests />
            <Recommendations type="similar" />
            <Recommendations type="all" />
        </main>
    )
}