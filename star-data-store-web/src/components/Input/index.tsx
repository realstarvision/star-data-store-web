import React from 'react'
import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

const Input = styled(TextField)({
  '& .MuiFormHelperText-root': {
    position: 'absolute',
    bottom: '-23px',
  },
  // '& input': {
  //   paddimg: '0 !important',
  // },
  input: {
    paddingLeft: '0 !important',
  },

  '& .MuiOutlinedInput-root': {
    letterSpacing: '0.5px',
    fontSize: '12px',
    fontWeight: 300,
    color: '#fff',
    width: '100%',
    height: '36px',
    paddingLeft: '14px !important',
    background: '#5F5F5F',
    borderRadius: '4px',
    input: {
      '&::-webkit-input-placeholder': {
        color: '#9e9e9e',
      },
      '&:-ms-input-placeholder': {
        color: '#9e9e9e',
      },
      caretColor: '#ccc',
    },
    '& fieldset': {
      border: 'none',
      background: 'transparent',
      borderRadius: '4px',
    },
  },
  '& .MuiPopover-root': {
    '& .MuiPaper-root': {
      background: '#353B4D',
      '& .MuiMenu-list': {
        height: '200px !important',
      },
    },
  },
})

export const MultilineInput = styled(TextField)({
  '& .MuiFormHelperText-root': {
    position: 'absolute',
    bottom: '-23px',
  },
  input: {
    paddingLeft: '0 !important',
  },
  '& .MuiOutlinedInput-root': {
    letterSpacing: '0.5px',
    fontSize: '14px',
    fontWeight: 300,
    color: '#fff',
    width: '100%',
    paddingLeft: '14px !important',
    background: '#5F5F5F',
    borderRadius: '4px',
    input: {
      '&::-webkit-input-placeholder': {
        color: '#9e9e9e',
      },
      '&:-ms-input-placeholder': {
        color: '#9e9e9e',
      },
      caretColor: '#ccc',
    },
    '& fieldset': {
      border: 'none',
      background: 'transparent',
      borderRadius: '4px',
    },
  },
  '& .MuiPopover-root': {
    zIndex: 9999999999,
    '& .MuiPaper-root': {
      zIndex: 9999999999,
      background: '#353B4D',
      '& .MuiMenu-list': {
        height: '200px !important',
      },
    },
  },
})

export const MyInput = styled(TextField)({
  '& .MuiFormHelperText-root': {
    position: 'absolute',
    bottom: '-23px',
  },
  input: {
    paddingLeft: '0 !important',
  },
  '& .MuiOutlinedInput-root': {
    letterSpacing: '0.5px',
    fontSize: '14px',
    fontWeight: 300,
    color: '#FFFFFF',
    width: '100%',
    height: '32px',
    padding: '14px !important',
    '& fieldset': {
      border: 'none',
      background: '#5F5F5F',
      borderRadius: '2px',
      opacity: '0.6',
    },
  },
  '& .MuiPopover-root': {
    zIndex: 9999999999,
    '& .MuiPaper-root': {
      zIndex: 9999999999,
      background: '#353B4D',
      '& .MuiMenu-list': {
        height: '200px !important',
      },
    },
  },
})

export default Input
