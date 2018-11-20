import React from "react";
import PropTypes from "prop-types";

const UserBar = ({ name, registered, signout, switchView }) => (
  <div className="topbar">
    <nav className="navbar navbar-bbb bg-primary">
      <div className="navbar-brand">
        <span className={"mr-2 text-" + (registered ? "squidink" : "light")}>
          <i className={(registered ? "fas" : "far") + " fa-user-circle"} />
        </span>
        <span> {name} </span>
      </div>
      <div className="d-flex flex-grow-1">
        <button className="btn btn-sm btn-squidink ml-auto" onClick={signout}>
          Sign Out
        </button>
        <button
          className="navbar-toggler btn-sm mr-2 ml-auto"
          onClick={switchView}
        >
          <i className="fas fa-chevron-circle-right" />
        </button>
      </div>
    </nav>
  </div>
);
UserBar.propTypes = {
  name: PropTypes.string,
  registered: PropTypes.bool,
  switchView: PropTypes.func.isRequired,
  signout: PropTypes.func.isRequired
};

export default UserBar;
