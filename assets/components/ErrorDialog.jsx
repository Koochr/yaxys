import React, { Component } from "react"
import PropTypes from "prop-types"

import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"

import { withImmutablePropsFixed } from "../services/Utils.js"
import { withNamespaces } from "react-i18next"

@withNamespaces()
class ErrorDialog extends Component {
  static propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    item: PropTypes.object,
    onClose: PropTypes.func,
    t: PropTypes.func,
  }

  render() {
    const { open, item, onClose, title } = this.props
    return (<Dialog
      open={ open }
      onClose={ onClose }
    >
      <DialogTitle>{ title || this.props.t("ErrorDialog_DETAILS") }</DialogTitle>
      <DialogContent>
        <DialogContentText>
          { JSON.stringify(item) }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={ onClose } color="primary">
          {this.props.t("CLOSE")}
        </Button>
      </DialogActions>
    </Dialog>)
  }
}

export default withImmutablePropsFixed("items")(ErrorDialog)
