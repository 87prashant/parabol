import styled from '@emotion/styled'
import React from 'react'
import {useLocation} from 'react-router'
import useRouter from '~/hooks/useRouter'
import getTeamIdFromPathname from '~/utils/getTeamIdFromPathname'
import {BezierCurve} from '../types/constEnums'
import FlatPrimaryButton from './FlatPrimaryButton'
import Icon from './Icon'

const Button = styled(FlatPrimaryButton)<{isOpen: boolean}>(({isOpen}) => ({
  height: 48,
  overflow: 'hidden',
  paddingLeft: isOpen ? 5 : 3,
  paddingRight: isOpen ? 5 : 3,
  width: isOpen ? 155 : 48,
  marginLeft: 10,
  marginTop: 15,
  marginBottom: 15,
  transition: `all 300ms ${BezierCurve.DECELERATE}`,
  justifyContent: 'flex-start'
}))

const MeetingIcon = styled(Icon)<{isOpen: boolean}>(({isOpen}) => ({
  marginLeft: isOpen ? 2 : 8,
  marginRight: isOpen ? 12 : 8,
  transition: `all 300ms ${BezierCurve.DECELERATE}`
}))

const MeetingLabel = styled('div')<{isOpen: boolean}>(({isOpen}) => ({
  fontSize: 16,
  fontWeight: 600,
  transition: `all 300ms ${BezierCurve.DECELERATE}`,
  opacity: isOpen ? 1 : 0
}))

const SideBarStartMeetingButton = ({isOpen}: {isOpen: boolean}) => {
  const location = useLocation()
  const teamId = getTeamIdFromPathname()
  const {history} = useRouter()

  const onClick = () => {
    history.replace(`/new-meeting/${teamId}`, {backgroundLocation: location})
  }
  return (
    <Button isOpen={isOpen} onClick={onClick}>
      <MeetingIcon isOpen={isOpen}>{'add'}</MeetingIcon>
      <MeetingLabel isOpen={isOpen}>Add Meeting</MeetingLabel>
    </Button>
  )
}

export default SideBarStartMeetingButton
