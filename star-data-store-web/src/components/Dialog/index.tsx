import * as React from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  zIndex: '99999',
  '& .MuiDialog-paper': {
    // maxWidth: '100% !important',
  },

  '& .MuiDialogContent-root': {
    // padding: theme.spacing(7),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
    fontSize: '14px',
  },
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props
  return (
    <DialogTitle
      sx={{ m: 0, p: 2, textAlign: 'center', fontSize: '18px !important', background: '#3a3a3a' }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#9e9e9e',
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

// 弹出框
export default function CustomizedDialogs({
  children,
  title,
  open,
  onClose,
  className = '',
  style = {},
  boxStyle = {},
  ...other
}) {
  // const [open, setOpen] = React.useState(false)
  const handleClose = () => {
    onClose()
  }
  return (
    <BootstrapDialog
      // onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      style={boxStyle}
      {...other}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        {title}
      </BootstrapDialogTitle>
      <DialogContent
        className={className}
        dividers
        sx={{
          background: '#3a3a3a',
          padding: '0 !important',
          ...style,
        }}
      >
        {children}
      </DialogContent>
    </BootstrapDialog>
  )
}
