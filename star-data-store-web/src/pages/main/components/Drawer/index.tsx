import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { Box, TableContainer, Table, TableHead, TableCell, TableRow, TableBody, Paper } from '@mui/material'
import axios from 'axios'
import Button from '@/components/Button'
import TableContent from './TableContent'
import { CSSTransition } from 'react-transition-group'
import { useTranslation } from 'react-i18next'
import SearchBar from '@/components/SearchBar'
import SwipeableViews from 'react-swipeable-views'
import Dialog from './Dialog/Dialog'
import CustomizationDialog from './Dialog/customizationDialog'
import { getESList } from '@/api/data'
import { getUserInfo } from '@/utils/auth'
import Message from '@/components/Message'
import { useDispatch } from 'react-redux'
import { setLoginState } from '@/store/module/login'
import { getPolygon } from '@/utils/data'
import { deepClone } from '@/utils/tool'
import './style.scss'

// 标签列表
let tabs = ['Drawer.tabs.inventoryData', 'Drawer.tabs.programmingData']

function index({ visible, getPolygonData, mapRef, onCheckItemChange }, ref) {
  const tableContentRef = useRef(null)
  const searchBarRef1 = useRef(null)
  const searchBarRef2 = useRef(null)
  const dialogRef = useRef(null)
  const customizationDialog = useRef(null)
  const dispatch = useDispatch()
  const cancelToken = axios.CancelToken
  const source = cancelToken.source()
  // i18n
  const { t } = useTranslation()
  // 选中状态
  const [active, setActive] = useState(0)
  // 滚动条状态
  const [scrollState, setScrollState] = useState(false)
  // 搜索参数
  // const [searchParams, setSearchParams] = useState({})
  const [inventorySearchParams, setInventorySearchParams] = useState({
    bottomRight: null,
    multiPoly: null,
    topLeft: null,
  })
  const [customizationSearchParams, setCustomizationSearchParams] = useState({})
  // 选中项的内容
  const [checkItem, setCheckItem] = useState([])
  // 查询列表
  let [listData, setListData] = useState([])
  // 加载状态
  let [loading, setLoading] = useState(false)
  /* 触底 */
  let [rebound, setRebound] = useState(false)
  // 全选
  let [allChecked, setAllChecked] = useState(false)
  // 表格第一次进入加载状态
  let [inventoryTableLoading, setInventoryTableLoading] = useState(false)
  // 分页
  const [page, setPage] = useState({
    pageSize: 15,
    pageNumber: 0,
    total: 0,
  })

  useImperativeHandle(ref, () => ({
    drawPolygonSuccess,
    removeParamspoylon,
  }))

  // tab点击事件
  const handleTabClick = (index) => {
    if (index !== active) {
      setActive(index)
      setScrollState(true)
      setTimeout(() => {
        setScrollState(false)
      }, 300)
      checkItem.forEach((item) => {
        item.checked && addOrRemovePolygon(item, !item.checked)
        item.checked && (item.checked = false)
      })
      setCheckItem([])
    }

    // 切换搜索es数据列表
    if (index == 0) {
      setTimeout(() => {
        searchBarRef1.current.handleConfromBtn('tabClick')
      }, 300)
    }
    /* 切换到定制就断开es请求 */
    if (index === 1) {
      ;(window as any).cancelRequest && (window as any).cancelRequest()
    }
    // 关闭下拉框
    searchBarRef1.current.handleCloseSearch()
    searchBarRef2.current.handleCloseSearch()
  }

  /* 获取数据接口 */
  function getESListData(params) {
    //由于接口请求慢，做了请求中断
    ;(window as any).cancelRequest && (window as any).cancelRequest()
    //请求参数
    let data = {
      bottomRight: params.bottomRight,
      cloudCoverage: params.cloudCoverage,
      startTime: new Date(params.startTime).getTime(),
      endTime: new Date(params.endTime).getTime(),
      productType: Number(params.productType),
      rollSatelliteAngle: params.rollSatelliteAngle,
      satelliteName: params.satelliteName,
      topLeft: params.topLeft,
      resolutionRatioStart: params.resolutionRatio[0],
      resolutionRatioEnd: params.resolutionRatio[1],
    }
    setLoading(true)
    // 对接数据接口
    getESList({ ...page, ...data })
      .then(({ data, code }: any) => {
        if (code === 200) {
          page.total = data.total
          // 遍历
          data.esdtos.forEach((element, index) => {
            element.checked = false
            element.id = page.pageNumber * 10 + index
          })
          // setCheckItem([...checkItem])
          setListData([...listData.concat(data.esdtos)])
          // 下一次数据请求条件
          page.pageNumber++
          setPage({ ...page })
          // 判断是否还有数据 到底问题
          if (page.pageNumber * page.pageSize > data.total) {
            setRebound(true)
          }
          // 关闭搜索栏
          handleCloseSearchBar()
        } else if (code === 20006) {
          Message({
            content: t('Drawer.message.timeOut'),
            style: {
              marginTop: '110px',
              marginLeft: '100px',
            },
          })
        }
      })
      .finally(() => {
        setInventoryTableLoading(false)
        setLoading(false)
      })
  }

  // 画图成功执行搜索一次数据
  function drawPolygonSuccess() {
    if (active === 0) {
      searchBarRef1.current.handleConfromBtn()
    }
  }

  /* 库存条件筛选栏中确认按钮 */
  const handleInventoryConfromClick = (params, type) => {
    let PolygonData = getPolygonData()
    if (!PolygonData.multiPoly) {
      if (type !== 'tabClick') {
        Message({
          content: t('Drawer.message.polygonNull'),
          style: {
            marginTop: '120px',
            marginLeft: '100px',
          },
        })
      }
      return false
    }

    setInventorySearchParams({ ...params, ...PolygonData })
    // 重置
    setInventoryTableLoading(true)
    page.pageNumber = 0
    page.total = 0
    setPage({ ...page })
    setRebound(false)
    listData = []
    setListData([...listData])
    checkItem.forEach((item) => {
      addOrRemovePolygon(item, false)
      item.checked = false
    })
    setCheckItem([])
    setAllChecked(false)
    // 搜索
    getESListData({ ...params, ...PolygonData })
  }

  /*编程定制条件筛选栏中确认按钮 */
  const handleCustomizationConfromClick = (params) => {
    let PolygonData = getPolygonData()
    if (!PolygonData.multiPoly) {
      Message({
        content: t('Drawer.message.polygonNull'),
        style: {
          marginTop: '120px',
          marginLeft: '100px',
        },
      })
      return false
    }

    // 数据存储
    setCustomizationSearchParams({ ...params, ...PolygonData })
    // 关闭弹出框
    // searchBarRef2.current.handleCloseSearch()
    /* 定制条件赛选 */
    handleCustomizationSubmit({ ...params, ...PolygonData })
    // tableContentRef.current.getESListData({ ...params, ...PolygonData })
  }

  /* 判断是否登录 */
  function hasLogin() {
    if (!getUserInfo() || !getUserInfo().id) {
      Message({
        content: t('Drawer.message.notLogin'),
        style: {
          marginTop: '120px',
          marginLeft: '100px',
        },
      })
      // 跳转登录
      setTimeout(() => {
        dispatch(setLoginState({ isLogin: true, loginBoxOpen: true }))
      }, 500)
      return false
    } else {
      return true
    }
  }

  /* 库存条件的提交订单按钮 */
  const handleInventorySubmit = () => {
    // 判断用户是否登录
    if (!hasLogin()) {
      return false
    }
    // 库存条件的时候监测筛选有没有变化
    // if (!searchBarRef1.current.handleConfromBtn()) {
    //   return false
    // }
    // 判断参数是否有
    if (JSON.stringify(inventorySearchParams) !== '{}') {
      if (!inventorySearchParams.bottomRight) {
        Message({
          content: t('Drawer.message.polygonNull'),
          style: {
            marginTop: '120px',
            marginLeft: '100px',
          },
        })
        return false
      }
      if (checkItem.length > 0) {
        dialogRef.current.handleOpen(inventorySearchParams, 0)
      } else {
        // 库存中的定制数据类型
        customizationDialog.current.handleOpen(inventorySearchParams, 1)
      }
    } else {
      Message({
        content: t('Drawer.message.screeningCondition'),
        style: {
          marginTop: '120px',
          marginLeft: '100px',
        },
      })
    }
  }

  /* 库存订单成功后事件 */
  const handleSubmitSuccess = () => {
    checkItem.forEach((item) => {
      addOrRemovePolygon(item, false)
      item.checked = false
    })
    setCheckItem([])
  }

  /* 定制条件的提交订单按钮 */
  const handleCustomizationSubmit = (params) => {
    // 判断用户是否登录
    if (!hasLogin()) {
      return false
    }
    // 定制条件的时候监测筛选有没有变化
    // if (!searchBarRef2.current.handleConfromBtn()) {
    //   return false
    // }
    // 判断参数是否有
    if (JSON.stringify(params) !== '{}') {
      customizationDialog.current.handleOpen(params, 1)
    } else {
      Message({
        content: t('Drawer.message.screeningCondition'),
        style: {
          marginTop: '120px',
          marginLeft: '100px',
        },
      })
    }
  }

  /* 表格下拉 */
  const handleScrollCapture = () => {
    setAllChecked(false)
    getESListData(inventorySearchParams)
  }

  /* 关闭搜索栏 */
  const handleCloseSearchBar = () => {
    searchBarRef1.current.handleCloseSearch()
    searchBarRef2.current.handleCloseSearch()
  }

  /* 监听选中的选项 */
  useEffect(() => {
    if (checkItem.length === listData.length && listData.length > 0) {
      setAllChecked(true)
    } else {
      setAllChecked(false)
    }
    onCheckItemChange(checkItem)
    if (mapRef) {
      if (checkItem.length > 0) {
        mapRef.disableGlobal()
      } else {
        mapRef.enableGlobal()
      }
    }
  }, [checkItem])

  /* 单选框事件 */
  const handleCheckBoxChange = (checked, row, i) => {
    addOrRemovePolygon(row, checked)
    if (checked) {
      /* 添加到选中数据表中 */
      checkItem.push(row)
      setCheckItem([...checkItem])
    } else {
      /* 在选中数据表中删除数据 */
      let index = checkItem.findIndex((element) => {
        return element.id === row.id
      })
      checkItem.splice(index, 1)
      setCheckItem([...checkItem])
    }
    mapRef.disableGlobal()
  }

  /* 表格全选按钮 */
  const handleAllCheck = (checked) => {
    listData.forEach((item) => {
      addOrRemovePolygon(item, checked)
      item.checked = checked
    })
    if (checked) {
      setCheckItem([...listData])
    } else {
      setCheckItem([])
    }
    setListData([...listData])
  }

  /* 添加和删除多边形 */
  function addOrRemovePolygon(item, checked) {
    if (checked) {
      if (!item.multiPolygonObj) {
        let footprint = item.footprint
        const coordinates = getPolygon(deepClone(footprint.coordinates), footprint.type)
        let multiPolygon = mapRef.addImageLayer(coordinates[0], item.thumbnailUrl)
        // let multiPolygon2 = mapRef.addLayer(coordinates, '#fff')
        let obj = {
          id: item.identifier,
          multiPolygon,
          // multiPolygon2,
        }
        item.multiPolygonObj = obj
      }
    } else {
      if (item.multiPolygonObj) {
        mapRef.removeLayer(item.multiPolygonObj.multiPolygon)
        item.multiPolygonObj = null
      }
    }

    // if (checkItem.length > 0) {
    //   mapRef.pm.disableGlobalEditMode()
    //   mapRef.pm.disableGlobalRemovalMode()
    // } else {
    //   mapRef.pm.enableGlobalEditMode()
    //   mapRef.pm.enableGlobalRemovalMode()
    // }
  }

  /* 提交弹出框中清除按钮 */
  const handleClearBtn = (row, index) => {
    checkItem[index].checked = false
    addOrRemovePolygon(row, false)
    checkItem.splice(index, 1)
    setCheckItem([...checkItem])
    setListData([...listData])
  }

  /* 清空选中的poylon */
  function removeParamspoylon() {
    inventorySearchParams.bottomRight = null
    inventorySearchParams.multiPoly = null
    inventorySearchParams.topLeft = null
    setCheckItem([])
    setListData([])
    setInventorySearchParams({ ...inventorySearchParams })
  }

  return (
    <CSSTransition
      in={visible}
      timeout={1000}
      // 前缀名注意S
      classNames="DrawerDimation"
    >
      <Box className="drawer-container">
        <Box>
          <Box className="tabs">
            {tabs.map((item, index) => {
              return (
                <p className={active == index ? 'active' : ''} onClick={() => handleTabClick(index)}>
                  {t(item)}
                </p>
              )
            })}
          </Box>
        </Box>

        {/* <Box className='tabTtem'> */}
        <SwipeableViews
          index={active}
          style={{
            height: '100%',
          }}
        >
          {/* 暂时无法解决 ref 问题 */}
          <div className="tab">
            {/* 查询栏 */}
            <div className="SearchBarBox">
              <SearchBar
                ref={searchBarRef1}
                className="SearchBar"
                postpone={active === 1}
                onConfrom={(params, type) => handleInventoryConfromClick(params, type)}
                loading={loading}
              ></SearchBar>
            </div>
            {/* 数据列表 */}
            <TableContent
              allCheckedValue={allChecked}
              list={listData}
              ref={tableContentRef}
              scrollState={scrollState}
              searchParams={inventorySearchParams}
              onScrollCapture={handleScrollCapture}
              loading={loading}
              rebound={rebound}
              onCheckBoxChange={handleCheckBoxChange}
              onAllCheck={handleAllCheck}
            ></TableContent>
            {/* 提交订单按钮 */}
            <Box className="drawer-footer">
              <p style={{}}>{t('Drawer.drawerFooter.label').replace('%s', `${checkItem.length}/${page.total}`)}</p>
              <Button className="btn" onClick={handleInventorySubmit}>
                {checkItem.length > 0
                  ? `${t('Drawer.drawerFooter.btn.submitOrder')}`
                  : `${t('Drawer.drawerFooter.btn.submitCustomOrder')}`}
              </Button>
            </Box>
          </div>

          <div className="tab">
            {/* 查询栏 */}
            <div className="SearchBarBox">
              <SearchBar
                ref={searchBarRef2}
                className="SearchBar"
                postpone={active === 1}
                onConfrom={handleCustomizationConfromClick}
              ></SearchBar>
            </div>
            {/* 数据列表 */}
            {/* <TableContent
              list={[]}
              allCheckedValue={false}
              postpone={active === 1}
              scrollState={scrollState}
              searchParams={customizationSearchParams}
              onScrollCapture={handleScrollCapture}
              loading={false}
              rebound={false}
              onCheckBoxChange={handleCheckBoxChange}
              onAllCheck={handleAllCheck}
            ></TableContent> */}
            {/* 提交订单按钮 */}
            {/* <Box className="drawer-footer">
              <p style={{}}>{t('Drawer.drawerFooter.label').replace('%s', `0/0`)}</p>
              <Button className="btn" onClick={handleCustomizationSubmit}>
                {t('Drawer.drawerFooter.btn.submitCustomOrder')}
              </Button>
            </Box> */}
          </div>
        </SwipeableViews>
        {/* </Box> */}

        {/* 弹出框 */}
        <Dialog
          ref={dialogRef}
          list={checkItem}
          onClearBtn={handleClearBtn}
          onSubmitSuccess={handleSubmitSuccess}
        ></Dialog>
        <CustomizationDialog ref={customizationDialog}></CustomizationDialog>
      </Box>
    </CSSTransition>
  )
}

export default forwardRef(index)
