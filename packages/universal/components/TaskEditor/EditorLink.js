import PropTypes from 'prop-types'
import React, {Component} from 'react'
import ui from '../../styles/ui'

const baseStyle = {
  color: ui.colorText // TODO: theme-able?
}

const EditorLink = (getEditorState) =>
  class InnerEditorLink extends Component {
    static propTypes = {
      children: PropTypes.any,
      contentState: PropTypes.object.isRequired,
      entityKey: PropTypes.string,
      offsetkey: PropTypes.string,
      styles: PropTypes.object
    }

    state = {hasFocus: false}

    onClick = (e) => {
      const hasFocus = getEditorState()
        .getSelection()
        .getHasFocus()
      if (hasFocus) return
      e.preventDefault()
      const {contentState, entityKey} = this.props
      const {href} = contentState.getEntity(entityKey).getData()
      window.open(href, '_blank')
    }

    onMouseOver = () => {
      const hasFocus = getEditorState()
        .getSelection()
        .getHasFocus()
      if (this.state.hasFocus !== hasFocus) {
        this.setState({hasFocus})
      }
    }

    render () {
      const {offsetkey, children} = this.props
      const {hasFocus} = this.state
      const style = {
        ...baseStyle,
        cursor: hasFocus ? 'text' : 'pointer',
        textDecoration: 'underline'
      }
      return (
        <span
          data-offset-key={offsetkey}
          style={style}
          onMouseOver={this.onMouseOver}
          onMouseDown={this.onClick}
        >
          {children}
        </span>
      )
    }
  }

export default EditorLink
