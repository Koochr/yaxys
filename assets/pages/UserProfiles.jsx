/* eslint-disable react/prop-types */
import React, { Component } from "react"
import { connect } from "react-redux"

import { Paper, Button } from "@material-ui/core"

import YaxysClue, { queries } from "../services/YaxysClue"
import { withConstants } from "../services/Utils"

import Wrapper from "../components/Wrapper.jsx"
import Created from "../components/Created.jsx"
import ModelDialog from "../components/ModelDialog.jsx"
import ModelTableLoader from "../components/ModelTableLoader.jsx"
import Request from "../components/Request.jsx"
import { withNamespaces } from "react-i18next"

const CREATED_PROFILES_MARKER = "profiles-page"
const createdProfilesSelector = YaxysClue.selectors.byClue(
  props => ({ identity: "userprofile", query: queries.CREATE }),
  { marker: CREATED_PROFILES_MARKER }
)

@withConstants
@withNamespaces()
@connect(
  (state, props) => ({
    createdProfiles: createdProfilesSelector(state, props),
  }),
  {
    createProfile: YaxysClue.actions.byClue,
    deleteProfile: YaxysClue.actions.byClue,
  }
)
export default class UserProfiles extends Component {
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

    this.props.createProfile(
      {
        identity: "userprofile",
        query: queries.CREATE,
        data: values,
      },
      { marker: CREATED_PROFILES_MARKER }
    )
  }

  onDeleteItem = item => {
    const { t } = this.props
    if (this.state.deletedHash[item.id]) {
      return
    }
    const entityInstance = t("ENTITY_INSTANCE", {
      entity: "$t(USER_PROFILE)",
      info: {
        id: item.id,
        data: item,
      },
    })
    if (!confirm(`${t("ARE_YOU_SURE_TO")} ${t("DELETE").toLowerCase()} ${entityInstance}?`)) {
      return
    }

    this.props.deleteProfile({
      identity: "userprofile",
      query: queries.DELETE,
      id: item.id,
    })

    this.setState({
      deletedSelector: YaxysClue.selectors.byClue(
        props => ({ identity: "userprofile", query: queries.DELETE, id: item.id })
      ),
      deleteAttemptAt: new Date().getTime(),
    })
  }

  onItemDeleted = item => {
    this.state.deletedHash[item?.meta?.clue?.id] = true
    this.forceUpdate()
  }

  render() {
    const { constants, t } = this.props
    return (
      <Wrapper breadcrumbs={[t("USER_PROFILE_PLURAL")]}>
        <h1 style={{ marginTop: 0 }}>{ t("USER_PROFILE_PLURAL")}</h1>
        <Button
          variant="text"
          color="secondary"
          onClick={this.onAdd}
        >
          { `${t("CREATE")} ${t("USER_PROFILE", { "context": "ACCUSATIVE" })}`}
        </Button>
        <Created
          items={this.props.createdProfiles}
          content={profile => `#${profile.id} ${profile.name}`}
          url={profile => `/user-profiles/${profile.id}`}
          laterThan={ this.state.constructedAt }
        />
        <Paper>
          <ModelTableLoader
            identity="userprofile"
            url={profile => `/user-profiles/${profile.id}`}
            columns={["id", "name"]}
            onDelete={this.onDeleteItem}
            deletedHash={ this.state.deletedHash }
            deletedKey="id"
          />
        </Paper>
        <br />
        <ModelDialog
          title={t("USER_PROFILES_PAGE.CREATE_DLG_TITLE")}
          open={this.state.addOpen}
          onClose={this.onAddClose}
          onReady={this.onAddReady}
          schema={constants.schemas.userprofile}
          attributes={["name"]}
          btnReady={t("CREATE")}
        >
          {t("USER_PROFILES_PAGE.CREATE_DLG_DESC")}
        </ModelDialog>
        <Request
          selector={this.state.deletedSelector}
          message={ `${t("DELETE_PROCESS")} ${t("DEFINITE_ARTICLE")} ${t("USER_PROFILE", { context: "ACCUSATIVE" })}`}
          attemptAt={ this.state.deleteAttemptAt }
          onSuccess={ this.onItemDeleted }
        />
      </Wrapper>
    )
  }
}
