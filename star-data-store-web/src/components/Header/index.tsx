import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { Toolbar, Box, Menu } from '@mui/material'
import { getUserInfo, setUserInfo, removeUserInfo } from '@/utils/auth'
import MyDialog from '@/components/Dialog'
import MyPopover from '@/components/MyPopover'
import Button from '@/components/Button'
import Login from '@/pages/login'
import Popper from '@/components/Popper'
import SvgIcon from '@/components/SvgIcon'
import Register from '@/pages/register'
import { barHeight } from '@/config'
import logo from '@/assets/image/png/logo.png'
import avatar from '@/assets/image/png/avatar.png'
import { useSelector, useDispatch } from 'react-redux'
import { setLoginState } from '@/store/module/login'
import { setAllOrderVisibleSlice } from '@/store/module/allOrderVisible'
import Message from '@/components/Message'

import './header.scss'
import { t } from 'i18next'

// 自定义Header占位框
export const DrawerHeader = styled('div')(({ theme }) => ({
  height: barHeight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  ...theme.mixins.toolbar,
}))

// 自定义menu
export const MyMenu = styled(Menu)({
  '& .MuiPaper-root': {
    background: 'linear-gradient(180deg, #AEBDD8 0%, #7E98C8 85%, #8499BF 100%)',
    boxShadow: '0px 0px 8px 0px rgba(43,48,63,0.5000)',
    '& .MuiMenu-list': {
      padding: '3px 0',
    },
  },
})

//
export const MyToolbar = styled(Toolbar)({
  '@media(min-width: 600px)': {
    '.MuiToolbar-root': {
      padding: '16px',
    },
  },
})

export default function Header() {
  let loginState = useSelector((state: { login }) => state.login.value)

  const dispatch = useDispatch()
  // 用户信息
  let [userInfo, setUserInfo] = useState('')

  // i18n
  const { t } = useTranslation()
  // 路由跳转
  const navigate = useNavigate()
  // 打开登录框或者注册框
  const handleOpenBox = (type) => {
    dispatch(setLoginState({ isLogin: type == 'login' ? true : false, loginBoxOpen: true }))
  }

  useEffect(() => {
    setUserInfo(getUserInfo())
  }, [])

  // 登录成功
  const handleLoginSuccess = () => {
    dispatch(setLoginState({ isLogin: loginState.isLogin, loginBoxOpen: false }))
    setUserInfo(getUserInfo())
  }

  /* 跳转到订单信息页 */
  const handleJumpOrder = () => {
    // navigate('/all-orders')
    dispatch(setAllOrderVisibleSlice(true))
    // es列表请求中断
    ;(window as any).cancelRequest && (window as any).cancelRequest()
  }

  /* 退出登录 */
  const handleLogout = () => {
    removeUserInfo()
    setUserInfo('')
    Message({
      content: t('login.prompt.logoutSuccessMessage'),
      style: {
        marginTop: '120px',
        // marginLeft: '120px',
      },
    })
    dispatch(setAllOrderVisibleSlice(false))
    // navigate('/')
  }

  return (
    <Box position="relative" className="header">
      <Box
        className="bar"
        sx={{
          height: barHeight,
        }}
      >
        <Box className="box">
          {/*  onClick={() => navigate('/all-orders')} */}
          <img src={logo} className="logo" />
        </Box>
        <Box className="btn-box">
          {/* 用户未登录 */}
          {!userInfo ? (
            <>
              <span className="login_btn" onClick={() => handleOpenBox('login')}>
                {t('login.loginBtnText')}
              </span>
              <Button className="register_btn" onClick={() => handleOpenBox('register')}>
                {t('register.registerBtnText')}
              </Button>
            </>
          ) : (
            <Box className="login_state_box">
              <Popper
                textContent={t(`header.order`)}
                fontBoxStyle={{
                  background: 'rgba(0,0,0,0.6)',
                  display: 'inline-block',
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: 300,
                }}
              >
                <SvgIcon svgName="order_icon" svgClass="order" onClick={handleJumpOrder}></SvgIcon>
              </Popper>
              <UserInfoBox onLogout={handleLogout}></UserInfoBox>
            </Box>
          )}
        </Box>
      </Box>
      <MyDialog
        title={loginState.isLogin ? t('login.dialogTitle') : t('register.dialogTitle')}
        open={loginState.loginBoxOpen}
        onClose={() => {
          dispatch(setLoginState({ isLogin: loginState.isLogin, loginBoxOpen: false }))
        }}
        style={{
          height: '390px',
          width: '489px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {loginState.isLogin ? (
          <Login onGoRegister={() => handleOpenBox('register')} onSuccess={handleLoginSuccess} />
        ) : (
          <Register onGoLogin={() => handleOpenBox('login')} />
        )}
      </MyDialog>
    </Box>
  )
}

