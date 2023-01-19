import React, { forwardRef, useImperativeHandle } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

function ResponsiveDialog({ title, content, onConfirm }, ref) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  useImperativeHandle(ref, () => ({
    handleClickOpen,
    handleClose,
  }))

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  /*  */
  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }
  return (
    <div>
      <Dialog
        style={{
          zIndex: 999999,
        }}
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            {t('allOrders.cancelBtnText')}
          </Button>
          <Button onClick={handleConfirm} autoFocus>
            {t('allOrders.confirmBtnText')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default forwardRef(ResponsiveDialog)
