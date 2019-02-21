/* eslint-disable react/prop-types */
import React, { Component } from "react"
import { connect } from "react-redux"

import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"

import YaxysClue, { queries } from "../services/YaxysClue"
import { withConstants } from "../services/Utils"

import Wrapper from "../components/Wrapper.jsx"
import Created from "../components/Created.jsx"
import ModelTableLoader from "../components/ModelTableLoader.jsx"
import ModelDialog from "../components/ModelDialog.jsx"
import Request from "../components/Request.jsx"

const CREATED_DOORS_MARKER = "doors-page"
const createdDoorsSelector = YaxysClue.selectors.byClue(
  props => ({ identity: "door", query: queries.CREATE }),
  { marker: CREATED_DOORS_MARKER }
)

@withConstants
@connect(
  (state, props) => ({
    createdDoors: createdDoorsSelector(state, props),
  }),
  {
    createDoor: YaxysClue.actions.byClue,
    deleteDoor: YaxysClue.actions.byClue,
  }
)
export default class Doors extends Component {
  state = {
    addOpen: false,
    deletedHash: {},
    constructedAt: new Date().getTime(),
  }

  onAdd = event => {
    this.setState({ addOpen: true })
  }

  onAddClose = () => {
    this.setState({ addOpen: false })
  }

  onAddReady = values => {
    this.setState({ addOpen: false })

    this.props.createDoor(
      {
        identity: "door",
        query: queries.CREATE,
        data: values,
      },
      { marker: CREATED_DOORS_MARKER }
    )
  }

  onDeleteItem = item => {
    if (this.state.deletedHash[item.id]) {
      return
    }
    if (!confirm(`Are you sure to delete the Door #${item.id}?`)) {
      return
    }

    this.props.deleteDoor({
      identity: "door",
      query: queries.DELETE,
      id: item.id,
    })

    this.setState({
      deletedSelector: YaxysClue.selectors.byClue(
        props => ({ identity: "door", query: queries.DELETE, id: item.id })
      ),
      deleteAttemptAt: new Date().getTime(),
    })
  }

  onItemDeleted = item => {
    this.state.deletedHash[item?.meta?.clue?.id] = true
    this.forceUpdate()
  }

  render() {
    const { constants } = this.props
    return (
      <Wrapper breadcrumbs={["Doors"]}>
        <h1 style={{ marginTop: 0 }}>Doors</h1>
        <Button
          variant="text"
          color="secondary"
          onClick={this.onAdd}
          title="Create door"
        >
          Add door
        </Button>
        <Created
          items={this.props.createdDoors}
          content={door => (door.name ? `#${door.id} ${door.name}` : `Door #${door.id}`)}
          url={door => `/doors/${door.id}`}
          laterThan={ this.state.constructedAt }
        />
        <Paper>
          <ModelTableLoader
            identity="door"
            url={door => `/doors/${door.id}`}
            columns={["id", "name", "description", "accessPoints", "zones"]}
            additionalClueProperties={{ populate: "accessPoints,zones" }}
            onDelete={this.onDeleteItem}
            deletedHash={ this.state.deletedHash }
            deletedKey="id"
          />
        </Paper>
        <br />
        <ModelDialog
          title="Create new door"
          open={this.state.addOpen}
          onClose={this.onAddClose}
          onReady={this.onAddReady}
          schema={constants.schemas.door}
          attributes={["name", "description"]}
          btnReady="Create"
        >
          Please provide name and description for the new door.
        </ModelDialog>
        <Request
          selector={this.state.deletedSelector}
          message={"Deleting the Door"}
          attemptAt={ this.state.deleteAttemptAt }
          onSuccess={ this.onItemDeleted }
        />
      </Wrapper>
    )
  }
}
