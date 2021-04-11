import React, { Component } from "react";
import { Droppable } from "react-beautiful-dnd";
import DraggableItem from "./DraggableItem";
import Config from "../Configuration";
import AddItemInputForm from "./AddItemInputForm";
import ContentEditable from "react-contenteditable";
import PubSub from 'pubsub-js'

const KChangeInVoteIdentifier = 'Change In Vote';

class DraggableList extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleVote = this.handleVote.bind(this);
    this.handleUnvote = this.handleUnvote.bind(this);
    this.handleAddActionPoint = this.handleAddActionPoint.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.contentEditable = React.createRef();
  }

  handleSubmit(jsonObj) {
    Config.getAxiosInstance()
      .post("/update/Person", jsonObj)
      .then(this.props.onBoardUpdate);
  }

  handleRemove(id) {
    if (window.confirm("Do you want to remove this item ?")) {
      Config.getAxiosInstance()
        .post("/deletepost", { _id: id })
        .then(this.props.onBoardUpdate);
    }
  }

  handleVote(id) {
    let reqData = {
      params: {
        team: Config.getTeamName(),
        sprint: Config.getSprintName(),
      },
    };
    Config.getAxiosInstance().get("checkIfVotingAllowed", reqData).then(res => {
      if (res.data[0] === true) {
        Config.getAxiosInstance()
          .post("/addvote", { _id: id })
          .then(this.props.onBoardUpdate).then(PubSub.publish(KChangeInVoteIdentifier));
      }
      else {
        alert("Limit Reached! " + "Users -> [" + res.data[1] + "] Votes allowed -> [" + res.data[2] + "]");
      }
    });

  }

  handleUnvote(id) {
    Config.getAxiosInstance()
      .post("/removevote", { _id: id })
      .then(res => { if (res.data === -1) { alert("Vote count is at the lowest"); } else { this.props.onBoardUpdate(); PubSub.publish(KChangeInVoteIdentifier) } });
  }

  handleTitleChange(e, col) {
    if (e !== this.props.displayName && !/^$/.test(e)) {
      let jsonObj = {
        column: col,
        value: e,
        team: Config.getTeamName(),
      };
      Config.getAxiosInstance()
        .post("/renameColumn", jsonObj);
    }
  }

  handleAddActionPoint(id, actionPoint) {
    let jsonObj = {
      _id: id,
      actionPoint: actionPoint,
    };
    Config.getAxiosInstance()
      .post("/addactionpoint", jsonObj)
      .then(this.props.onBoardUpdate);
  }

  render() {
    return (
      <div className="col-sm">
        <h1 align="center">
          <ContentEditable
            innerRef={this.contentEditable}
            html={!this.props.displayName ? "" : this.props.displayName} // innerHTML of the editable div
            disabled={false} // use true to disable editing
            onBlur={(e) =>
              this.handleTitleChange(e.target.innerText, this.props.name)
            } // handle innerHTML change
          />
        </h1>
        <Droppable droppableId={this.props.name}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {this.props.items.map((item, index) => (
                <DraggableItem
                  key={item._id}
                  id={item._id}
                  index={index}
                  item={item}
                  onVote={this.handleVote}
                  onUnvote={this.handleUnvote}
                  onRemove={this.handleRemove}
                  onAddActionPoint={this.handleAddActionPoint}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <p />
        <AddItemInputForm name={this.props.name} onSubmit={this.handleSubmit} />
      </div>
    );
  }
}

export default DraggableList;
