/* eslint-disable react/prop-types */
import React, { Component, Fragment } from "react"
import { connect } from "react-redux"

import YaxysClue, { queries } from "../services/YaxysClue"
import { pick, cloneDeep } from "lodash"

import { Paper } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"

import { withConstants } from "../services/Utils"

import Wrapper from "../components/Wrapper.jsx"
import Loader from "../components/Loader.jsx"
import Update from "../components/Update.jsx"
import ModelForm from "../components/ModelForm.jsx"

const userProfileClue = props => ({
  identity: "userprofile",
  query: queries.FIND_BY_ID,
  id: props.match.params.id,
})
const userProfileSelector = YaxysClue.selectors.byClue(userProfileClue)

const styles = {
  rights: {
    padding: "1px 30px 20px",
    margin: "0 0 30px 0",
  },
}

@withStyles(styles)
@withConstants
@connect(
  (state, props) => ({
    userProfile: userProfileSelector(state, props),
  }),
  {
    loadUserProfile: YaxysClue.actions.byClue,
  }
)
export default class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userProfile: this.props2UserProfileState(props),
      forceValidation: false,
    }
  }

  componentDidMount() {
    this.props.loadUserProfile(userProfileClue(this.props))
  }

  componentDidUpdate(prevProps) {
    const isReady = this.props.userProfile && this.props.userProfile.success
    const wasReady = prevProps.userProfile && prevProps.userProfile.success
    if (isReady && !wasReady) {
      /* eslint-disable-next-line react/no-did-update-set-state */
      this.setState({ userProfile: this.props2UserProfileState(this.props) })
    }
  }

  props2UserProfileState(propsArg) {
    const props = propsArg || this.props
    const userProfile =
      props.userProfile && props.userProfile.success
        ? pick(props.userProfile.data, "id", "title", "description")
        : {}

    userProfile.rights = cloneDeep(userProfile.rights)

    return userProfile
  }

  onFormChange = data => {
    this.setState({
      userProfile: { ...this.state.userProfile, ...data.values },
      modifiedAt: new Date().getTime(),
    })
  }

  handleSingleChange = name => event => {
    this.state.userProfile[name] = event.target.checked
    this.state.modifiedAt = new Date().getTime()
    this.forceUpdate()
  }

  render() {
    const { userProfile, match, classes, constants } = this.props
    const update = (
      <Update
        clue={userProfileClue(this.props)}
        current={this.state.userProfile}
        schema={constants.schemas.userprofile}
        modifiedAt={this.state.modifiedAt}
      />
    )
    return (
      <Wrapper
        bottom={update}
        breadcrumbs={
          [
            { title: "Settings", url: "/settings" },
            { title: "User profiles", url: "/settings/user-profiles" },
            userProfile && userProfile.success
              ? `#${match.params.id} ${userProfile.data.title}`
              : `User profile #${match.params.id}`,
          ]
        }
      >
        <h1 style={{ marginTop: 0 }}>User Profile #{match.params.id}</h1>
        <Loader item={userProfile}>
          <Fragment>
            <ModelForm
              autoFocus={true}
              values={this.state.userProfile}
              onChange={this.onFormChange}
              forceValidation={this.state.forceValidation}
              schema={constants.schemas.userprofile}
              margin="dense"
              attributes={["title", "description"]}
            />
            <br />
            <Paper className={classes.rights}>
              <h5>The profile rights:</h5>

            </Paper>
          </Fragment>
        </Loader>
      </Wrapper>
    )
  }
}
