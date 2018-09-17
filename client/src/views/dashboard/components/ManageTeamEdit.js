import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Mutation } from 'react-apollo'

import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'

import { getItem } from '../../../utils/local-storage'

import UPDATE_TEAM_PROFILE from '../../../graphql/teams/UpdateTeamProfileMutation'
import GET_TEAMS_BY_OWNER from '../../../graphql/teams/GetTeamsByOwnerQuery'

import { checkGraphQLError } from '../../../utils/graphql-errors'

export class ManageTeamEdit extends Component {
  constructor (props) {
    super(props)

    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      open: false,
      motto: '',
      description: ''
    }
  }

  render () {
    console.log(this.props, this.props.slug)
    return (
      <Mutation
        mutation={UPDATE_TEAM_PROFILE}
        update={(cache, { data: { deleteTeam } }) => {
          const data = cache.readQuery({ query: GET_TEAMS_BY_OWNER })
          console.log('Mutation cache update: ', deleteTeam, data)
          data.getTeamsByOwner.push(deleteTeam)
          cache.writeQuery({ query: GET_TEAMS_BY_OWNER, data })
        }}
      >
        {(updateTeamProfile, { loading, error, data }) => {
          let errors
          let loader
          let description
          let motto
          if (loading) {
            loader = <Typography variant='caption'>Submitting team...</Typography>
          }
          if (error) {
            errors = error.graphQLErrors.map(({ message }, i) => {
              const displayMessage = checkGraphQLError(message)
              console.log('updateTeamProfile error:', displayMessage)
              return (
                <Typography key={i} variant='caption'>
                  {message}
                </Typography>
              )
            })
          }
          return (
            <div>
              <Button size='small' color='primary' className={this.props.classes.buttonRight} onClick={this.handleClickOpen}>
                <EditIcon /> Edit
              </Button>
              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby='form-dialog-title'
              >
                <DialogTitle id='form-dialog-title'>Edit Team Details</DialogTitle>
                <DialogContent>
                  <Typography variant='subheading'>Team Creation</Typography>
                  <DialogContentText>Team Motto:</DialogContentText>
                  <TextField
                    autoFocus
                    margin='dense'
                    id='teammotto'
                    label='Team Motto'
                    type='text'
                    fullWidth
                    value={this.state.motto}
                    onChange={this.handleChange}
                    inputRef={node => {
                      motto = node
                    }}
                  />
                  <DialogContentText>Team description:</DialogContentText>
                  <TextField
                    autoFocus
                    margin='dense'
                    id='teamDescription'
                    label='Team Description'
                    type='text'
                    rows={4}
                    multiline
                    fullWidth
                    value={this.state.description}
                    onChange={this.handleChange}
                    inputRef={node => {
                      description = node
                    }}
                  />
                  {loader}
                  {errors}
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color='primary'>
                    Cancel
                  </Button>
                  <Button onClick={e => {
                    this.handleSubmit(e, updateTeamProfile, this.props.slug, description, motto)
                  }} color='primary'>
                    Update Team
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )
        }}
      </Mutation>
    )
  }

  handleClickOpen () {
    this.setState({ open: true })
  }

  handleClose () {
    this.setState({ open: false })
  }

  handleChange (e) {
    switch (e.target.id) {
      case 'motto':
        this.setState({ motto: e.target.value })
        break
      case 'description':
        this.setState({ description: e.target.value })
        break
      default:
    }
  }

  async handleSubmit (e, updateTeamProfile, slug, description, motto) {
    e.preventDefault()
    const currentUser = await getItem('user')
    let authId = JSON.parse(currentUser)
    authId = authId.authId
    await updateTeamProfile({ variables: { slug, owner: authId, description: description, motto: motto } })
  }
}

ManageTeamEdit.propTypes = {
  classes: PropTypes.object.isRequired,
  slug: PropTypes.string.isRequired
}

export default withRouter(ManageTeamEdit)
