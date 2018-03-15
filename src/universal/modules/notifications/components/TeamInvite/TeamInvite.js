import {css} from 'aphrodite-local-styles/no-important';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {createFragmentContainer} from 'react-relay';
import Button from 'universal/components/Button/Button';
import IconAvatar from 'universal/components/IconAvatar/IconAvatar';
import Row from 'universal/components/Row/Row';
import defaultStyles from 'universal/modules/notifications/helpers/styles';
import AcceptTeamInviteMutation from 'universal/mutations/AcceptTeamInviteMutation';
import ui from 'universal/styles/ui';
import withStyles from 'universal/styles/withStyles';
import {withRouter} from 'react-router-dom';

const TeamInvite = (props) => {
  const {
    atmosphere,
    dispatch,
    history,
    styles,
    notification,
    submitting,
    submitMutation,
    onError,
    onCompleted
  } = props;
  const {notificationId, inviter: {inviterName}, team} = notification;
  const {teamName} = team;
  const accept = () => {
    submitMutation();
    AcceptTeamInviteMutation(atmosphere, {notificationId}, {dispatch, history}, onError, onCompleted);
  };

  return (
    <Row compact>
      <div className={css(styles.icon)}>
        <IconAvatar icon="users" size="small" />
      </div>
      <div className={css(styles.message)}>
        {'You have been invited by '}
        <b>{inviterName}</b>
        {' to join '}
        <b>{teamName}</b>
        {'.'}
      </div>
      <div className={css(styles.button)}>
        <Button
          aria-label="Accept team invitation"
          buttonSize={ui.notificationButtonSize}
          colorPalette="warm"
          isBlock
          label="Accept"
          onClick={accept}
          title="Accept team invitation"
          type="submit"
          waiting={submitting}
        />
      </div>
    </Row>
  );
};

TeamInvite.propTypes = {
  atmosphere: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  onCompleted: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  styles: PropTypes.object,
  submitMutation: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  notification: PropTypes.object.isRequired
};

const styleThunk = () => ({
  ...defaultStyles
});

export default createFragmentContainer(
  connect()(withRouter(withStyles(styleThunk)(TeamInvite))),
  graphql`
    fragment TeamInvite_notification on NotifyTeamInvite {
      notificationId: id
      inviter {
        inviterName: preferredName
      }
      team {
        teamName: name
      }
    }`
);
