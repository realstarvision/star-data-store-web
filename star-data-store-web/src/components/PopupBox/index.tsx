import React, { forwardRef, useImperativeHandle } from 'react'
import { Box, Divider, Fade } from '@mui/material'
import SvgIcon from '@/components/SvgIcon'
import './style.scss'

function index({
  children,
  coord = { top: '20px', right: '40px', left: '', bottom: '' },
  open,
  width = '100%',
  title = '操作',
  onClose,
  style,
}: {
  children?: any
  coord?: { top?: string; right?: string; left?: string; bottom?: string }
  open: boolean
  width?: string
  title?: string
  onClose?: Function
  style?: object
}) {
  /* 关闭icon */
  function handleClose() {
    onClose()
  }
  return (
    <Fade in={open}>
      <Box className={' popupBox-container'}>
        <Box
          className={' popupBox-content'}
          style={{
            width: width,
            top: coord.top,
            right: coord.right,
            left: coord.left,
            bottom: coord.bottom,
            ...style,
          }}
        >
          <Box className="title_bar">
            <span>{title}</span>
            <SvgIcon svgName="close" svgClass="close" onClick={handleClose}></SvgIcon>
          </Box>
          <Divider
            color="#424242"
            flexItem
            style={{
              marginBottom: '20px',
            }}
          ></Divider>
          {children}
        </Box>
      </Box>
    </Fade>
  )
}

export default forwardRef(index)
