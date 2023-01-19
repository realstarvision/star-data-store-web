import React, { useEffect, useState, useRef } from 'react'
import { Box, Divider, Typography, FormLabel, MenuItem, Grid } from '@mui/material'
import PopupBox from '@/components/PopupBox'
import { useTranslation } from 'react-i18next'
import Button, { LoadingButton } from '@/components/Button'
import { MultilineInput } from '@/components/Input'
import SvgIcon from '@/components/SvgIcon'
import Popver from './popver'
import moment from 'moment'
import Table from '@/components/Table'
import Map from '@/components/Map'
import './style.scss'

// 图片

export default function index({ open, onClose, data }) {
  // i18n
  const { t } = useTranslation()
  // ref
  const mapRef = useRef(null)

  // 表单数据
  const [formParams, setFormParams] = useState({
    orderState: 0,
    orderInfo: '',
    orderType: 0,
    remark: '',
    communicationInfo: '',
    deliveryUrl: '',
    id: 0,
    orderFileDTO: [],
    orderNo: '',
  })

  // 表格列
  const columns = [
    {
      title: t('allOrders.orderInfo.columns.imageId'),
      key: 'identifier',
      align: 'center',
      slot: function ({ row }: { row: any }) {
        // return <Popver title={row.identifier} content={row.identifier} />
        return row.identifier
      },
    },
    {
      title: t('allOrders.orderInfo.columns.dataSource'),
      key: 'satelliteName',
      align: 'center',
    },
  ]

  /* 监听关闭重新初始化参数 */
  useEffect(() => {
    if (!open) {
      setFormParams({
        orderState: 0,
        orderInfo: '',
        orderType: 0,
        remark: '',
        communicationInfo: '',
        deliveryUrl: '',
        id: 0,
        orderFileDTO: [],
        orderNo: '',
      })
    } else {
      Object.keys(formParams).map((item) => {
        formParams[item] = data[item]
      })
      setFormParams({ ...formParams })
    }
  }, [open])

  /* 关闭弹窗 */
  function handleClose() {
    onClose()
  }

  // 判断是否为对象
  function isObject(data) {
    console.log(typeof data)
    if (typeof data === 'object') {
      return data.satelliteName
    } else {
      return data
    }
  }

  return (
    <PopupBox
      open={open}
      title={`${t('allOrders.orderInfo.orderType')}：${
        data.orderType === 0 ? t('allOrders.orderInfo.inventoryOrder') : t('allOrders.orderInfo.customizationOrder')
      }，${t('allOrders.orderInfo.orderId')}：${data.orderNo}`}
      onClose={handleClose}
      width="50%"
      coord={{ top: '50%', left: '50%' }}
      style={{
        transform: 'translate(-50%,-50%)',
        minWidth: '800px',
      }}
    >
      <Grid container className="order_popupBox-container">
        <Grid item xs={12} className="from-item">
          <Box className="area_img">
            <Map
              ref={mapRef}
              polygon={{
                topLeft: formParams.orderInfo && JSON.parse(formParams.orderInfo).topLeft,
                bottomRight: formParams.orderInfo && JSON.parse(formParams.orderInfo).bottomRight,
              }}
            />
          </Box>
          <Box className="grid-item">
            <FormLabel component="span" className="label">
              {t('allOrders.orderInfo.screeningCondition')}
            </FormLabel>
            <p className="content">
              <span>
                {t('allOrders.orderInfo.cloudCoverage')}≤
                {formParams.orderInfo && JSON.parse(formParams.orderInfo).cloudCoverage}%{' '}
                {t('allOrders.orderInfo.resolutionRatio')}：
                {formParams.orderInfo && JSON.parse(formParams.orderInfo).resolutionRatioEnd === 10.1
                  ? 'All'
                  : (formParams.orderInfo && JSON.parse(formParams.orderInfo).resolutionRatioStart) +
                    '～' +
                    (formParams.orderInfo && JSON.parse(formParams.orderInfo).resolutionRatioEnd) +
                    'm'}{' '}
                {t('allOrders.orderInfo.rollSatelliteAngle')}：0～
                {formParams.orderInfo && JSON.parse(formParams.orderInfo).rollSatelliteAngle}º
              </span>
              <br />
              <span>
                {t('allOrders.orderInfo.productType')}：
                {formParams.orderInfo &&
                  (JSON.parse(formParams.orderInfo).productType == 1
                    ? t('allOrders.orderInfo.productTypeList.radar')
                    : JSON.parse(formParams.orderInfo).productType == 2
                    ? t('allOrders.orderInfo.productTypeList.optics')
                    : t('allOrders.orderInfo.productTypeList.elevation'))}
              </span>
              <br />
              <span>
                {t('allOrders.orderInfo.timeFrame')}：
                {formParams.orderInfo && moment(JSON.parse(formParams.orderInfo).startTime).format('yyyy/MM/DD')}-
                {formParams.orderInfo && moment(JSON.parse(formParams.orderInfo).endTime).format('yyyy/MM/DD')}
              </span>
            </p>
          </Box>
          <Box className="grid-item">
            <FormLabel component="span" className="label">
              {t('allOrders.orderInfo.dataSource')}
            </FormLabel>
            <p
              className="content"
              style={{
                maxHeight: '100px',
                overflowY: 'auto',
              }}
            >
              <span>
                {formParams.orderInfo &&
                  JSON.parse(formParams.orderInfo).satelliteName.map((item, index) => {
                    return (
                      isObject(item) + (JSON.parse(formParams.orderInfo).satelliteName.length - 1 == index ? '' : '、')
                    )
                  })}
              </span>
              {/* <br />
              <span>无人机：UAC</span> */}
              <br />
            </p>
          </Box>
          <Box className="grid-item">
            <FormLabel component="span" className="label">
              {t('allOrders.orderInfo.orderData')}
            </FormLabel>
            {formParams.orderType === 0 ? (
              <Table
                data={formParams.orderFileDTO ? formParams.orderFileDTO : []}
                columns={columns as any}
                emptyHeight="150px"
                stickyHeader={true}
                tableContainerStyle={{
                  maxHeight: '190px',
                }}
              />
            ) : (
              // <span></span>
              <MultilineInput
                size="small"
                value={formParams.remark}
                autoComplete="off"
                multiline
                disabled
                rows={3}
                sx={{
                  width: '100%',
                }}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </PopupBox>
  )
}
