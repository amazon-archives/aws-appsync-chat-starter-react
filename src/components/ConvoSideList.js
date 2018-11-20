import React from "react";
import PropTypes from "prop-types";
import _get from "lodash.get";

const SideList = ({
  getMenuProps,
  getItemProps,
  selectedItem,
  conversations
}) => {
  const selItemId = selectedItem ? selectedItem.id : null;
  const items = _get(conversations, "items", []);
  return (
    <div className="section sidelist">
      <div {...getMenuProps()} className="list-group list-group-flush">
        {items.length ? (
          items.map((item, index) => (
            <button
              type="button"
              {...getItemProps({
                key: item.conversation.id,
                index,
                item
              })}
              className={
                "list-group-item list-group-item-action" +
                (selItemId === item.conversation.id ? " active" : "")
              }
            >
              {item.name}
            </button>
          ))
        ) : (
          <div className="p-4 text-muted h4 text-center">
            You have no conversations. Find a user to get started.
          </div>
        )}
      </div>
    </div>
  );
};
SideList.propTypes = {
  getMenuProps: PropTypes.func.isRequired,
  getItemProps: PropTypes.func.isRequired,
  selectedItem: PropTypes.object,
  conversations: PropTypes.object
};

export default SideList;