/* 用户信息 */
function UserInfoBox({ onLogout }) {
  let language = useSelector((state: { language }) => state.language.value)
  let anchorEl = useRef(null)
  let [openPopover, setOpenPopover] = useState(false)
  // let [anchorElp, setAnchorElp] = useState<HTMLElement | null>(null)
  /* 切换地图悬浮框按钮进入事件 */
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (openPopover) {
      setOpenPopover(false)
    } else {
      setOpenPopover(true)
    }
  }

  /* 取消 */
  const handleClose = () => {
    setOpenPopover(false)
  }

  /* 退出 */
  const handleLogout = () => {
    setOpenPopover(false)
    onLogout()
  }
  return (
    <>
      <Box ref={anchorEl} onClick={(e) => handlePopoverOpen(e)} className="avatar-box">
        {/* <img src={avatar} /> */}
        <div className="avatar">
          {getUserInfo() && getUserInfo().lastName ? (
            <span>{getUserInfo().lastName.slice(0, 1)}</span>
          ) : (
            <img src={avatar}></img>
          )}
        </div>
      </Box>
      <MyPopover
        id="mouse-over-popover"
        open={openPopover}
        anchorEl={anchorEl.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleClose}
        style={{
          marginTop: '10px',
          zIndex: 99999,
        }}
        // sx={{ pointerEvents: openPopover ? 'none' : 'auto' }}
        disableRestoreFocus
      >
        <Box className="user-info-box">
          <Box className="user-info">
            {/* <img src={avatar} alt="" /> */}
            <div className="avatar">
              {getUserInfo() && getUserInfo().lastName ? (
                <span>{getUserInfo().lastName.slice(0, 1)}</span>
              ) : (
                <img src={avatar}></img>
              )}
            </div>
            <Box className="userName-box">
              <p className="userName">
                {getUserInfo()
                  ? (language === 'zh' ? getUserInfo().lastName : getUserInfo().firstName) +
                    ' ' +
                    (language === 'zh' ? getUserInfo().firstName : getUserInfo().lastName)
                  : ''}
              </p>
              <p className="company">{getUserInfo() ? getUserInfo().company : ''}</p>
            </Box>
          </Box>
          <ul>
            <li>
              {`${t('header.userInfo.firstName')}`}
              <span>{getUserInfo() ? getUserInfo().firstName : ''}</span>
            </li>
            <li>
              {`${t('header.userInfo.lastName')}`}
              <span>{getUserInfo() ? getUserInfo().lastName : ''}</span>
            </li>
            <li>
              {`${t('header.userInfo.email')}`}
              <span>{getUserInfo() ? getUserInfo().email : ''}</span>
            </li>
            <li>
              {`${t('header.userInfo.company')}`}
              <span>{getUserInfo() ? getUserInfo().company : ''}</span>
            </li>
          </ul>
          <span className="logoutBtn" onClick={handleLogout}>
            {`${t('header.userInfo.logoutBtnText')}`}
          </span>
        </Box>
      </MyPopover>
    </>
  )
}
