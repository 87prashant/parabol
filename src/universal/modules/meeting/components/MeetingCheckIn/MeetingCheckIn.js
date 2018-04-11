import {css} from 'aphrodite-local-styles/no-important';
import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer} from 'react-relay';
import withAtmosphere from 'universal/decorators/withAtmosphere/withAtmosphere';
import CheckInControls from 'universal/modules/meeting/components/CheckInControls/CheckInControls';
import MeetingCheckInPrompt from 'universal/modules/meeting/components/MeetingCheckInPrompt/MeetingCheckInPrompt';
import MeetingFacilitationHint from 'universal/modules/meeting/components/MeetingFacilitationHint/MeetingFacilitationHint';
import MeetingControlBar from 'universal/modules/meeting/components/MeetingControlBar/MeetingControlBar';
import MeetingMain from 'universal/modules/meeting/components/MeetingMain/MeetingMain';
import MeetingSection from 'universal/modules/meeting/components/MeetingSection/MeetingSection';
import actionMeeting from 'universal/modules/meeting/helpers/actionMeeting';
import MeetingCheckInMutation from 'universal/mutations/MeetingCheckInMutation';
import ui from 'universal/styles/ui';
import withStyles from 'universal/styles/withStyles';
import withMutationProps from 'universal/utils/relay/withMutationProps';
import {CHECKIN} from 'universal/utils/constants';

const MeetingCheckin = (props) => {
  const {
    atmosphere,
    facilitatorName,
    gotoNext,
    isFacilitating,
    localPhaseItem,
    showMoveMeetingControls,
    submitMutation,
    submitting,
    onError,
    onCompleted,
    styles,
    team
  } = props;

  const makeCheckinPressFactory = (teamMemberId) => (isCheckedIn) => () => {
    if (submitting) return;
    submitMutation();
    MeetingCheckInMutation(atmosphere, teamMemberId, isCheckedIn, onError, onCompleted);
    gotoNext();
  };

  const {teamMembers} = team;
  const memberIdx = localPhaseItem - 1;
  const currentMember = teamMembers[memberIdx];
  const {isSelf: isMyMeetingSection} = currentMember;
  const nextMember = teamMembers[memberIdx + 1];
  return (
    <MeetingMain hasHelpFor={CHECKIN} isFacilitating={isFacilitating}>
      <MeetingSection flexToFill paddingBottom="1rem">
        <MeetingCheckInPrompt
          isFacilitating={isFacilitating}
          localPhaseItem={localPhaseItem}
          team={team}
        />
        <div className={css(styles.base)}>
          {!showMoveMeetingControls &&
            <div className={css(styles.hint)}>
              <MeetingFacilitationHint showEllipsis={!nextMember || !isMyMeetingSection}>
                {nextMember ?
                  <span>
                    {isMyMeetingSection ?
                      <span>{'Share with your teammates!'}</span> :
                      <span>{'Waiting for'} <b>{currentMember.preferredName}</b> {'to share with the team'}</span>
                    }
                  </span> :
                  <span>{'Waiting for'} <b>{facilitatorName}</b> {`to advance to ${actionMeeting.updates.name}`}</span>
                }
              </MeetingFacilitationHint>
            </div>
          }
        </div>
      </MeetingSection>
      {showMoveMeetingControls &&
        <MeetingControlBar>
          <CheckInControls
            checkInPressFactory={makeCheckinPressFactory(currentMember.id)}
            currentMemberName={currentMember.preferredName}
            localPhaseItem={localPhaseItem}
            nextMemberName={nextMember && nextMember.preferredName}
          />
        </MeetingControlBar>
      }
    </MeetingMain>
  );
};

MeetingCheckin.propTypes = {
  atmosphere: PropTypes.object.isRequired,
  facilitatorName: PropTypes.string.isRequired,
  gotoNext: PropTypes.func.isRequired,
  isFacilitating: PropTypes.bool,
  localPhaseItem: PropTypes.number,
  showMoveMeetingControls: PropTypes.bool,
  styles: PropTypes.object,
  team: PropTypes.object,
  submitting: PropTypes.bool,
  submitMutation: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
};

const styleThunk = () => ({
  base: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem 0',
    width: '100%',

    [ui.breakpoint.wide]: {
      padding: '2rem 0'
    },

    [ui.breakpoint.wider]: {
      padding: '3rem 0'
    },

    [ui.breakpoint.widest]: {
      padding: '4rem 0'
    }
  },

  hint: {
    marginTop: '2.5rem'
  }
});

export default createFragmentContainer(
  withAtmosphere(withMutationProps(withStyles(styleThunk)(MeetingCheckin))),
  graphql`
    fragment MeetingCheckIn_team on Team {
      ...MeetingCheckInPrompt_team
      teamMembers(sortBy: "checkInOrder") {
        id
        isSelf
        preferredName
      }
    }`
);
