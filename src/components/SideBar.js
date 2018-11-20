import React from 'react'
import Downshift from 'downshift'
import { Scrollbars } from 'react-custom-scrollbars'
import PropTypes from 'prop-types'
// import onUpdateConvoLink from '../graphql/subscriptions/onUpdateConvoLink'
import { onUpdateConvoLink } from '../graphql/subscriptions'
import _cloneDeep from 'lodash.clonedeep'
import _debounce from 'lodash.debounce'
import SideList from './ConvoSideList'
import { SearchResultListWithData } from './SearchResultList'
import gql from 'graphql-tag'

const SearchBar = ({ propsFn }) => (
  <div className="px-3 py-2 section">
    <form>
      <div className="row">
        <div className="col">
          <input
            {...propsFn()}
            className="form-control"
            placeholder="Search..."
          />
        </div>
      </div>
    </form>
  </div>
)
SearchBar.propTypes = {
  propsFn: PropTypes.func.isRequired
}

export default class SideBar extends React.Component {
  state = {
    searchTerm: null
  }

  componentDidMount() {
    if (this.props.userId) {
      this.unsubscribe = createSubForConvoList(
        this.props.subscribeToMore,
        this.props.userId
      )
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.userId && !this.unsubscribe) {
      this.unsubscribe = createSubForConvoList(
        this.props.subscribeToMore,
        this.props.userId
      )
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  onStateChange = _debounce(
    ({ inputValue }) => {
      if (typeof inputValue !== 'undefined') {
        this.setState({ searchTerm: inputValue.trim() })
      }
    },
    250,
    { maxWait: 500 }
  )

  onChange = selection => {
    this.props.onChange(selection)
    // clear search
  }

  stateReducer = (state, changes) => {
    // console.log(state, changes)
    switch (changes.type) {
      case Downshift.stateChangeTypes.blurInput:
      case Downshift.stateChangeTypes.mouseUp:
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.itemMouseEnter:
        // console.log('ignore', changes.type)
        return {
          ...changes,
          isOpen: state.isOpen,
          inputValue: state.inputValue
        }
      case Downshift.stateChangeTypes.keyDownEscape:
        return { ...changes, isOpen: false, inputValue: '' }
      default:
        return changes
    }
  }

  render() {
    const conversations = this.props.conversations
    return (
      <Downshift
        defaultIsOpen={false}
        onChange={this.onChange}
        onStateChange={this.onStateChange}
        itemToString={item => (item ? '' : '')}
        stateReducer={this.stateReducer}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem
        }) => (
          <div className="downshift-inner">
            <SearchBar propsFn={getInputProps} />
            <div className="scrollArea">
              <Scrollbars>
                {isOpen ? (
                  <SearchResultListWithData
                    {...{
                      getMenuProps,
                      getItemProps,
                      conversations,
                      selectedItem,
                      term: this.state.searchTerm
                    }}
                  />
                ) : (
                  <SideList
                    {...{
                      getMenuProps,
                      getItemProps,
                      selectedItem,
                      conversations
                    }}
                  />
                )}
              </Scrollbars>
            </div>
          </div>
        )}
      </Downshift>
    )
  }
}
SideBar.propTypes = {
  userId: PropTypes.string,
  subscribeToMore: PropTypes.func,
  conversations: PropTypes.object,
  onChange: PropTypes.func.isRequired
}

function createSubForConvoList(subscribeToMore, userId) {
  return subscribeToMore({
    document: gql`
      ${onUpdateConvoLink}
    `,
    variables: { convoLinkUserId: userId, status: 'READY' },
    updateQuery: (
      prev,
      {
        subscriptionData: {
          data: { onUpdateConvoLink: newConvo }
        }
      }
    ) => {
      console.log('updateQuery on convo subscription', prev, newConvo)
      const current = _cloneDeep(prev)
      current.getUser.userConversations.items.unshift(newConvo)
      return current
    }
  })
}
