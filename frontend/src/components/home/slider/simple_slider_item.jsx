import React from 'react';
import { connect } from 'react-redux';
import { openModal } from "../../../actions/modal_actions";

class SimpleSliderItem extends React.Component {
  render() {
    const { mediaType, entry, type, recType} = this.props;
    let modal;

    if (type === 'interests') {
      modal = {
        type: "details",
        detailsType: type,
        detailsId: entry.mediaId,
        mediaType
      };
    } else if (type === 'recommendations') {
      modal = {
        type: "details",
        detailsType: type,
        detailsRecType: recType,
        detailsId: entry.mediaId,
        mediaType
      };
    }

    return(
      <div className="slider-item">
        {/* <h1>{entry.title}</h1> */}
        <img
          className='slider-image'
          src={`https://image.tmdb.org/t/p/w500/${entry.poster}`} alt={`${entry.title}`}
          onClick={() => this.props.openModal(modal)} />
      </div>
    );
  }
}

const mdp = dispatch => ({
  openModal: modal => dispatch(openModal(modal))
});

export default connect(null, mdp)(SimpleSliderItem);