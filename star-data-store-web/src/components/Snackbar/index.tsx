import { Snackbar, Box } from '@mui/material'
// import error from '@/assets/icons/png/error_orange_icon.png'
import './style.scss'

function Index({
  open,
  onClose,
  message,
  icon,
  background,
  color,
  duration,
  style,
}: {
  open: boolean
  onClose: Function
  message: string
  icon?: string
  background?: string
  color?: string
  duration?: number
  style?: object
}) {
  const handleClose = () => {
    onClose()
  }
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={handleClose}
      autoHideDuration={duration || 3000}
      sx={{ padding: '10px 20px', ...style, zIndex: 999999 }}
    >
      <Box
        className="snackbar"
        sx={{
          background: background || '',
          color: color || '',
          padding: '10px',
        }}
      >
        <img src={icon || ''} />
        <span> {message}</span>
      </Box>
    </Snackbar>
  )
}

export default Index
