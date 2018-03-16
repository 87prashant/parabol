import {acceptTeamInviteTeamUpdater} from 'universal/mutations/AcceptTeamInviteMutation';
import {addOrgMutationNotificationUpdater} from 'universal/mutations/AddOrgMutation';
import {addTeamMutationNotificationUpdater, addTeamTeamUpdater} from 'universal/mutations/AddTeamMutation';
import {archiveTeamTeamUpdater} from 'universal/mutations/ArchiveTeamMutation';
import {endMeetingTeamUpdater} from 'universal/mutations/EndMeetingMutation';
import {inviteTeamMembersTeamUpdater} from 'universal/mutations/InviteTeamMembersMutation';
import {killMeetingTeamUpdater} from 'universal/mutations/KillMeetingMutation';
import {promoteFacilitatorTeamUpdater} from 'universal/mutations/PromoteFacilitatorMutation';
import {removeTeamMemberTeamUpdater} from 'universal/mutations/RemoveTeamMemberMutation';
import {requestFacilitatorTeamUpdater} from 'universal/mutations/RequestFacilitatorMutation';
import {removeOrgUserTeamUpdater} from 'universal/mutations/RemoveOrgUserMutation';
import {startNewMeetingTeamOnNext} from 'universal/mutations/StartNewMeetingMutation';
import {navigateMeetingTeamOnNext} from 'universal/mutations/NavigateMeetingMutation';

const subscription = graphql`
  subscription TeamSubscription {
    teamSubscription {
      __typename
      ...AcceptTeamInviteMutation_team
      ...AddTeamMutation_team
      ...AddTeamMutation_team
      ...ArchiveTeamMutation_team,
      ...EndMeetingMutation_team
      ...KillMeetingMutation_team
      ...MoveMeetingMutation_team
      ...NavigateMeetingMutation_team
      ...PromoteFacilitatorMutation_team
      ...RemoveTeamMemberMutation_team
      ...RemoveOrgUserMutation_team
      ...RequestFacilitatorMutation_team
      ...StartMeetingMutation_team
      ...StartNewMeetingMutation_team
      ...UpdateCheckInQuestionMutation_team
      ...UpdateCreditCardMutation_team
      ...UpdateTeamNameMutation_team
      ...UpgradeToProMutation_organization
    }
  }
`;

const onNextHandlers = {
  StartNewMeetingMutation: startNewMeetingTeamOnNext,
  NavigateMeetingMutation: navigateMeetingTeamOnNext
};

const TeamSubscription = (environment, queryVariables, subParams) => {
  const {dispatch, history, location} = subParams;
  const {viewerId} = environment;
  return {
    subscription,
    variables: {},
    updater: (store) => {
      const payload = store.getRootField('teamSubscription');
      if (!payload) return;
      const type = payload.getValue('__typename');
      const options = {store, environment, dispatch, history, location};
      switch (type) {
        case 'AcceptTeamInvitePayload':
          acceptTeamInviteTeamUpdater(payload, store, viewerId);
          break;
        case 'AddOrgCreatorPayload':
          addOrgMutationNotificationUpdater(payload, store, viewerId, options);
          break;
        case 'AddTeamCreatorPayload':
          addTeamMutationNotificationUpdater(payload, store, viewerId, options);
          break;
        case 'CreateGitHubIssuePayload':
          break;
        case 'RemoveTeamMemberSelfPayload':
          removeTeamMemberTeamUpdater(payload, store, viewerId, options);
          break;
        case 'RequestFacilitatorPayload':
          requestFacilitatorTeamUpdater(payload, options);
          break;
        case 'AddTeamMutationPayload':
          addTeamTeamUpdater(payload, store, viewerId);
          break;
        case 'ArchiveTeamPayload':
          archiveTeamTeamUpdater(payload, store, viewerId, options);
          break;
        case 'EndMeetingPayload':
          endMeetingTeamUpdater(payload, options);
          break;
        case 'InviteTeamMembersPayload':
          inviteTeamMembersTeamUpdater(payload, store, viewerId);
          break;
        case 'KillMeetingPayload':
          killMeetingTeamUpdater();
          break;
        case 'MeetingCheckInPayload':
          break;
        case 'MoveMeetingPayload':
          break;
        case 'NavigateMeetingPayload':
          break;
        case 'PromoteFacilitatorPayload':
          promoteFacilitatorTeamUpdater(payload, viewerId, dispatch);
          break;
        case 'RemoveOrgUserPayload':
          removeOrgUserTeamUpdater(payload, store, viewerId);
          break;
        case 'RemoveTeamMemberPayload':
          removeTeamMemberTeamUpdater(payload, store, viewerId, options);
          break;
        case 'RequestFaciltatorPayload':
          requestFacilitatorTeamUpdater(payload, options);
          break;
        case 'StartMeetingPayload':
          break;
        case 'StartNewMeetingMutation':
          break;
        case 'UpdateCreditCardPayload':
          break;
        case 'UpdateCheckInQuestionPayload':
          break;
        case 'UpgradeToProPayload':
          break;
        default:
          console.error('TeamSubscription case fail', type);
      }
    },
    onNext: ({teamSubscription}) => {
      const {__typename: type} = teamSubscription;
      const handler = onNextHandlers[type];
      if (handler) {
        handler(teamSubscription, {...subParams, environment});
      }
    }
  };
};

export default TeamSubscription;
