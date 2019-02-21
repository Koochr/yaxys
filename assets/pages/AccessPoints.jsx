/* eslint-disable react/prop-types */
import React, { Component } from "react"
import { connect } from "react-redux"

import { Paper, Button } from "@material-ui/core"

import YaxysClue, { queries } from "../services/YaxysClue"
import { withConstants } from "../services/Utils"

import Wrapper from "../components/Wrapper.jsx"
import Created from "../components/Created.jsx"
import ModelTableLoader from "../components/ModelTableLoader.jsx"
import ModelDialog from "../components/ModelDialog.jsx"
import Request from "../components/Request.jsx"

const CREATED_ACCESS_POINTS_MARKER = "accessPoints-page"
const createdAccessPointsSelector = YaxysClue.selectors.byClue(
  props => ({ identity: "accesspoint", query: queries.CREATE }),
  { marker: CREATED_ACCESS_POINTS_MARKER }
)

@withConstants
@connect(
  (state, props) => ({
    createdAccessPoints: createdAccessPointsSelector(state, props),
  }),
  {
    createAccessPoint: YaxysClue.actions.byClue,
    deleteAccessPoint: YaxysClue.actions.byClue,
  }
)
export default class AccessPoints extends Component {
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

    this.props.createAccessPoint(
      {
        identity: "accesspoint",
        query: queries.CREATE,
        data: values,
      },
      { marker: CREATED_ACCESS_POINTS_MARKER }
    )
  }

  onDeleteItem = item => {
    if (this.state.deletedHash[item.id]) {
      return
    }
    if (!confirm(`Are you sure to delete the Access Point #${item.id}?`)) {
      return
    }

    this.props.deleteAccessPoint({
      identity: "accesspoint",
      query: queries.DELETE,
      id: item.id,
    })

    this.setState({
      deletedSelector: YaxysClue.selectors.byClue(
        props => ({ identity: "accesspoint", query: queries.DELETE, id: item.id })
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
      <Wrapper breadcrumbs={["Access points"]}>
        <h1 style={{ marginTop: 0 }}>Access points</h1>
        <Button
          variant="text"
          color="secondary"
          onClick={this.onAdd}
          title="Create access point"
        >
          Add access point
        </Button>
        <Created
          items={this.props.createdAccessPoints}
          content={accessPoint =>
            accessPoint.name
              ? `#${accessPoint.id} ${accessPoint.name}`
              : `Access point #${accessPoint.id}`
          }
          url={accessPoint => `/access-points/${accessPoint.id}`}
          laterThan={ this.state.constructedAt }
        />
        <Paper>
          <ModelTableLoader
            identity="accesspoint"
            url={accessPoint => `/access-points/${accessPoint.id}`}
            columns={["id", "name", "description", "door", "zoneTo"]}
            additionalClueProperties={{ populate: "zoneTo,door" }}
            onDelete={this.onDeleteItem}
            deletedHash={ this.state.deletedHash }
            deletedKey="id"
          />
        </Paper>
        <br />
        <ModelDialog
          title="Create new Access point"
          open={this.state.addOpen}
          onClose={this.onAddClose}
          onReady={this.onAddReady}
          schema={constants.schemas.accesspoint}
          attributes={["name", "description"]}
          btnReady="Create"
        >
          Please provide name and description for the new access point.
        </ModelDialog>
        <Request
          selector={this.state.deletedSelector}
          message={"Deleting the Access Point"}
          attemptAt={ this.state.deleteAttemptAt }
          onSuccess={ this.onItemDeleted }
        />
      </Wrapper>
    )
  }
}
