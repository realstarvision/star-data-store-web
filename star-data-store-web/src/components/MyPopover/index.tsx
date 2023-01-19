import styled from '@emotion/styled'
import { Popover } from '@mui/material'

const MyPopover = styled(Popover)({
  '& .MuiPaper-root': {
    background: 'transparent',
    boxShadow: 'none',
    fontSize: '12px',
  },
})

export default MyPopover
