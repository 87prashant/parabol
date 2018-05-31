import PropTypes from 'prop-types'
import React from 'react'
import {matchPath, Switch} from 'react-router-dom'
import AsyncRoute from 'universal/components/AsyncRoute/AsyncRoute'
import TeamSettingsToggleNav from 'universal/modules/teamDashboard/components/TeamSettingsToggleNav/TeamSettingsToggleNav'
import ui from 'universal/styles/ui'

const teamSettings = () =>
  import(/* webpackChunkName: 'TeamSettingsRoot' */ 'universal/modules/teamDashboard/components/TeamSettingsRoot')
const providers = () =>
  import(/* webpackChunkName: 'TeamIntegrationsRoot' */ 'universal/modules/teamDashboard/containers/TeamIntegrationsRoot/TeamIntegrationsRoot')
const slackIntegrations = () =>
  import(/* webpackChunkName: 'SlackIntegrationsRoot' */ 'universal/modules/teamDashboard/containers/SlackIntegrationsRoot/SlackIntegrationsRoot')
const githubIntegrations = () =>
  import(/* webpackChunkName: 'GitHubIntegrationsRoot' */ 'universal/modules/teamDashboard/containers/GitHubIntegrationsRoot/GitHubIntegrationsRoot')

const TeamSettingsWrapper = (props) => {
  const {
    location: {pathname},
    match,
    teamMemberId
  } = props
  const {
    params: {teamId}
  } = match
  const areaMatch = matchPath(pathname, {path: `${match.url}/:area?`})
  return (
    <div style={{padding: `0 ${ui.settingsGutter}`}}>
      <TeamSettingsToggleNav activeKey={areaMatch.params.area || ''} teamId={teamId} />
      <Switch>
        <AsyncRoute exact path={match.url} mod={teamSettings} extraProps={{teamId}} />
        {/* <AsyncRoute exact path={`${match.url}/insights`} mod={overview} extraProps={{teamId}}/> */}
        {/* <AsyncRoute exact path={`${match.url}/roles`} mod={overview} extraProps={{teamId}}/> */}
        <AsyncRoute
          path={`${match.url}/integrations/slack`}
          mod={slackIntegrations}
          extraProps={{teamMemberId}}
        />
        <AsyncRoute
          path={`${match.url}/integrations/github`}
          mod={githubIntegrations}
          extraProps={{teamMemberId}}
        />
        <AsyncRoute
          exact
          path={`${match.url}/integrations`}
          mod={providers}
          extraProps={{teamMemberId}}
        />
      </Switch>
    </div>
  )
}

TeamSettingsWrapper.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object.isRequired,
  teamMemberId: PropTypes.string.isRequired
}

export default TeamSettingsWrapper
