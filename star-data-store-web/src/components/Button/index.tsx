import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import LoadingBtn from '@mui/lab/LoadingButton'

const MyButton = styled(Button)({
  // background: '#AEBDD8',
  letterSpacing: '0.5px',
  borderRadius: '4px',
  fontSize: '14px',
  // fontWeight: 300,
  color: '#fff',
  padding: '8px',
  height: '30px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  '&.Mui-disabled': {
    opacity: '0.5 !important',
  },
  '&:hover': {
    opacity: 0.8,
  },
  '&:active': {},
})

export const LoadingButton = styled(LoadingBtn)({
  letterSpacing: '0.5px',
  borderRadius: '4px',
  fontSize: '14px ',
  // fontWeight: 300,
  color: '#fff',
  padding: '8px',
  height: '30px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  '&:hover': {
    // background: '#2E6EDF',
    opacity: 0.8,
  },
  span: {
    color: '#fff',
  },
})

export default MyButton
