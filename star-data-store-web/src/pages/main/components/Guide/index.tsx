import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Box, Fade } from '@mui/material'
import Button from '@/components/Button'
import { toolsBtnList } from '../ToolsBar'
import SvgIcon from '@/components/SvgIcon'
import { useTranslation } from 'react-i18next'
import { getLanguage } from '@/utils/auth'
import './style.scss'

// 图片
import guideZH from '@/assets/image/png/guideZH.png'
import guideEN from '@/assets/image/png/guideEN.png'
import guide3ZH from '@/assets/image/png/guide2ZH.png'
import guide3EN from '@/assets/image/png/guide2EN.png'
import guide2ZH from '@/assets/image/png/guide3ZH.png'
import guide2EN from '@/assets/image/png/guide3EN.png'
import messageBox from '@/assets/image/png/help_message_guide.png'
import guideOrderIcon from '@/assets/image/png/guideOrderIcon.png'

function index({ onGuideBtn }, ref) {
  const { t } = useTranslation()
  let [step, setStep] = useState(1)
  let [open, setOpen] = useState(false)
  let [image, setImage] = useState(guideZH)

  /* 向外暴露 */
  useImperativeHandle(ref, () => ({
    handleOpen,
  }))

  /* 初始化 */
  useEffect(() => {
    if (!localStorage.firstOpenStarDataStore) {
      setOpen(true)
    }
  }, [])

  useEffect(() => {
    if (open) {
      document.getElementById('guideCntainer').scrollTop = 0
      setStep(1)
    }
  }, [open])

  /* 打开 */
  const handleOpen = () => {
    setOpen(true)
  }

  /* 按钮 */
  const handleGuideBtn = () => {
    step++
    setStep(step)
    if (step > 3) {
      setStep(3)
      /* 记录引导页打开过 */
      !localStorage.firstOpenStarDataStore && (localStorage.firstOpenStarDataStore = true)
      // 关闭引导
      setOpen(false)
    }
    onGuideBtn(step)
  }

  useEffect(() => {
    getLanguage() === 'CN'
      ? step == 1
        ? setImage(guideZH)
        : step == 2
        ? setImage(guide2ZH)
        : setImage(guide3ZH)
      : step == 1
      ? setImage(guideEN)
      : step == 2
      ? setImage(guide2EN)
      : setImage(guide3EN)
  }, [getLanguage(), step])

  return (
    <Fade in={open} timeout={500}>
      <Box className="guide-container" id="guideCntainer">
        <img
          src={guideOrderIcon}
          className="guideOrderIconImg"
          style={{
            opacity: step === 3 ? 1 : 0,
          }}
        />
        <Box className="guide-wapper">
          {/* <SvgIcon svgName="guideOrderIcon" svgClass="guideOrderIcon"></SvgIcon> */}
          {/* 假的工具栏 */}
          <Box className="guide-tools-bar">
            <div
              style={{
                width: '48px',
              }}
            ></div>
            <div
              className="left"
              style={{
                opacity: step === 2 ? 1 : 0,
              }}
            >
              <SvgIcon svgName={'drawer_icon'} svgClass={'drawer_icon'}></SvgIcon>
            </div>
            <Box
              className="tool_icon-box"
              style={{
                opacity: step === 1 ? 1 : 0,
              }}
            >
              {toolsBtnList.map((btnItem) => {
                return <SvgIcon svgName={btnItem.icon} svgClass={'tool_icon'}></SvgIcon>
              })}
            </Box>
            <Box className="right">
              <SvgIcon svgName="help"></SvgIcon>
            </Box>
            <Box className={'message-box'}>
              <img src={messageBox} />
              <span>{t('guide.promptMessage')}</span>
            </Box>
          </Box>
          {/* 引导内容 */}
          <Box className="guide-box">
            <img src={image} />
            <Box className="btn-box">
              <Button
                onClick={() => handleGuideBtn()}
                style={{
                  color: '#333333',
                  width: '23%',
                  fontSize: '12px',
                  background: '#AEBDD8',
                  height: '25px',
                  borderRadius: '1px',
                }}
              >
                {step + '/3 ' + (step >= 3 ? t('guide.btnText') : t('guide.nextStep'))}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

export default forwardRef(index)
