import React from 'react';
import { connect } from 'react-redux';
import { logout } from '../../../actions/session_actions';
import { openModal } from '../../../actions/modal_actions';

class Nav extends React.Component {

  render() {
    const { logout, openModal } = this.props;

    return (
      <nav className="nav-container">
        <div className="nav-search">
          <input
            tabIndex="0"
            type="text"
            placeholder="Search..."
            className="nav-search-input"
            onClick={() => openModal({ type: "search" })}
            onFocus={() => openModal({ type: "search" })}
          />
        </div>
        <header className="nav-header">
          <div className="nav-logo-container">
            <img
              className="nav-logo-main"
              src={require("../../../assets/images/logo_an.png")}
              alt="logo"
            />

            <img
              className="nav-logo-gray two dark"
              src={require("../../../assets/images/rarrow.png")}
              alt="logo"
            />
            <img
              className="nav-logo-gray one dark"
              src={require("../../../assets/images/rarrow.png")}
              alt="logo"
            />
            <img
              className="nav-logo-gray two slide"
              src={require("../../../assets/images/grarrow.png")}
              alt="logo"
            />
            <img
              className="nav-logo-gray one slide"
              src={require("../../../assets/images/grarrow.png")}
              alt="logo"
            />
          </div>

          <div className="nav-media-toggle">
            <button
              tabIndex="-1"
              className="about-button"
            >
              Movies
            </button>
            <button tabIndex="-1" className="logout-button" >
              TV Shows
            </button>{" "}
          </div>

          <div className="nav-buttons">
            <button
              tabIndex="-1"
              className="about-button"
              onClick={() => openModal({ type: "about" })}
            >
              About
            </button>
            <button tabIndex="-1" className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
      </nav>
    );
  }
}

// const msp = state => {
//   return {
//     mediaType: state.ui.mo
//   }
// }

const mdp = dispatch => ({
  logout: () => dispatch(logout()),
  openModal: modal => dispatch(openModal(modal))
});

export default connect(null, mdp)(Nav);