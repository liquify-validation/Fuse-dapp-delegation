import React from 'react'
import { ValidatorTitleIcon } from '../ValidatorTitleIcon'
import { Header, Icon, Popup, Grid } from 'semantic-ui-react'

const style = {
  borderRadius: 0,
  opacity: 0.7,
  padding: '2em'
}

export const ValidatorTitle = ({
  extraClassName = '',
  text = '',
  type,
  networkBranch = '',
  email = '',
  website = ''
}) => {
  var popOut = false
  var mailSet = false
  var mailTo = ''

  if (email !== '' && website !== '' && (email !== 'Not set' || website !== 'Not set')) {
    popOut = true
    if (website.substring(0, 4) !== 'http') {
      website = 'https://' + website
    }

    if (email !== 'Not set') {
      mailSet = true
      mailTo = 'mailto:' + email
    }
  }
  return (
    <h3 className={`vl-ValidatorTitle ${extraClassName}`}>
      <ValidatorTitleIcon networkBranch={networkBranch} type={type} />
      <span className={`vl-ValidatorTitle_Text`}>{text}</span>
      {!popOut ? null : (
        <Popup trigger={<Icon name="info circle" size="large" />} flowing={true} hoverable={true}>
          <Grid centered divided columns={2}>
            <Grid.Column textAlign="center">
              <Header as="h4">Website</Header>
              <a href={website} target="_blank">
                {website}
              </a>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Header as="h4">Email</Header>
              {mailSet ? <a href={mailTo}>{email}</a> : <p> {email} </p>}
            </Grid.Column>
          </Grid>
        </Popup>
      )}
    </h3>
  )
}
