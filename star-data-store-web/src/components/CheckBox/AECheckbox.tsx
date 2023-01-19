import React, { forwardRef, useImperativeHandle } from 'react'
import { AEBpIcon, AEBpCheckedIcon } from './index'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'

const AECheckbox = (props: CheckboxProps, ref) => {
  useImperativeHandle(ref, () => ({}))
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

export default forwardRef(AECheckbox)
