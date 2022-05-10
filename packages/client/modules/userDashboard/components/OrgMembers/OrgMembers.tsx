import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import {usePaginationFragment} from 'react-relay'
import Panel from '../../../../components/Panel/Panel'
import {OrgMembersPaginationQuery} from '../../../../__generated__/OrgMembersPaginationQuery.graphql'
import {OrgMembers_viewer$key} from '../../../../__generated__/OrgMembers_viewer.graphql'
import OrgMemberRow from '../OrgUserRow/OrgMemberRow'

interface Props {
  viewerRef: OrgMembers_viewer$key
}

const OrgMembers = ({viewerRef}: Props) => {
  const {data} = usePaginationFragment<OrgMembersPaginationQuery, OrgMembers_viewer$key>(
    graphql`
      fragment OrgMembers_viewer on Query @refetchable(queryName: "OrgMembersPaginationQuery") {
        viewer {
          organization(orgId: $orgId) {
            ...OrgMemberRow_organization
            organizationUsers(first: $first, after: $after)
              @connection(key: "OrgMembers_organizationUsers") {
              edges {
                cursor
                node {
                  id
                  role
                  ...OrgMemberRow_organizationUser
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      }
    `,
    viewerRef
  )
  const {viewer} = data
  const {organization} = viewer
  if (!organization) return null
  const {organizationUsers} = organization
  const billingLeaderCount = organizationUsers.edges.reduce(
    (count, {node}) => (node.role === 'BILLING_LEADER' ? count + 1 : count),
    0
  )
  return (
    <Panel label='Organization Members'>
      {organizationUsers.edges.map(({node: organizationUser}) => {
        return (
          <OrgMemberRow
            key={organizationUser.id}
            billingLeaderCount={billingLeaderCount}
            organizationUser={organizationUser}
            organization={organization}
          />
        )
      })}
    </Panel>
  )
}

export default OrgMembers
