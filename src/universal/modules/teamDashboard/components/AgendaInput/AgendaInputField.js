import {css} from 'aphrodite-local-styles/no-important'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import withHotkey from 'react-hotkey-hoc'
import {createFragmentContainer} from 'react-relay'
import Tooltip from 'universal/components/Tooltip/Tooltip'
import withAtmosphere from 'universal/decorators/withAtmosphere/withAtmosphere'
import AddAgendaItemMutation from 'universal/mutations/AddAgendaItemMutation'
import makeFieldColorPalette from 'universal/styles/helpers/makeFieldColorPalette'
import appTheme from 'universal/styles/theme/appTheme'
import ui from 'universal/styles/ui'
import {meetingSidebarGutter} from 'universal/styles/meeting'
import withStyles from 'universal/styles/withStyles'
import getNextSortOrder from 'universal/utils/getNextSortOrder'
import toTeamMemberId from 'universal/utils/relay/toTeamMemberId'
import makePlaceholderStyles from 'universal/styles/helpers/makePlaceholderStyles'
import Icon from 'universal/components/Icon'

const iconStyle = {
  color: appTheme.palette.warm70l,
  display: 'block',
  left: '1.625rem',
  pointerEvents: 'none',
  position: 'absolute',
  top: '.5625rem',
  zIndex: 200
}

const hasFocus = (element) => element && document.activeElement === element

class AgendaInputField extends Component {
  static propTypes = {
    atmosphere: PropTypes.object.isRequired,
    bindHotkey: PropTypes.func,
    disabled: PropTypes.bool,
    handleSubmit: PropTypes.func,
    input: PropTypes.object,
    afterSubmitAgendaItem: PropTypes.func.isRequired,
    setAgendaInputRef: PropTypes.func,
    styles: PropTypes.object,
    team: PropTypes.object.isRequired
  }

  componentDidMount () {
    const {disabled, bindHotkey} = this.props
    if (!disabled) {
      bindHotkey('+', this.focusOnInput)
    }
  }

  componentWillUpdate () {
    this.maybeSaveFocus()
  }

  componentDidUpdate () {
    this.maybeRefocus()
  }

  innerRef = (c) => {
    const {setAgendaInputRef} = this.props
    this.inputRef = c
    if (setAgendaInputRef) {
      setAgendaInputRef(c)
    }
  }

  inputRef = null
  refocusAfterUpdate = false

  focusOnInput = (e) => {
    e.preventDefault()
    if (this.inputRef) {
      this.inputRef.focus()
    }
  }

  handleAgendaItemSubmit = (submittedData) => {
    const {
      afterSubmitAgendaItem,
      atmosphere,
      team: {agendaItems, teamId}
    } = this.props
    const content = submittedData.agendaItem
    if (!content) return
    const newAgendaItem = {
      content,
      sortOrder: getNextSortOrder(agendaItems),
      teamId,
      teamMemberId: toTeamMemberId(teamId, atmosphere.userId)
    }
    AddAgendaItemMutation(atmosphere, newAgendaItem, null, afterSubmitAgendaItem)
  }

  makeForm = () => {
    const {disabled, handleSubmit, styles} = this.props
    const rootStyles = css(styles.root, disabled && styles.rootDisabled)
    const inputStyles = css(styles.input, !disabled && styles.inputNotDisabled)
    return (
      <form className={rootStyles} onSubmit={handleSubmit(this.handleAgendaItemSubmit)}>
        <input
          {...this.props.input}
          autoCapitalize='off'
          autoComplete='off'
          className={inputStyles}
          disabled={disabled}
          maxLength='63'
          onKeyDown={this.maybeBlur}
          placeholder='Add Agenda Topic…'
          ref={this.innerRef}
          type='text'
        />
        <Icon style={iconStyle}>add_circle</Icon>
      </form>
    )
  }

  makeTooltip = () => (
    <div style={{textAlign: 'center'}}>
      {'Add meeting topics to discuss,'}
      <br />
      {'like “upcoming vacation”'}
    </div>
  )

  maybeBlur = (e) => {
    if (e.key === 'Escape') {
      this.inputRef.blur()
    }
  }

  maybeRefocus = () => {
    if (this.inputRef && this.refocusAfterUpdate) {
      this.inputRef.focus()
      this.refocusAfterUpdate = false
    }
  }

  maybeSaveFocus = () => {
    if (hasFocus(this.inputRef)) {
      this.refocusAfterUpdate = true
    }
  }

  render () {
    const {
      disabled,
      team: {agendaItems}
    } = this.props

    const form = this.makeForm()
    const showTooltip = Boolean(agendaItems.length > 0 && !disabled)
    return (
      <div>
        {showTooltip ? (
          <Tooltip
            delay={1000}
            hideOnFocus
            tip={this.makeTooltip()}
            maxHeight={52}
            maxWidth={224}
            originAnchor={{vertical: 'top', horizontal: 'center'}}
            targetAnchor={{vertical: 'bottom', horizontal: 'center'}}
          >
            {form}
          </Tooltip>
        ) : (
          form
        )}
      </div>
    )
  }
}

const inputPlaceholderStyles = makePlaceholderStyles(appTheme.palette.warm)

const styleThunk = () => ({
  root: {
    backgroundColor: 'transparent',
    color: appTheme.palette.cool,
    fontSize: appTheme.typography.s3,
    padding: `0 ${meetingSidebarGutter}`,
    position: 'relative',
    width: '100%',
    zIndex: 100
  },

  rootDisabled: {
    ':hover': {
      backgroundColor: 'transparent'
    }
  },

  input: {
    ...ui.fieldBaseStyles,
    ...ui.fieldSizeStyles.medium,
    boxShadow: 'none',
    color: appTheme.palette.warm,
    cursor: 'not-allowed',
    display: 'block',
    fontSize: appTheme.typography.s3,
    fontWeight: 400,
    lineHeight: '1.5rem',
    margin: 0,
    outline: 'none',
    padding: '.5rem .5rem .5rem 3rem',
    position: 'relative',
    textIndent: '.1875rem',
    userSelect: 'none',
    width: '100%',
    zIndex: 200,
    ...makeFieldColorPalette('primary', false),
    ...inputPlaceholderStyles
  },

  inputNotDisabled: {
    cursor: 'text',
    ...makeFieldColorPalette('primary', true)
  }
})

export default createFragmentContainer(
  withAtmosphere(withHotkey(withStyles(styleThunk)(AgendaInputField))),
  graphql`
    fragment AgendaInputField_team on Team {
      teamId: id
      agendaItems {
        sortOrder
      }
    }
  `
)
