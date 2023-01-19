import React, { forwardRef, useImperativeHandle } from 'react'
import { styled } from '@mui/material/styles'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'

const BpIcon = styled('span')(({ theme }) => ({
  position: 'relative',
  borderRadius: '50%',
  width: 10,
  height: 10,
  backgroundColor: 'transparent',
  border: '1px solid rgba(255,255,255)',
  '.Mui-focusVisible &': {
    outlineOffset: 2,
  },
  'input:hover ~ &': {},
  'input:disabled ~ &': {
    boxShadow: 'none',
  },
}))

const BpCheckedIcon = styled(BpIcon)({
  '&:after': {
    content: '""',
    // zIndex: 10,
    position: 'absolute',
    left: '50%',
    top: '20%',
    transform: 'translate(-50%)',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#fff',
  },
  boxShadow: '0px 0px 8px 0px rgba(43,48,63,0.5)',
  'input:hover ~ &': {},
})

// Inspired by blueprintjs
export default function BpCheckbox(props: CheckboxProps) {
  return (
    <Checkbox
      sx={{
        p: 0,
      }}
      disableRipple
      color={props.color}
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  )
}

export const AEBpIcon = styled(BpIcon)({
  borderColor: ' #AEBDD8 !important',
})

export const AEBpCheckedIcon = styled(BpCheckedIcon)({
  '&:after': {
    background: '#AEBDD8 ',
  },
  borderColor: ' #AEBDD8 !important',
})

// Inspired by blueprintjs
export const AECheckbox = (props: CheckboxProps) => {
  return (
    <Checkbox
      sx={{
        p: 0,
      }}
      disableRipple
      color={props.color}
      checkedIcon={<AEBpCheckedIcon />}
      icon={<AEBpIcon />}
      {...props}
    />
  )
}
