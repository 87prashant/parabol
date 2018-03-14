import {approveToOrgInvitationUpdater} from 'universal/mutations/ApproveToOrgMutation';
import {cancelTeamInviteInvitationUpdater} from 'universal/mutations/CancelTeamInviteMutation';
import {inviteTeamMembersInvitationUpdater} from 'universal/mutations/InviteTeamMembersMutation';
import {acceptTeamInviteInvitationUpdater} from 'universal/mutations/AcceptTeamInviteMutation';

const subscription = graphql`
  subscription InvitationSubscription($teamId: ID!) {
    invitationSubscription(teamId: $teamId) {
      __typename
      ...AcceptTeamInviteMutation_invitation
      ...AcceptTeamInviteEmailMutation_invitation
      ...ApproveToOrgMutation_invitation
      ...CancelTeamInviteMutation_invitation
      ...InviteTeamMembersMutation_invitation
      ...ResendTeamInviteMutation_invitation
    }
  }
`;

const InvitationSubscription = (environment, queryVariables) => {
  const {teamId} = queryVariables;
  return {
    subscription,
    variables: {teamId},
    updater: (store) => {
      const payload = store.getRootField('invitationSubscription');
      if (!payload) return;
      const type = payload.getValue('__typename');
      switch (type) {
        case 'AcceptTeamInviteNotificationPayload':
        case 'AcceptTeamInviteEmailPayload':
          acceptTeamInviteInvitationUpdater(payload, store);
          break;
        case 'ApproveToOrgPayload':
          approveToOrgInvitationUpdater(payload, store);
          break;
        case 'CancelTeamInvitePayload':
          cancelTeamInviteInvitationUpdater(payload, store);
          break;
        case 'InviteTeamMembersPayload':
          inviteTeamMembersInvitationUpdater(payload, store);
          break;
        default:
          console.error('InvitationSubscription case fail', type);
      }
    }
  };
};

export default InvitationSubscription;
