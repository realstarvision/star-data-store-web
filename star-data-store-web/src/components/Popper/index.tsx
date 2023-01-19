import React, { useState } from 'react'
import { Popper, Fade, Box } from '@mui/material'

export default function index({
  children,
  textContent,
  style,
  className,
  fontBoxStyle,
}: {
  children: any
  textContent: string
  style?: object
  className?: string
  fontBoxStyle?: object
}) {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handlePopoverOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
    setOpen(true)
  }

  const handlePopoverClose = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  const canBeOpen = open && Boolean(anchorEl)
  const id = canBeOpen ? 'transition-popper' : undefined
  return (
    <Box
      sx={{
        ...style,
      }}
      className={className}
    >
      <Box
        aria-describedby={id}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        sx={{
          display: 'inline-block',
        }}
      >
        {children}
      </Box>
      <Popper
        id={'transition-popper'}
        open={open}
        anchorEl={anchorEl}
        transition
        placement="bottom"
        sx={{
          zIndex: 99999,
          mt: '15px !important',
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <span
              style={{
                // background: 'rgba(0,0,0,0.6)',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                padding: '3px 10px',
                ...fontBoxStyle,
              }}
            >
              {textContent}
            </span>
          </Fade>
        )}
      </Popper>
    </Box>
  )
}
