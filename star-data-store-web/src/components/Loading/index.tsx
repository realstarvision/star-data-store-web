import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

export default function Loading({ show }: { show?: boolean }) {
  return (
    <Box
      sx={{
        display: show ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '1000',
        backdropFilter: 'blur(10px)',
      }}
    >
      <CircularProgress />
    </Box>
  )
}
