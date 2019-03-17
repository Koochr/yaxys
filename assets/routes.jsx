"use strict"

import React from "react"

import { Provider } from "react-redux"
import { Route, Switch, Redirect } from "react-router-dom"
import { I18nextProvider } from "react-i18next"

import { ConstantsProvider } from "./services/Utils"
import Theme from "./components/Theme.jsx"
import ProtectedZone from "./components/ProtectedZone.jsx"

import Login from "./pages/Login.jsx"
import Me from "./pages/Me.jsx"
import Operators from "./pages/Operators.jsx"
import Operator from "./pages/Operator.jsx"
import Users from "./pages/Users.jsx"
import User from "./pages/User.jsx"
import Credential from "./pages/Credential.jsx"
import AccessPoints from "./pages/AccessPoints.jsx"
import AccessPoint from "./pages/AccessPoint.jsx"
import Doors from "./pages/Doors.jsx"
import Door from "./pages/Door.jsx"
import Zones from "./pages/Zones.jsx"
import Zone from "./pages/Zone.jsx"
import Settings from "./pages/Settings.jsx"
import OperatorProfiles from "./pages/OperatorProfiles.jsx"
import OperatorProfile from "./pages/OperatorProfile.jsx"
import UserProfiles from "./pages/UserProfiles.jsx"
import UserProfile from "./pages/UserProfile.jsx"

/* eslint-disable-next-line react/display-name */
export default (store, constants, i18next) => (
  <ConstantsProvider value={constants}>
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <Theme>
          <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedZone>
              <Redirect exact path="/" to="/users" />
              <Route exact path="/me" component={Me} />
              <Route exact path="/operators" component={Operators} />
              <Route exact path="/operators/:id" component={Operator} />
              <Route exact path="/access-points" component={AccessPoints} />
              <Route exact path="/access-points/:id" component={AccessPoint} />
              <Route exact path="/doors" component={Doors} />
              <Route exact path="/doors/:id" component={Door} />
              <Route exact path="/zones" component={Zones} />
              <Route exact path="/zones/:id" component={Zone} />
              <Route exact path="/users" component={Users} />
              <Route exact path="/users/:id" component={User} />
              <Route exact path="/users/:user/credentials/:id" component={Credential} />
              <Route exact path="/settings" component={Settings} />
              <Route exact path="/settings/operator-profiles" component={OperatorProfiles} />
              <Route exact path="/settings/operator-profiles/:id" component={OperatorProfile} />
              <Route exact path="/user-profiles" component={UserProfiles} />
              <Route exact path="/user-profiles/:id" component={UserProfile} />
            </ProtectedZone>
          </Switch>
        </Theme>
      </I18nextProvider>
    </Provider>
  </ConstantsProvider>
)
