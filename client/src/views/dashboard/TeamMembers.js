import React from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import ManageTeamMembersList from './components/ManageTeamMembersList'

const styles = theme => ({
  tableContainer: {
    height: 320
  }
})

const TeamMembers = ({ classes }) => (
  <div>
    <Typography variant='display1' gutterBottom>
      Team Members
    </Typography>
    <ManageTeamMembersList />
  </div>
)

TeamMembers.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TeamMembers)
