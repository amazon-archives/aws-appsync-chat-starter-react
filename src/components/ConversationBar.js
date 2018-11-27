import React from 'react'
import PropTypes from 'prop-types'
import appsync from '../images/appsync.png'

const ConversationBar = ({ conversation, name, switchView }) => {
  const title = 'ChatQL' + (name ? ` > ${name}` : '')
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
        <span className="navbar-brand"> {title} </span>
        <div className="d-flex flex-row align-items-center ml-auto">
          <i className="fab fa-aws pr-2" style={{ fontSize: '1.5em' }} />
          <img
            src={appsync}
            alt="AWS AppSync"
            style={{
              width: '1.5em'
            }}
          />
        </div>
      </nav>
    </div>
  )
}
ConversationBar.propTypes = {
  conversation: PropTypes.object,
  name: PropTypes.string,
  switchView: PropTypes.func.isRequired
}

export default ConversationBar
