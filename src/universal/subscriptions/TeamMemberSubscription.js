import {acceptTeamInviteTeamMemberUpdater} from 'universal/mutations/AcceptTeamInviteMutation';
import {inviteTeamMembersTeamMemberUpdater} from 'universal/mutations/InviteTeamMembersMutation';
import {removeTeamMemberTeamMemberUpdater} from 'universal/mutations/RemoveTeamMemberMutation';
import {removeOrgUserTeamMemberUpdater} from 'universal/mutations/RemoveOrgUserMutation';
import {cancelApprovalTeamMemberUpdater} from 'universal/mutations/CancelApprovalMutation';
import {rejectOrgApprovalTeamMemberUpdater} from 'universal/mutations/RejectOrgApprovalMutation';
import {cancelTeamInviteTeamMemberUpdater} from 'universal/mutations/CancelTeamInviteMutation';

const subscription = graphql`
  subscription TeamMemberSubscription {
    teamMemberSubscription {
      __typename
      ...AcceptTeamInviteMutation_teamMember
      ...CancelApprovalMutation_teamMember
      ...CancelTeamInviteMutation_teamMember
      ...InviteTeamMembersMutation_teamMember
      ...MeetingCheckInMutation_teamMember
      ...PromoteToTeamLeadMutation_teamMember
      ...RejectOrgApprovalMutation_teamMember
      ...RemoveOrgUserMutation_teamMember
      ...RemoveTeamMemberMutation_teamMember
      ...UpdateUserProfileMutation_teamMember
    }
  }
`;

const TeamMemberSubscription = (environment, queryVariables, subParams) => {
  const {dispatch} = subParams;
  const {viewerId} = environment;
  return {
    subscription,
    variables: {},
    updater: (store) => {
      const payload = store.getRootField('teamMemberSubscription');
      if (!payload) return;
      const type = payload.getValue('__typename');
      switch (type) {
        case 'AcceptTeamInvitePayload':
          acceptTeamInviteTeamMemberUpdater(payload, store, viewerId, dispatch);
          break;
        case 'CancelApprovalPayload':
          cancelApprovalTeamMemberUpdater(payload, store);
          break;
        case 'CancelTeamInvitePayload':
          cancelTeamInviteTeamMemberUpdater(payload, store);
          break;
        case 'InviteTeamMembersPayload':
          inviteTeamMembersTeamMemberUpdater(payload, store, dispatch);
          break;
        case 'MeetingCheckInPayload':
          break;
        case 'PromoteToTeamLeadPayload':
          break;
        case 'RejectOrgApprovalPayload':
          rejectOrgApprovalTeamMemberUpdater(payload, store);
          break;
        case 'RemoveOrgUserPayload':
          removeOrgUserTeamMemberUpdater(payload, store, viewerId);
          break;
        case 'RemoveTeamMemberPayload':
          removeTeamMemberTeamMemberUpdater(payload, store);
          break;
        case 'UpdateUserProfilePayload':
          break;
        default:
          console.error('TeamMemberSubscription case fail', type);
      }
    }
  };
};

export default TeamMemberSubscription;
