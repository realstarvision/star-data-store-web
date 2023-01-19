import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Breadcrumbs, Link, Typography, Tabs, Fade } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Button from '@/components/Button'
import { styled } from '@mui/material/styles'
import Table, { Column } from '@/components/Table'
import SwipeableViews from 'react-swipeable-views'
import MyPopover from '@/components/MyPopover'
import { useSelector, useDispatch } from 'react-redux'
import { setAllOrderVisibleSlice } from '@/store/module/allOrderVisible'
import { getOrderListByUserId, findDelivery, updateOrderByOrderId } from '@/api/order'
import { getUserInfo } from '@/utils/auth'
import Message from '@/components/Message'
import Confirm from '@/components/Confirm'
import PopupBox from './PopupBox'
// import creatHistory from 'history/createHashHistory'  //返回上一页这段代码
import './style.scss'

const MyTab = styled(Tab)(({ theme }) => ({
  color: '#FFFFFF',
  fontSize: '18px',
  fontWeight: 300,
  // letterSpacing: '1.5px',
  // padding: '12px 25px',
  margin: '0 8px',
}))

export default function index() {
  let allOrderVisible = useSelector((state: { allOrderVisible }) => state.allOrderVisible.value)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const confirmRef = useRef(null)
  /* 标签名称 */
  let tabs = [
    { label: t('allOrders.tabs.allOrder'), key: 5 },
    { label: t('allOrders.tabs.confirm'), key: 0 },
    { label: t('allOrders.tabs.pay'), key: 1 },
    { label: t('allOrders.tabs.delivery'), key: 2 },
    { label: t('allOrders.tabs.accomplish'), key: 3 },
    { label: t('allOrders.tabs.cancel'), key: 4 },
  ]
  /* 表格参数 */
  let column: any = [
    {
      key: 'orderNo',
      title: t('allOrders.table.th.orderNo'),
      align: 'center',
      slot: function ({ row }: { row: any }) {
        return (
          <span
            style={{
              cursor: 'pointer',
              color: '#aebdd8',
              textDecoration: 'underline',
            }}
            onClick={() => handleTableRowClick(row)}
          >
            {row.orderNo}
          </span>
        )
      },
    },
    {
      key: 'orderType',
      title: t('allOrders.table.th.orderType'),
      align: 'center',
      slot: function ({ row }: { row: any }) {
        return (
          <span>
            {row.orderType === 0 ? t('allOrders.table.th.inventoryOrder') : t('allOrders.table.th.customizationOrder')}
          </span>
        )
      },
    },
    {
      key: 'createTime',
      title: t('allOrders.table.th.createTime'),
      align: 'center',
    },
    {
      key: 'orderState',
      title: t('allOrders.table.th.orderState'),
      align: 'center',
      slot: function ({ row }: { row: any }) {
        return (
          <span>
            {row.orderState === 0
              ? t('allOrders.tabs.confirm')
              : row.orderState === 1
              ? t('allOrders.tabs.pay')
              : row.orderState === 2
              ? t('allOrders.tabs.delivery')
              : row.orderState === 3
              ? t('allOrders.tabs.accomplish')
              : t('allOrders.tabs.cancel')}
          </span>
        )
      },
    },
    {
      key: 'operating',
      title: t('allOrders.table.th.operating'),
      align: 'center',
      slot: function ({ row }: { row: any }) {
        return row.orderState === 0 || row.orderState === 1 ? (
          <Button
            onClick={(e) => handleCancelOrder(e, row)}
            style={{
              // width: '96px',
              height: '26px',
              borderRadius: '4px',
              background: 'transparent',
              border: '1px solid #555555',
            }}
          >
            {t('allOrders.table.th.cancelBtnText')}
          </Button>
        ) : row.orderState === 3 ? (
          <Button
            onClick={(e) => handleCheck(e, row)}
            style={{
              // width: '96px',
              height: '26px',
              borderRadius: '4px',
              background: '#555555',
            }}
          >
            {t('allOrders.table.th.checkBtnText')}
          </Button>
        ) : (
          ''
        )
      },
    },
  ]

  const navigate = useNavigate()
  const [active, setActive] = React.useState(5)
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
    count: 10,
    total: 0,
    orderState: 5,
  })
  // 选中的dom
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  // 选中dom位置
  const [coord, setCoord] = useState({
    x: 0,
    y: 0,
  })
  // 选中的数据
  const [checkData, setCheckData] = useState({ orderState: -1 })
  const [loading, setLoading] = useState<boolean>(false)
  // 数据列表
  const [listData, setListData] = useState([])
  // 查看交付物
  const [delivery, setDelivery] = useState([])
  // 表格行的详情框状态
  let [openPopupBox, setOpenPopupBox] = useState(false)
  // 选中的数据
  // const [checkedData, setCheckedData] = useState({
  //   state: 0,
  //   name: '',
  //   company: '',
  // })

  // tabs 改变事件
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActive(Number(newValue))
    getList(1, page.pageSize, Number(newValue))
  }

  /* 初始化数据 */
  useEffect(() => {
    if (allOrderVisible) {
      getList(page.pageNumber, page.pageSize, active)
    }
  }, [allOrderVisible])

  /* 获取列表 */
  function getList(pageNumber, pageSize, orderState) {
    let params = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      userId: getUserInfo() && getUserInfo().id,
      orderState: orderState == 5 ? '' : orderState,
    }
    setLoading(true)
    getOrderListByUserId(params)
      .then(({ data, code }: any) => {
        if (code === 200) {
          setListData(data.records)
          page.total = data.total
          setPage({ ...page })
        }
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false)
        }, 300)
      })
  }

  // 页面改变事件
  const handlePageChange = (e: any, value: number) => {
    page.pageNumber = value
    setPage({ ...page })
    getList(value, page.pageSize, active)
  }

  /* 查看交付按钮 */
  const handleCheck = (e, row) => {
    console.log(row)
    findDelivery({ orderId: row.id }).then(({ data, code }: any) => {
      if (data) {
        setDelivery([...data])
      } else {
        setDelivery([])
      }
    })
    let coord = {
      x: e.pageX,
      y: e.pageY,
    }
    setCoord({ ...coord })
    setAnchorEl(e.target)
  }

  /* 取消订单按钮 */
  const handleCancelOrder = (e, row) => {
    setCheckData({ ...row })
    confirmRef.current.handleClickOpen()
    return false
  }
  /* 取消订单弹出框中确认按钮 */
  const handleConfirm = () => {
    checkData.orderState = 4
    updateOrderByOrderId(checkData).then(({ code }: any) => {
      if (code === 200) {
        confirmRef.current.handleClose()
        Message({ content: t('allOrders.cancelOrderMessage') })
        getList(page.pageNumber, page.pageSize, active)
      }
    })
  }

  // 弹出框取消事件
  const handleClose = () => {
    setAnchorEl(null)
    setTimeout(() => {
      setDelivery([])
    }, 300)
  }

  /* 每页条数切换 */
  const handleCountByPageChange = (e) => {
    page.pageSize = e.target.value
    getList(1, e.target.value, active)
  }

  /* 表格行的点击事件 */
  const handleTableRowClick = (row) => {
    setCheckData({ ...row })
    setOpenPopupBox(true)
  }
  return (
    <Fade in={allOrderVisible}>
      <Box className="allOrders-container" key={'allOrders-container'}>
        <Box className="allOrders-wapper">
          <Box className="crumbs">
            <Button
              className="btn"
              onClick={() => {
                dispatch(setAllOrderVisibleSlice(false))
              }}
            >
              {t('allOrders.backHomepageBtnText')}
            </Button>
          </Box>

          {/* 标签 */}
          <TabContext value={active.toString()}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} scrollButtons variant="scrollable">
                {tabs.map((item, index) => {
                  return <MyTab label={item.label} value={item.key.toString()} />
                })}
              </TabList>
            </Box>
            {/* <Box className='tabTtem'> */}
            <SwipeableViews
              index={active.toString()}
              style={{
                height: 'calc(100vh)',
              }}
            >
              {tabs.map((item) => {
                return (
                  <TabPanel
                    value={active.toString()}
                    style={{
                      padding: '24px 0',
                    }}
                    key={item.key.toString()}
                  >
                    <Table
                      data={listData}
                      columns={column as any}
                      pagination={page}
                      onPageChange={handlePageChange}
                      loading={loading}
                      onCountByPageChange={handleCountByPageChange}
                      stickyHeader={true}
                      tableContainerStyle={{
                        maxHeight: 'calc(100vh - 300px)',
                      }}
                    ></Table>
                  </TabPanel>
                )
              })}
            </SwipeableViews>
          </TabContext>

          <MyPopover
            sx={{
              top: coord.y + 5,
              left: coord.x - 118,
            }}
            style={{
              zIndex: 99999,
            }}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box className="allOrders_popover">
              {delivery.length > 0 ? (
                delivery.map((item) => {
                  return (
                    <a href={item.deliveryUrl} target="_blank">
                      {t('allOrders.deliveryUrlText')}
                      {item.deliveryUrl}
                    </a>
                  )
                })
              ) : (
                <div className="empty">{t('Table.emptyText')}</div>
              )}
            </Box>
          </MyPopover>
          <Confirm
            ref={confirmRef}
            title={t('allOrders.confirmTitle')}
            content={t('allOrders.confirmContent')}
            onConfirm={handleConfirm}
          />
          {/* 详情数据框 */}
          <PopupBox
            open={openPopupBox}
            onClose={() => {
              setOpenPopupBox(false)
            }}
            data={checkData}
          />
        </Box>
      </Box>
    </Fade>
  )
}
