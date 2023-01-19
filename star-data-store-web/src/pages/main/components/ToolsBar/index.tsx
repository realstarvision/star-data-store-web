import React, { useEffect, useState, useRef, RefObject, useImperativeHandle, forwardRef } from 'react'
import { Box } from '@mui/material'
import SvgIcon from '@/components/SvgIcon'
import Popper from '@/components/Popper'
import { useTranslation } from 'react-i18next'
import Input from '@/components/Input'
import { styled } from '@mui/material/styles'
import { setLanguage, getLanguage } from '@/utils/auth'
import { useSelector, useDispatch } from 'react-redux'
import { setToolActive } from '@/store/module/toolActive'
import { CSSTransition } from 'react-transition-group'
import { setLanguageSlice } from '@/store/module/language'
import './style.scss'

// 语言
import EN from '@/assets/image/language/en.png'
import CN from '@/assets/image/language/cn.png'

// 工具操作按钮列表
export let toolsBtnList = [
  {
    type: 'Rectangle',
    popperText: 'ToolBar.rectangle',
    icon: 'rectangular',
    class: 'Rectangle',
  },
  {
    type: 'Polygon',
    popperText: 'ToolBar.Polygon',
    icon: 'polygon',
    class: 'Polygon',
  },
  {
    type: 'Edit',
    popperText: 'ToolBar.Edit',
    icon: 'edit',
    class: 'Edit',
  },
  {
    type: 'Clear',
    popperText: 'ToolBar.Clear',
    icon: 'clear',
    class: 'Clear',
  },
]

function index({ onToolClick, setDrawerVisible, drawerVisible, onOpenGuide, checkedList }, ref) {
  const dispatch = useDispatch()
  let { t, i18n } = useTranslation()
  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(ref, () => ({}))

  /* 控件单击事件 */
  const handleToolClick = (type) => {
    console.log()
    if (checkedList.length > 0 && (type == 'Edit' || type == 'Clear')) {
      return
    }
    dispatch(setToolActive(type))
    onToolClick(type)
  }

  /* 切换语言 */
  const handleToggleLanguage = () => {
    if (getLanguage() === 'CN') {
      setLanguage('EN')
      dispatch(setLanguageSlice('en'))
    } else {
      setLanguage('CN')
      dispatch(setLanguageSlice('zh'))
    }
    i18n.changeLanguage(getLanguage() == 'CN' ? 'zh' : 'en')

    // window.location.reload()
  }

  /* 抽屉按钮的点击事件 */
  const handleDrawerIconClick = () => {
    setDrawerVisible(!drawerVisible)
  }
  return (
    <>
      <Box className="tools-bar">
        {/* 动画联动让 工具栏缩放 */}
        <CSSTransition in={drawerVisible} timeout={1000} classNames="DrawerIcon">
          <Box
            style={{
              width: '0',
            }}
          ></Box>
        </CSSTransition>
        {/* 按钮部分 */}
        <Box className="tools-box">
          {/* 抽屉按钮 */}
          <Popper textContent={t(`ToolBar.DrawerBtn`)} className="drawer_icon">
            <SvgIcon svgName="drawer_icon" svgClass={' tool_icon'} onClick={handleDrawerIconClick}></SvgIcon>
          </Popper>

          {/* 操作列表按钮 */}
          <Box className="tool_icon-box">
            {toolsBtnList.map((btnItem) => {
              return (
                <ToolBtn btnItem={btnItem} onToolClick={handleToolClick} disabled={checkedList.length > 0}></ToolBtn>
              )
            })}
          </Box>

          <Box className="right">
            {/* 语言切换按钮 */}
            <Popper textContent={t(`ToolBar.Language`)} className="language">
              <img
                src={getLanguage() && getLanguage() == 'EN' ? CN : EN}
                className="tool_icon"
                onClick={handleToggleLanguage}
              />
            </Popper>
            {/* 帮助按钮 */}
            <Popper textContent={t(`ToolBar.help`)}>
              <SvgIcon
                svgName="help"
                svgClass="help tool_icon"
                onClick={() => {
                  onOpenGuide()
                }}
              ></SvgIcon>
            </Popper>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default forwardRef(index)

/* 按钮 */
function ToolBtn({ btnItem, onToolClick, disabled }) {
  let { t } = useTranslation()
  let toolActive = useSelector((state: { toolActive }) => state.toolActive.value)

  const handleToolClick = (type) => {
    onToolClick(type)
  }

  return (
    <Popper textContent={t(`${btnItem.popperText}`)}>
      <SvgIcon
        svgName={btnItem.icon}
        svgClass={(toolActive == btnItem.class ? 'active' : '') + ' tool_icon'}
        onClick={() => handleToolClick(btnItem.type)}
        style={{
          opacity: disabled && (btnItem.type == 'Edit' || btnItem.type == 'Clear') ? 0.3 : '',
        }}
      ></SvgIcon>
    </Popper>
  )
}
