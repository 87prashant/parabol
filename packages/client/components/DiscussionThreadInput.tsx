import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import {convertToRaw, EditorState, ContentState} from 'draft-js'
import useAtmosphere from '~/hooks/useAtmosphere'
import useMutationProps from '~/hooks/useMutationProps'
import useReplyEditorState from '~/hooks/useReplyEditorState'
import AddCommentMutation from '~/mutations/AddCommentMutation'
import React, {forwardRef, RefObject, useState, useRef} from 'react'
import {commitLocalUpdate, createFragmentContainer} from 'react-relay'
import {Elevation} from '~/styles/elevation'
import {ThreadSourceEnum} from '~/types/graphql'
import {MeetingTypeEnum} from '~/types/graphql'
import {SORT_STEP} from '~/utils/constants'
import dndNoise from '~/utils/dndNoise'
import convertToTaskContent from '~/utils/draftjs/convertToTaskContent'
import isAndroid from '~/utils/draftjs/isAndroid'
import {DiscussionThreadInput_meeting} from '~/__generated__/DiscussionThreadInput_meeting.graphql'
import anonymousAvatar from '../styles/theme/images/anonymous-avatar.svg'
import Avatar from './Avatar/Avatar'
import CommentSendOrAdd from './CommentSendOrAdd'
import CommentEditor from './TaskEditor/CommentEditor'
import {ReplyMention, SetReplyMention} from './ThreadedItem'
import EditCommentingMutation from '~/mutations/EditCommentingMutation'

const Wrapper = styled('div')<{isReply: boolean; isDisabled: boolean}>(({isDisabled, isReply}) => ({
  alignItems: 'center',
  borderRadius: isReply ? '4px 0 0 4px' : undefined,
  display: 'flex',
  boxShadow: isReply ? Elevation.Z2 : Elevation.DISCUSSION_INPUT,
  opacity: isDisabled ? 0.5 : undefined,
  marginLeft: isReply ? -12 : undefined,
  marginTop: isReply ? 8 : undefined,
  pointerEvents: isDisabled ? 'none' : undefined,
  // required for the shadow to overlay draft-js in the task cards
  zIndex: 0
}))

const CommentAvatar = styled(Avatar)({
  margin: 8,
  transition: 'all 150ms'
})

interface Props {
  editorRef: RefObject<HTMLTextAreaElement>
  getMaxSortOrder: () => number
  meeting: DiscussionThreadInput_meeting
  onSubmitCommentSuccess?: () => void
  threadSourceId: string
  threadParentId?: string
  isReply?: boolean
  isDisabled?: boolean
  setReplyMention?: SetReplyMention
  replyMention?: ReplyMention
  dataCy: string
}

