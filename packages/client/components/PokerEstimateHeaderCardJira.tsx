import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React, {useState} from 'react'
import {createFragmentContainer} from 'react-relay'
import useBreakpoint from '~/hooks/useBreakpoint'
import {Elevation} from '~/styles/elevation'
import {PALETTE} from '~/styles/paletteV3'
import {Breakpoint} from '~/types/constEnums'
import JiraIssueId from '../shared/gqlIds/JiraIssueId'
import {ICON_SIZE} from '../styles/typographyV2'
import {DeepNonNullable} from '../types/generics'
import {PokerEstimateHeaderCardJira_stage} from '../__generated__/PokerEstimateHeaderCardJira_stage.graphql'
import CardButton from './CardButton'
import Icon from './Icon'
import IconLabel from './IconLabel'
const HeaderCardWrapper = styled('div')<{isDesktop: boolean}>(({isDesktop}) => ({
  display: 'flex',
  padding: isDesktop ? '0px 16px 4px' : '0px 8px 4px'
}))

const HeaderCard = styled('div')({
  background: PALETTE.WHITE,
  borderRadius: 4,
  boxShadow: Elevation.Z1,
  height: '100%',
  padding: '12px 16px',
  maxWidth: 1504, // matches widest dimension column 1600 - padding etc.
  margin: '0 auto',
  width: '100%'
})

const CardTitle = styled('h1')({
  fontSize: 16,
  lineHeight: '24px',
  margin: '0 0 8px'
})

const CardIcons = styled('div')({
  display: 'flex'
})

const CardTitleWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%'
})

const CardDescription = styled('div')<{isExpanded: boolean}>(({isExpanded}) => ({
  color: PALETTE.SLATE_700,
  fontWeight: 'normal',
  lineHeight: '20px',
  fontSize: 14,
  margin: 0,
  maxHeight: isExpanded ? 300 : 30,
  overflowY: isExpanded ? 'auto' : 'hidden',
  transition: 'all 300ms'
}))

const StyledIcon = styled(Icon)({
  fontSize: ICON_SIZE.MD18,
  paddingLeft: 4
})

const StyledLink = styled('a')({
  color: PALETTE.SKY_500,
  display: 'flex',
  fontSize: 12,
  lineHeight: '20px',
  marginTop: '10px',
  textDecoration: 'none'
})

const StyledLabel = styled('span')({
  fontSize: 12
})

interface Props {
  stage: PokerEstimateHeaderCardJira_stage
}
const PokerEstimateHeaderCardJira = (props: Props) => {
  const {stage} = props
  const {serviceTaskId, story} = stage
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }
  const isDesktop = useBreakpoint(Breakpoint.SIDEBAR_LEFT)
  if (!story) {
    // Jira is down, show something
    const {issueKey} = JiraIssueId.split(serviceTaskId)
    return (
      <HeaderCardWrapper isDesktop={isDesktop}>
        <HeaderCard>
          <CardTitleWrapper>
            <CardTitle>{`Jira is Down!`}</CardTitle>
          </CardTitleWrapper>
          <CardDescription isExpanded>
            {`Cannot connect to Jira. Voting will be disabled for ${issueKey}. If the problem persists, please reintegrate or remove the issue and add it again.`}
          </CardDescription>
        </HeaderCard>
      </HeaderCardWrapper>
    )
  }
  const {issueKey, summary, descriptionHTML, url} = story as DeepNonNullable<typeof story>
  return (
    <HeaderCardWrapper isDesktop={isDesktop}>
      <HeaderCard>
        <CardTitleWrapper>
          <CardTitle>{summary}</CardTitle>
          <CardIcons>
            <CardButton>
              <IconLabel icon='unfold_more' onClick={toggleExpand} />
            </CardButton>
          </CardIcons>
        </CardTitleWrapper>
        <CardDescription
          isExpanded={isExpanded}
          dangerouslySetInnerHTML={{__html: descriptionHTML}}
        />
        <StyledLink
          href={url}
          rel='noopener noreferrer'
          target='_blank'
          title={`Jira Issue #${issueKey}`}
        >
          <StyledLabel>{issueKey}</StyledLabel>
          <StyledIcon>launch</StyledIcon>
        </StyledLink>
      </HeaderCard>
    </HeaderCardWrapper>
  )
}

export default createFragmentContainer(PokerEstimateHeaderCardJira, {
  stage: graphql`
    fragment PokerEstimateHeaderCardJira_stage on EstimateStage {
      serviceTaskId
      story {
        ... on JiraIssue {
          issueKey
          summary
          descriptionHTML
          url
        }
      }
    }
  `
})
