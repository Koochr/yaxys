/* eslint-disable react/prop-types */
import React, { Component } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"

import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"

import YaxysClue, { queries } from "../services/YaxysClue"
import { withConstants } from "../services/Utils"

import Wrapper from "../components/Wrapper.jsx"
import Created from "../components/Created.jsx"
import ModelDialog from "../components/ModelDialog.jsx"
import ModelTableLoader from "../components/ModelTableLoader.jsx"
import Request from "../components/Request.jsx"

const CREATED_USERS_MARKER = "users-page"
const createdUsersSelector = YaxysClue.selectors.byClue(
  props => ({ identity: "user", query: queries.CREATE }),
  { marker: CREATED_USERS_MARKER }
)

@withConstants
@connect(
  (state, props) => ({
    createdUsers: createdUsersSelector(state, props),
  }),
  {
    createUser: YaxysClue.actions.byClue,
    deleteUser: YaxysClue.actions.byClue,
  }
)
export default class Users extends Component {
  state = {
    addOpen: false,
    deletedHash: {},
  }

  onAdd = event => {
    this.setState({ addOpen: true })
  }

  onAddClose = () => {
    this.setState({ addOpen: false })
  }

  onAddReady = values => {
    this.setState({ addOpen: false })

    this.props.createUser(
      {
        identity: "user",
        query: queries.CREATE,
        data: values,
      },
      { marker: CREATED_USERS_MARKER }
    )
  }

  onDeleteItem = item => {
    if (this.state.deletedHash[item.id]) {
      return
    }
    if (!confirm(`Are you sure to delete the User #${item.id}?`)) {
      return
    }

    this.props.deleteUser({
      identity: "user",
      query: queries.DELETE,
      id: item.id,
    })

    this.setState({
      deletedSelector: YaxysClue.selectors.byClue(
        props => ({ identity: "user", query: queries.DELETE, id: item.id })
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
      <Wrapper breadcrumbs={["Users"]}>
        <h1 style={{ marginTop: 0 }}>Users</h1>
        <p>
          Also, you can control users&#39; rights by{" "}
          <Link to={"/user-profiles"}>managing their profiles</Link>
        </p>
        <Button
          variant="text"
          color="secondary"
          onClick={this.onAdd}
          title="Create user"
        >
          Add user
        </Button>
        <Created
          items={this.props.createdUsers}
          content={user => user.name}
          url={user => `/users/${user.id}`}
        />
        <Paper>
          <ModelTableLoader
            identity="user"
            url={user => `/users/${user.id}`}
            columns={["id", "name", "hasCustomRights", "profiles"]}
            additionalClueProperties={{ populate: "profiles" }}
            onDelete={this.onDeleteItem}
            deletedHash={ this.state.deletedHash }
            deletedKey="id"
          />
        </Paper>
        <br />
        <ModelDialog
          title="Create new user"
          open={this.state.addOpen}
          onClose={this.onAddClose}
          onReady={this.onAddReady}
          schema={constants.schemas.user}
          attributes={["name"]}
          btnReady="Create"
        >
          Please provide name for the new user.
        </ModelDialog>
        <Request
          selector={this.state.deletedSelector}
          message={"Deleting the User"}
          attemptAt={ this.state.deleteAttemptAt }
          onSuccess={ this.onItemDeleted }
        />
      </Wrapper>
    )
  }
}