const DiscussionThreadInput = forwardRef((props: Props, ref: any) => {
  const {
    editorRef,
    getMaxSortOrder,
    meeting,
    onSubmitCommentSuccess,
    threadSourceId,
    threadParentId,
    replyMention,
    setReplyMention,
    dataCy
  } = props
  const isReply = !!props.isReply
  const isDisabled = !!props.isDisabled
  const {id: meetingId, isAnonymousComment, teamId, viewerMeetingMember, meetingType} = meeting
  console.log('DiscussionThreadInput -> isAnonymousComment', isAnonymousComment)
  const {user} = viewerMeetingMember
  const {picture, preferredName} = user
  const [editorState, setEditorState] = useReplyEditorState(replyMention, setReplyMention)
  const atmosphere = useAtmosphere()
  const {submitting, onError, onCompleted, submitMutation} = useMutationProps()
  const [isCommenting, setIsCommenting] = useState(false)
  const placeholder = isAnonymousComment ? 'Comment anonymously' : 'Comment publicly'

  const threadSourceByMeetingType = {
    [MeetingTypeEnum.retrospective]: ThreadSourceEnum.REFLECTION_GROUP,
    [MeetingTypeEnum.action]: ThreadSourceEnum.AGENDA_ITEM
  }
  const threadSource = threadSourceByMeetingType[meetingType]

  const toggleAnonymous = () => {
    commitLocalUpdate(atmosphere, (store) => {
      const meeting = store.get(meetingId)
      if (!meeting) return
      meeting.setValue(!meeting.getValue('isAnonymousComment'), 'isAnonymousComment')
    })
    editorRef.current?.focus()
  }
  const [canCollapse, setCanCollapse] = useState(isReply)
  const hasText = editorState.getCurrentContent().hasText()
  const commentSubmitState = hasText ? 'send' : canCollapse ? 'add' : 'addExpanded'
  const collapseAddTask = () => {
    if (!canCollapse) {
      setCanCollapse(true)
    }
  }

  const addComment = (rawContent: string) => {
    submitMutation()
    const comment = {
      content: rawContent,
      isAnonymous: isAnonymousComment,
      meetingId,
      threadId: threadSourceId,
      threadParentId,
      threadSource: threadSource,
      threadSortOrder: getMaxSortOrder() + SORT_STEP + dndNoise()
    }
    AddCommentMutation(atmosphere, {comment}, {onError, onCompleted})
    // move focus to end is very important! otherwise ghost chars appear
    setEditorState(
      EditorState.moveFocusToEnd(
        EditorState.push(editorState, ContentState.createFromText(''), 'remove-range')
      )
    )
    onSubmitCommentSuccess?.()
  }

  const ensureCommenting = () => {
    collapseAddTask()
    if (isAnonymousComment || isCommenting) return
    EditCommentingMutation(atmosphere, {
      isCommenting: true,
      meetingId,
      preferredName,
      threadId: threadSourceId
    })
    setIsCommenting(true)
  }

  const ensureNotCommenting = () => {
    if (isAnonymousComment || !isCommenting) return
    EditCommentingMutation(atmosphere, {
      isCommenting: false,
      meetingId,
      preferredName,
      threadId: threadSourceId
    })
    setIsCommenting(false)
  }

  const onSubmit = () => {
    if (submitting) return
    const editorEl = editorRef.current
    if (isAndroid) {
      if (!editorEl || editorEl.type !== 'textarea') return
      const {value} = editorEl
      if (!value) return
      addComment(convertToTaskContent(value))
      return
    }
    const content = editorState.getCurrentContent()
    if (!content.hasText()) return
    addComment(JSON.stringify(convertToRaw(content)))
  }

  const avatar = isAnonymousComment ? anonymousAvatar : picture
  return (
    <Wrapper data-cy={`${dataCy}-wrapper`} ref={ref} isReply={isReply} isDisabled={isDisabled}>
      <CommentAvatar size={32} picture={avatar} onClick={toggleAnonymous} />
      <CommentEditor
        dataCy={`${dataCy}`}
        editorRef={editorRef}
        editorState={editorState}
        ensureCommenting={ensureCommenting}
        onBlur={ensureNotCommenting}
        onSubmit={onSubmit}
        placeholder={placeholder}
        setEditorState={setEditorState}
        teamId={teamId}
      />
      <CommentSendOrAdd
        dataCy={`${dataCy}`}
        getMaxSortOrder={getMaxSortOrder}
        commentSubmitState={commentSubmitState}
        meeting={meeting}
        threadSourceId={threadSourceId}
        threadParentId={threadParentId}
        threadSource={threadSource}
        collapseAddTask={collapseAddTask}
        onSubmit={onSubmit}
      />
    </Wrapper>
  )
})

export default createFragmentContainer(DiscussionThreadInput, {
  meeting: graphql`
    fragment DiscussionThreadInput_meeting on NewMeeting {
      ...CommentSendOrAdd_meeting
      id
      teamId
      meetingType
      isAnonymousComment
      viewerMeetingMember {
        user {
          picture
          preferredName
        }
      }
    }
  `
})
