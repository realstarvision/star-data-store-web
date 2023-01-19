import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import QRCodeCanvas from 'qrcode.react'
import { setToken, setUserInfo } from '@/utils/auth'
import SvgIcon from '@/components/SvgIcon'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, FormLabel, InputAdornment } from '@mui/material'
import { LoadingButton } from '@/components/Button'
import Input from '@/components/Input'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'
import { Login } from '@/api/user'
import Message from '@/components/Message'
import './style.scss'

function Home({ onGoRegister, onSuccess }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  let [eyeState, setEyeState] = useState(true)
  const [params, setParams] = useState({
    userName: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [helperText, setHelperText] = useState('')

  /* 登录 */
  const handleLogin = () => {
    setHelperText('')
    if (!params.userName || !params.password) {
      setHelperText(t('login.helperText.sentencedToEmpty'))
      return false
    } else {
      setHelperText('')
    }

    Login({ email: params.userName, password: params.password }).then(({ data, code, msg }: any) => {
      if (code === 200) {
        setUserInfo(data)
        Message({
          content: t('login.prompt.success'),
          style: {
            marginTop: '120px',
          },
        })
        onSuccess()
      } else if (code === 20002) {
        setHelperText(t('login.prompt.existence'))
      } else if (code === 20001) {
        setHelperText(t('login.prompt.lock'))
      } else {
        setHelperText(t('login.prompt.error'))
      }
    })
  }

  /* 键盘按下登录 */
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      handleLogin()
    }
  }

  /* 设置账户密码 */
  const handleUsernameChange = (e) => {
    params.userName = e.target.value
    setParams({ ...params })
  }
  const handlePasswordChange = (e) => {
    params.password = e.target.value
    setParams({ ...params })
  }

  /* 密码眼睛切换 */
  const handleEyeClick = () => {
    eyeState = !eyeState
    setEyeState(eyeState)
  }

  /* 去登录页 */
  const handleGoRegister = () => {
    onGoRegister()
  }
  return (
    <Box className="login-container">
      <Grid
        container
        spacing={{ xs: 4 }}
        sx={{
          padding: '20px 0',
          width: '400px !important',
        }}
      >
        <Grid item xs={12} className="from-item">
          <Input
            id="userInput"
            size="small"
            placeholder={t('login.inputPlaceholder.userName')}
            // value={formParams.firstInput}
            onChange={handleUsernameChange}
            // autoComplete="off"
            sx={{
              width: '321px',
            }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className="from-item"
          sx={{
            paddingTop: '15px !important',
          }}
        >
          <Input
            onKeyUp={handleKeyUp}
            id="passwordInput"
            size="small"
            placeholder={t('login.inputPlaceholder.password')}
            // value={formParams.secondInput}
            // helperText={helperText}
            onChange={handlePasswordChange}
            // autoComplete="off"
            sx={{
              width: '321px',
            }}
            type={eyeState ? 'password' : 'text'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SvgIcon
                    svgName={eyeState ? 'eye_hidden' : 'eye_visible'}
                    svgClass="icon"
                    onClick={handleEyeClick}
                  ></SvgIcon>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {/* <Grid
          item
          xs={12}
          className="from-item"
          sx={{
            paddingTop: '10px !important',
          }}
        ></Grid> */}
        <Grid
          item
          xs={12}
          className="from-item"
          sx={{
            paddingTop: '45px !important',
          }}
        >
          <LoadingButton
            // variant="outlined"
            onClick={handleLogin}
            loading={loading}
            style={
              {
                width: '321px',
                height: '36px',
                fontWeight: 500,
                color: '#333333',
                background: '#AEBDD8',
                '&:hover': {
                  background: '#AEBDD8',
                },
              } as any
            }
          >
            {t('login.loginBtnText')}
          </LoadingButton>
        </Grid>

        <Grid item xs={12} className="from-item to_login">
          <span>
            {t('login.noAccount')}
            <b onClick={handleGoRegister}>{t('login.TORegiter')}</b>
          </span>
        </Grid>
        <CSSTransition
          in={Boolean(helperText)}
          //动画时间
          timeout={1000}
          // 前缀名注意S
          classNames="DeclineIn"
        >
          <span className="verify_text">{helperText}</span>
        </CSSTransition>
      </Grid>
    </Box>
  )
}

export default Home
