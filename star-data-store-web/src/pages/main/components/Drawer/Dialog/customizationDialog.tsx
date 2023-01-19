import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { Box, Grid, Paper } from '@mui/material'
import MyDialog from '@/components/Dialog'
import map_icon from '@/assets/image/png/map_icon.png'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import { MultilineInput } from '@/components/Input'
import { LoadingButton } from '@/components/Button'
import s from './Dialog.module.scss'
import Message from '@/components/Message'
import { saveOrder } from '@/api/order'
import { getUserInfo } from '@/utils/auth'
import { useTranslation } from 'react-i18next'

const EditDialogPaper = styled(Paper)({
  maxWidth: '772px',
})

function index({}, ref) {
  const { t } = useTranslation()
  /* 列参数 */
  let column = [
    {
      label: t('Dialog.area'),
      key: 'topLeft',
    },
    {
      label: t('Dialog.satelliteName'),
      key: 'satelliteName',
    },
    {
      label: t('Dialog.dateRange'),
      key: 'starTime',
    },
    {
      label: t('Dialog.resolutionRatio'),
      key: 'resolutionRatio',
    },
    {
      label: t('Dialog.cloudCoverage'),
      key: 'cloudCoverage',
    },
    {
      label: t('Dialog.rollSatelliteAngle'),
      key: 'rollSatelliteAngle',
    },
    {
      label: t('Dialog.remark'),
      key: 'remark',
    },
  ]
  /* 向外暴露 */
  useImperativeHandle(ref, () => ({
    handleOpen,
  }))

  // 弹出图像信息框
  let [dialogOpen, setDialogOpen] = useState(false)
  let [orderType, setOrderType] = useState(0)
  let [data, setData] = useState({
    startTime: null,
    endTime: null,
    cloudCoverage: 0,
    resolutionRatio: [0, 0],
    rollSatelliteAngle: 0,
    productType: 1,
    satelliteName: [],
    bottomRight: { lat: '', lon: '' },
    topLeft: { lat: '', lon: '' },
  })
  let [remark, setRemark] = useState('')
  let [loading, setLoading] = useState(false)

  /* 打开 */
  const handleOpen = (params, orderTyp) => {
    setData(params)
    setDialogOpen(true)
    // 订单类型
    setOrderType(orderTyp)
  }

  /* 输入框输入事件 */
  const handleMultilineInput = (e) => {
    setRemark(e.target.value)
  }

  /* 提交订单 */
  const handleSubmitClick = () => {
    let formParams = {
      bottomRight: data.bottomRight,
      cloudCoverage: data.cloudCoverage,
      startTime: new Date(data.startTime).getTime(),
      endTime: new Date(data.endTime).getTime(),
      productType: Number(data.productType),
      rollSatelliteAngle: data.rollSatelliteAngle,
      satelliteName: data.satelliteName,
      topLeft: data.topLeft,
      resolutionRatioStart: data.resolutionRatio[0],
      resolutionRatioEnd: data.resolutionRatio[1],
    }

    let params = {
      orderInfo: JSON.stringify(formParams),
      remark: remark,
      orderType: orderType,
      userId: getUserInfo() && getUserInfo().id,
    }
    setLoading(true)
    saveOrder(params)
      .then(({ code }: any) => {
        if (code === 200) {
          Message({
            content: t('Dialog.message.submitOrder'),
            style: {
              marginTop: '120px',
              marginLeft: '100px',
            },
          })
          setDialogOpen(false)
        } else if (code !== 20001) {
          Message({
            content: t('Dialog.message.submitOrderError'),
            style: {
              marginTop: '120px',
              marginLeft: '100px',
            },
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <MyDialog
      title={t('Dialog.title.customizationDialog')}
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false)
      }}
      style={{
        height: '650px',
        width: '770px',
      }}
      maxWidth={false}
      PaperComponent={EditDialogPaper}
    >
      <Box
        style={{
          padding: '33px 20px 45px 20px',
        }}
      >
        {column.map((item, index) => {
          return (
            <Grid
              container
              spacing={{ xs: 1, md: 2, lg: 4 }}
              sx={{
                mb: '20px',
              }}
            >
              <Grid item xs={2} spacing={{ xs: 1, md: 2, lg: 4 }}>
                <span
                  style={{
                    fontSize: '16px',
                  }}
                >
                  {item.label}
                </span>
              </Grid>
              <Grid item xs={10} spacing={{ xs: 1, md: 2, lg: 4 }}>
                {item.key === 'topLeft' && (
                  <span
                    style={{
                      fontSize: '16px',
                      overflowWrap: 'break-word',
                      lineHeight: '22px',
                    }}
                  >
                    {data['topLeft']
                      ? `[${data['topLeft'].lat},${data['topLeft'].lon}],[${data['bottomRight'].lat},${data['bottomRight'].lon}]`
                      : ''}
                  </span>
                )}
                {item.key === 'satelliteName' && (
                  <span
                    style={{
                      fontSize: '16px',
                      overflowWrap: 'break-word',
                      lineHeight: '18px',
                    }}
                  >
                    {data[item.key].map((item) => {
                      return <span>{item.satelliteName + '、'}</span>
                    })}
                  </span>
                )}
                {item.key === 'starTime' && (
                  <span
                    style={{
                      fontSize: '16px',
                    }}
                  >
                    {moment(data['starTime']).format('YYYY/MM/DD') +
                      ' - ' +
                      moment(data['endTime']).format('YYYY/MM/DD')}
                  </span>
                )}
                {item.key === 'resolutionRatio' && (
                  <span
                    style={{
                      fontSize: '16px',
                    }}
                  >
                    {data.resolutionRatio[1] === 10.1
                      ? 'All'
                      : `${data.resolutionRatio[0]}m ~ ${data.resolutionRatio[1]}m`}
                  </span>
                )}
                {item.key === 'cloudCoverage' && (
                  <span
                    style={{
                      fontSize: '16px',
                    }}
                  >
                    ≤{data[item.key]}%
                  </span>
                )}
                {item.key === 'rollSatelliteAngle' && (
                  <span
                    style={{
                      fontSize: '16px',
                    }}
                  >
                    {data[item.key]}°
                  </span>
                )}
                {item.key === 'remark' && (
                  <MultilineInput
                    onChange={handleMultilineInput}
                    placeholder={t('Dialog.input.remarkInputPlaceholder')}
                    type="text"
                    multiline
                    sx={{
                      width: '100%',
                    }}
                    rows={6}
                    maxRows={8}
                  />
                )}
              </Grid>
            </Grid>
          )
        })}
        <div className={s.footer}>
          <LoadingButton loading={loading} className={s.btn} onClick={handleSubmitClick}>
            {t('Dialog.btn.confirm')}
          </LoadingButton>
        </div>
      </Box>
    </MyDialog>
  )
}

export default forwardRef(index)
