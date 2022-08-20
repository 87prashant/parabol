import styled from '@emotion/styled'
import {CheckBox, CheckBoxOutlineBlank, IndeterminateCheckBox} from '@mui/icons-material'
import React from 'react'
import {PALETTE} from '../styles/paletteV3'
interface Props {
  active: boolean | null
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
}

const StyledIcon = styled('div')<{disabled: boolean | undefined}>(({disabled}) => ({
  color: PALETTE.SLATE_600,
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'block',
  opacity: disabled ? 0.38 : 1,
  userSelect: 'none'
}))

const Checkbox = (props: Props) => {
  const {active, className, disabled, onClick} = props
  const icon = active
    ? 'check_box'
    : active === false
    ? 'check_box_outline_blank'
    : 'indeterminate_check_box'
  return (
    <StyledIcon className={className} disabled={disabled} onClick={disabled ? undefined : onClick}>
      {
        {
          check_box: <CheckBox />,
          check_box_outline_blank: <CheckBoxOutlineBlank />,
          indeterminate_check_box: <IndeterminateCheckBox />
        }[icon]
      }
    </StyledIcon>
  )
}

export default Checkbox
