import * as React from 'react'
import { styled } from '@mui/material/styles'
import { Radio } from '@mui/material'

const MyRadio = styled(Radio)(({ theme }) => ({
  color: '#fff',
  fill: '#fff',
  '&.Mui-checked': {
    color: '#fff',
  },
}))

export default MyRadio
