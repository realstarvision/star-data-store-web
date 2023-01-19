import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useParams, useRoutes, useNavigate } from 'react-router-dom'
import { Box, Grid } from '@mui/material'
import router, { whiteList } from './router'
import { getUserInfo, getLanguage, setLanguage } from '@/utils/auth'
import { useSelector, useDispatch } from 'react-redux'
import { setToolActive } from '@/store/module/toolActive'
import { CSSTransition } from 'react-transition-group'
import { useTranslation } from 'react-i18next'
import { setLanguageSlice } from '@/store/module/language'
// import KeepAlive, { withActivation, AliveScope } from 'react-activation'

import './App.scss'

function App() {
  let location = useLocation()
  let navigate = useNavigate()
  const dispatch = useDispatch()
  let { t, i18n } = useTranslation()
  /* 初始化 */
  useEffect(() => {
    if (!getLanguage()) {
      setLanguage('CN')
      i18n.changeLanguage('zh')
      dispatch(setLanguageSlice('zh'))
    } else {
      i18n.changeLanguage(getLanguage() == 'CN' ? 'zh' : 'en')
      dispatch(setLanguageSlice(getLanguage() == 'CN' ? 'zh' : 'en'))
    }
  }, [])

  // 路由守卫
  useEffect(() => {
    if (getUserInfo()) {
      if (location.pathname === '/') {
        navigate('/')
      }
    } else {
      if (!whiteList.includes(location.pathname)) {
        navigate('/')
      }
    }
  }, [location.pathname])

  return <Box className="app">{useRoutes(router)}</Box>
}

export default App
