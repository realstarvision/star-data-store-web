import * as React from 'react'
import { styled } from '@mui/material/styles'
import { KeyboardDatePicker } from '@material-ui/pickers'

const MyKeyboardDatePicker = styled(KeyboardDatePicker)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
  },
  '& .MuiInput-underline': {
    '&:before': {
      borderColor: '#6D6D6D',
    },
    '&:after': {
      borderColor: '#fff',
    },
    '&:hover': {
      '&:not(.Mui-disabled):before': {
        borderColor: '#858585',
      },
    },
  },
}))

export default MyKeyboardDatePicker
