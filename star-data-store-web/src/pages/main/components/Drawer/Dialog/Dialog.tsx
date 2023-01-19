import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Box, Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import MyDialog from '@/components/Dialog'
import Button, { LoadingButton } from '@/components/Button'
import Message from '@/components/Message'
import { saveOrder } from '@/api/order'
import { getUserInfo } from '@/utils/auth'
import moment from 'moment'
import map_icon from '@/assets/image/png/map_icon.png'
import empty from '@/assets/image/png/emptyRed.png'
import s from './Dialog.module.scss'

function index({ list, onClearBtn, onSubmitSuccess }, ref) {
  const { t } = useTranslation()

  /* 列参数 */
  let column = [
    {
      label: t('Dialog.imageName'),
      key: 'identifier',
    },
    {
      label: t('Dialog.satelliteName'),
      key: 'satelliteName',
    },
    {
      label: t('Dialog.centerTime'),
      key: 'centerTime',
    },
    {
      label: t('Dialog.resolutionRatio'),
      key: 'imageGSD',
    },
    {
      label: t('Dialog.cloudCoverage'),
      key: 'cloudCoverage',
    },
    {
      label: t('Dialog.rollSatelliteAngle'),
      key: 'rollSatelliteAngle',
    },
  ]
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
  let [loading, setLoading] = useState(false)

  /* 打开 */
  const handleOpen = (params, orderTyp) => {
    setData(params)
    setDialogOpen(true)
    // 订单类型
    setOrderType(orderTyp)
  }

  /* 提交订单按钮 */
  const handleClick = () => {
    // 记录选中的es数据
    let productJson = []
    list.forEach((item) => {
      let obj = {
        identifier: item.identifier,
        satelliteName: item.satelliteName,
      }
      productJson.push(obj)
    })
    // 表单参数
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
    // 传递参数
    let params = {
      orderInfo: JSON.stringify(formParams),
      orderType: orderType,
      productJson: JSON.stringify(productJson),
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
          onSubmitSuccess()
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

  /* 清除按钮 */
  const handleClearBtn = (item, index) => {
    onClearBtn(item, index)
  }
  return (
    <MyDialog
      title={t('Dialog.title.inventoryDialog')}
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false)
      }}
      style={{
        height: '700px',
        minWidth: '700px',
      }}
      maxWidth="md"
      fullWidth={true}
    >
      <Box className={s.reviewOrder}>
        {list.length > 0 ? (
          list.map((item, index) => {
            return (
              <Grid
                container
                spacing={{ xs: 1, md: 2, lg: 4 }}
                sx={{
                  mb: '40px',
                }}
              >
                <Grid item xs={3.8} spacing={{ xs: 1, md: 2, lg: 4 }}>
                  <img src={item.thumbnailUrl ? item.thumbnailUrl : map_icon} className={s.itemImg} />
                </Grid>
                <Grid item xs={8} spacing={{ xs: 1, md: 2, lg: 4 }} className={s.btnBox}>
                  {column.map((columnItem) => {
                    return (
                      <>
                        {columnItem.key === 'identifier' && (
                          <p className={s.item}>
                            <span className={s.label}>{columnItem.label}</span>
                            <span
                              className={s.content}
                              style={{
                                overflowWrap: 'break-word',
                              }}
                            >
                              {item[columnItem.key]}
                            </span>
                          </p>
                        )}
                        {columnItem.key === 'satelliteName' && (
                          <p className={s.item}>
                            <span className={s.label}>{columnItem.label}</span>
                            <span
                              className={s.content}
                              style={{
                                overflowWrap: 'break-word',
                              }}
                            >
                              {item[columnItem.key]}
                            </span>
                          </p>
                        )}
                        {columnItem.key === 'centerTime' && (
                          <p className={s.item}>
                            <span className={s.label}>{columnItem.label}</span>
                            <span
                              className={s.content}
                              style={{
                                overflowWrap: 'break-word',
                              }}
                            >
                              {moment(item[columnItem.key]).format('YYYY-MM-DD hh:mm')}
                            </span>
                          </p>
                        )}
                        {columnItem.key === 'imageGSD' && (
                          <p className={s.item}>
                            <span className={s.label}>{columnItem.label}</span>
                            <span
                              className={s.content}
                              style={{
                                overflowWrap: 'break-word',
                              }}
                            >
                              {item[columnItem.key]}m
                              {/* {item.columnItem.resolutionRatio.length > 0 &&
                                `${item.columnItem.resolutionRatio[0]}m ~ ${item.columnItem.resolutionRatio[1]}m`} */}
                            </span>
                          </p>
                        )}
                        {columnItem.key === 'cloudCoverage' && (
                          <p className={s.item}>
                            <span className={s.label}>{columnItem.label}</span>
                            <span
                              className={s.content}
                              style={{
                                overflowWrap: 'break-word',
                              }}
                            >
                              ≤{item[columnItem.key]}%
                            </span>
                          </p>
                        )}
                        {columnItem.key === 'rollSatelliteAngle' && (
                          <p className={s.item}>
                            <span className={s.label}>{columnItem.label}</span>
                            <span
                              className={s.content}
                              style={{
                                overflowWrap: 'break-word',
                              }}
                            >
                              {item['angle'] && item['angle'].rollSatelliteAngle}°
                            </span>
                          </p>
                        )}
                      </>
                    )
                  })}
                  <Button className={s.clearBtn} onClick={() => handleClearBtn(item, index)}>
                    {t('Dialog.btn.clear')}
                  </Button>
                </Grid>
              </Grid>
            )
          })
        ) : (
          <Box className={s.empty}>
            <img src={empty} style={{ width: '100px', height: '100px' }} />
            <p>{t('Dialog.empty')}</p>
          </Box>
        )}
        {/* 底部提交按钮 */}
        <div className={s.footer}>
          <span className={s.count}>{t('Dialog.countLabel').replace('%s', list.length)}</span>
          <LoadingButton className={s.btn} onClick={handleClick} disabled={list.length === 0} loading={loading}>
            {t('Dialog.btn.submitOrder')}
          </LoadingButton>
        </div>
      </Box>
    </MyDialog>
  )
}

export default forwardRef(index)
