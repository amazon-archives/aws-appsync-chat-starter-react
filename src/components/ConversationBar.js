import React from "react";
import PropTypes from "prop-types";
import appsync from "../images/appsync.png";
import logo from "../images/logo.png";

const ConversationBar = ({ conversation, name, switchView }) => {
  const title = "ChatQL" + (name ? ` > ${name}` : "");
  return (
    <div className="topbar">
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <button
          className="navbar-toggler mr-2"
          type="button"
          onClick={switchView}
        >
          <i className="fas fa-chevron-circle-left" />
        </button>
        <span className="navbar-brand">
          {title}
        </span>
        <div className="d-flex flex-grow-1" />
        <span>
          <h3 className="fab fa-aws" />
          <img
            src={appsync}
            alt="AWS AppSync"
            className="p-1"
            style={{
              width: "35px"
            }}
          />
        </span>
      </nav>
    </div>
  );
};
ConversationBar.propTypes = {
  conversation: PropTypes.object,
  name: PropTypes.string,
  switchView: PropTypes.func.isRequired
};

export default ConversationBar;
