import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { Box } from '@mui/material'
import SvgIcon from '@/components/SvgIcon'
import MyPopover from '@/components/MyPopover'

function index(
  {
    children,
    className,
    style,
    svgName,
    svgClass,
    anchorOrigin = {
      vertical: 'top',
      horizontal: 'left',
    },
    transformOrigin = {
      vertical: 'top',
      horizontal: 'left',
    },
    popoverStyle,
    contentClassName,
  }: {
    children: any
    className?: string
    style?: object
    svgName?: string
    svgClass?: string
    anchorOrigin?: {
      vertical: number | 'top' | 'bottom' | 'center'
      horizontal: number | 'center' | 'left' | 'right'
    }
    transformOrigin?: {
      vertical: number | 'top' | 'bottom' | 'center'
      horizontal: number | 'center' | 'left' | 'right'
    }
    popoverStyle?: object
    contentClassName?: string
  },
  ref
) {
  let anchorEl = useRef(null)
  let [openPopover, setOpenPopover] = useState(false)
  let [anchorElp, setAnchorElp] = useState<HTMLElement | null>(null)

  useImperativeHandle(ref, () => ({
    handleClose: () => {
      // event.stopPropagation()
      setOpenPopover(false)
      setAnchorElp(null)
    },
  }))

  /* 切换地图悬浮框按钮进入事件 */
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setOpenPopover(true)
  }

  /* 切换地图悬浮框按钮离开事件 */
  const handlePopoverClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setOpenPopover(false)
  }

  /* 切换地图悬浮框内容的进入事件 */
  const handlePopoverBoxEnter = (e) => {
    setAnchorElp(e.currentTarget)
  }

  /* 切换地图悬浮框内容的离开事件 */
  const handlePopoverBoxLeaver = (e) => {
    setAnchorElp(null)
  }

  return (
    <>
      <Box
        ref={anchorEl}
        className={className}
        sx={style}
        onMouseEnter={(e) => handlePopoverOpen(e)}
        onMouseLeave={(e) => handlePopoverClose(e)}
      >
        <SvgIcon svgName={svgName} svgClass={svgClass}></SvgIcon>
      </Box>

      <MyPopover
        id="mouse-over-popover"
        open={openPopover || Boolean(anchorElp)}
        anchorEl={anchorEl.current}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        sx={{ pointerEvents: openPopover ? 'none' : 'auto', ...popoverStyle }}
        disableRestoreFocus
      >
        <Box
          onMouseEnter={(e) => handlePopoverBoxEnter(e)}
          onMouseLeave={(e) => handlePopoverBoxLeaver(e)}
          className={contentClassName}
        >
          {children}
        </Box>
      </MyPopover>
    </>
  )
}

export default forwardRef(index)
