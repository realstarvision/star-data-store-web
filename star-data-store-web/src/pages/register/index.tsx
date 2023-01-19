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
import { emailVerify } from '@/utils/verify'
import { CSSTransition } from 'react-transition-group'
import { isEmail, register } from '@/api/user'
import Message from '@/components/Message'
import './style.scss'

function Home({ onGoLogin }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  let [eyeState, setEyeState] = useState({
    pwd: true,
    againPwd: true,
  })
  const [params, setParams] = useState({
    lastName: '',
    email: '',
    firstName: '',
    password: '',
    againPassword: '',
    company: '',
  })
  const [loading, setLoading] = useState(false)

  const [helperText, setHelperText] = useState('')

  /* 注册 */
  const handleRegister = async () => {
    setHelperText('')
    /* 邮箱验证 */
    let codeState = 0
    await isEmail({ email: params.email }).then(({ code, data }: any) => {
      codeState = data
    })
    // return false
    /* 判断错误状态 */
    if (!params.lastName || !params.email || !params.firstName || !params.password || !params.againPassword) {
      setHelperText(t('register.helperText.sentencedToEmpty'))
      return false
    } else if (params.email && !emailVerify(params.email)) {
      setHelperText(t('register.helperText.emailFormat'))
      return false
    } else if (!codeState) {
      setHelperText(t('register.helperText.existEmail'))
      return false
    } else if (params.password !== params.againPassword) {
      setHelperText(t('register.helperText.doublePassword'))
      return false
    } else {
      setHelperText('')
    }

    /* 注册接口 */
    setLoading(true)
    register(params).then(({ code }: any) => {
      setLoading(false)
      if (code === 200) {
        Message({
          content: t('register.prompt.success'),
          style: {
            marginTop: '120px',
          },
        })
        resetParams()
        onGoLogin()
      } else {
        setHelperText(t('register.prompt.error'))
      }
    })
  }

  /* 设置账户密码 */
  const handleInputChange = (e, type) => {
    params[type] = e.target.value
    setParams({ ...params })
  }

  /* 密码眼睛切换 */
  const handleEyeClick = (type) => {
    if (type === 'againPwd') {
      eyeState.againPwd = !eyeState.againPwd
    } else {
      eyeState.pwd = !eyeState.pwd
    }
    setEyeState({ ...eyeState })
  }

  /* 去登录页 */
  const handleGoLogin = () => {
    onGoLogin()
  }

  /*  重置数据 */
  function resetParams() {
    setParams({
      lastName: '',
      email: '',
      firstName: '',
      password: '',
      againPassword: '',
      company: '',
    })
  }
  return (
    <Box className="register-container">
      <Grid
        container
        // spacing={{ xs: 4 }}
        sx={{
          padding: '20px 0',
        }}
      >
        <Grid
          item
          xs={6}
          className="from-item"
          sx={{
            paddingBottom: '15px',
            paddingLeft: '0 !important',
          }}
        >
          <Input
            id="lastName"
            size="small"
            placeholder={t('register.inputPlaceholder.lastName')}
            // value={formParams.firstInput}
            onChange={(e) => handleInputChange(e, 'lastName')}
            autoComplete="off"
            sx={{
              width: '222px',
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          className="from-item"
          sx={{
            paddingBottom: '15px',
            paddingLeft: '0 !important',
          }}
        >
          <Input
            id="email"
            size="small"
            placeholder={t('register.inputPlaceholder.email')}
            // value={formParams.firstInput}
            onChange={(e) => handleInputChange(e, 'email')}
            autoComplete="off"
            sx={{
              width: '222px',
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          className="from-item"
          sx={{
            paddingBottom: '15px',
            paddingLeft: '0 !important',
          }}
        >
          <Input
            id="firstName"
            size="small"
            placeholder={t('register.inputPlaceholder.firstName')}
            // value={formParams.firstInput}
            onChange={(e) => handleInputChange(e, 'firstName')}
            autoComplete="off"
            sx={{
              width: '222px',
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          className="from-item"
          sx={{
            paddingBottom: '15px',
            paddingLeft: '0 !important',
          }}
        >
          <Input
            id="password"
            size="small"
            placeholder={t('register.inputPlaceholder.password')}
            // value={formParams.secondInput}
            onChange={(e) => handleInputChange(e, 'password')}
            autoComplete="off"
            sx={{
              width: '222px',
            }}
            type={eyeState.pwd ? 'password' : 'text'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SvgIcon
                    svgName={eyeState.pwd ? 'eye_hidden' : 'eye_visible'}
                    svgClass="icon"
                    onClick={() => handleEyeClick('pwd')}
                  ></SvgIcon>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          className="from-item"
          sx={{
            paddingLeft: '0 !important',
          }}
        >
          <Input
            id="company"
            size="small"
            placeholder={t('register.inputPlaceholder.company')}
            // value={formParams.firstInput}
            onChange={(e) => handleInputChange(e, 'company')}
            autoComplete="off"
            sx={{
              width: '222px',
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          className="from-item"
          sx={{
            paddingLeft: '0 !important',
          }}
        >
          <Input
            id="passwordInput"
            size="small"
            placeholder={t('register.inputPlaceholder.againPassword')}
            // value={formParams.secondInput}
            onChange={(e) => handleInputChange(e, 'againPassword')}
            autoComplete="off"
            sx={{
              width: '222px',
            }}
            type={eyeState.againPwd ? 'password' : 'text'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SvgIcon
                    svgName={eyeState.againPwd ? 'eye_hidden' : 'eye_visible'}
                    svgClass="icon"
                    onClick={() => handleEyeClick('againPwd')}
                  ></SvgIcon>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
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
            onClick={handleRegister}
            loading={loading}
            style={
              {
                width: '80%',
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
            {t('register.registerBtnText')}
          </LoadingButton>
        </Grid>
        <Grid item xs={12} className="from-item to_login">
          <span>
            {t('register.haveAccount')}
            <b onClick={handleGoLogin}>{t('register.TOLogin')}</b>
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
