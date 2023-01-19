import styled from '@emotion/styled'
import {
  TableCell,
  Pagination,
  TextField,
  Popover,
} from '@mui/material'

export const MyTableCell = styled(TableCell)({
  borderBottom: 'none',
  fontSize: '12px',
  fontWeight: 400,
  color: '#DDDDDD',
  // padding: '10px 10px',
  // boxShadow: 'inset 0px 0px 0px 0px rgba(174,189,216,0.2)',
  // height: '44px',
  boxSizing: 'border-box'
})

export const MyPagination = styled(Pagination)({
  '& .MuiButtonBase-root': {
    fontSize: '14px',
    fontWeight: 300,
    opacity: 0.6,
  },
  '& .Mui-disabled': {
    opacity: '0 !important',
  },
  '& .Mui-selected': {
    // background: 'rgba(255,255,255,0) !important',
    background: '#AEBDD8 !important',
    opacity: '1 !important',
    color: '#000 !important',
  },
  '& .MuiPaginationItem-root': {
    minWidth: '24px',
    height: '24px',
    color: '#999999',
    '&:hover': {
      background: 'none',
    },
  },
})

export const MyTextField = styled(TextField)({
  width: '35px',
  marginLeft: '5px',
  marginRight: '15px',
  '& .MuiOutlinedInput-root': {
    fontSize: '12px',
    fontWeight: 300,
    color: '#fff',
    width: '140%',
    height: '20px',

    '& fieldset': {
      border: 'none',
      background: '#232734',
      borderRadius: '2px',
      opacity: '0.6',
    },
    '& input': {
      textAlign: 'center',
      padding: '5px',
    },
  },
})

