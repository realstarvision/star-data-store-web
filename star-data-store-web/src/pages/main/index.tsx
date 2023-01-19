import React, { useState, useRef, useEffect } from 'react'
import { Box, Fade } from '@mui/material'
import ToolsBar from './components/ToolsBar'
import Map from '@/components/Map'
import ToggleMap from './components/ToggleMap'
import Drawer from './components/Drawer'
import Upload from '@/components/Upload'
import Guide from './components/Guide'
import AllOrders from '@/pages/allOrders'
import { getSatelliteList } from '@/api/satellite'
import { useSelector } from 'react-redux'

export default function index() {
  const map = useRef(null)
  const guideRef = useRef(null)
  const uploadRef = useRef(null)
  const drawerRef = useRef(null)
  let [step, setStep] = useState(1)
  let allOrderVisible = useSelector((state: { allOrderVisible }) => state.allOrderVisible.value)
  // 抽屉按钮状态
  let [drawerVisible, setDrawerVisible] = useState(false)
  // 选中的地图类型
  const [mapType, setMapType] = useState({})
  // geoJson 数据
  const [geojson, setGeojson] = useState()
  //
  const [checkItem, setCheckItem] = useState([])

  /* 地图控件操作 */
  const handleToolClick = (type) => {
    map.current.ControlBtn(type)
  }

  /* 打开引导 */
  function handleOpenGuide() {
    guideRef.current.handleOpen()
    // 关闭抽屉
    setDrawerVisible(false)
  }

  /* 获取地图的多边形数据 */
  const handleGetPolygonData = () => {
    // return
    return map.current.getRectangles()
  }

  /* 上传成功 */
  const handleUploadSuccess = (geojson) => {
    setGeojson(geojson)
    // 打开抽屉
    setDrawerVisible(true)
  }

  /* 地图上画图成功 */
  const handleDrawSuccess = (type) => {
    // 清除上传的文件
    if (type !== 'upload') {
      map.current.deleteUploadGeometry()
      uploadRef.current.handleDeleteFileName()
    }
    // // 清除上传的文件
    // handleDeleteFile()
    // 打开抽屉
    setDrawerVisible(true)
    // 执行搜索数据
    drawerRef.current.drawPolygonSuccess()
  }

  /* 上传的多边形改变事件(手动删除) */
  const handleChangeUploadGeometry = (geometry) => {
    if (geometry.length === 0) {
      uploadRef.current.handleDeleteFileName()
    }
  }

  /* 文件删除事件 */
  const handleDeleteFile = () => {
    map.current.deleteUploadGeometry()
    drawerRef.current.removeParamspoylon()
  }

  /* 手动清除地图上的矩形 */
  const handleManualRemove = () => {
    // 清除提交保存中画的矩形数据
    drawerRef.current.removeParamspoylon()
  }

  /* 选中项内容改变 */
  const handleCheckItemChange = (list) => {
    setCheckItem(list)
  }

  /* 上传工具的帮助按钮点击事件 */
  const handleUploadHelpClick = () => {
    // 打开引导页
    guideRef.current.handleOpen()
  }

  /* 引导页下一步按钮 */
  const handleGuideBtn = (step) => {
    setStep(step)
  }
  /*  */
  return (
    // <Provider>

    <Box
      style={{
        position: 'relative',
        height: '100%',
      }}
    >
      {/* <KeepAlive name={'main'} id={`main11`} cacheKey="UNIQUE_ID"> */}
      {/* 工具栏 */}
      <ToolsBar
        onToolClick={handleToolClick}
        drawerVisible={drawerVisible}
        setDrawerVisible={setDrawerVisible}
        onOpenGuide={handleOpenGuide}
        checkedList={checkItem}
      ></ToolsBar>

      {/* 地图 */}
      <Map
        ref={map}
        mapType={mapType}
        geojson={geojson}
        onChangeUploadGeometry={handleChangeUploadGeometry}
        onDrawSuccess={handleDrawSuccess}
        onManualRemove={handleManualRemove}
      ></Map>

      {/* 抽屉：数据 */}
      <Drawer
        visible={drawerVisible}
        getPolygonData={handleGetPolygonData}
        mapRef={map.current}
        ref={drawerRef}
        onCheckItemChange={handleCheckItemChange}
      ></Drawer>

      {/* 切换地图按钮 */}
      <ToggleMap setMapType={setMapType}></ToggleMap>

      {/* 引导页 */}
      <Guide ref={guideRef} onGuideBtn={handleGuideBtn}></Guide>

      {/* 查看订单列表 */}
      <AllOrders />

      {/* 上传文件 */}
      <Upload
        ref={uploadRef}
        show={true}
        onSuccess={handleUploadSuccess}
        onDeleteFile={handleDeleteFile}
        style={{
          bottom: '40px',
          right: '80px',
          zIndex: step === 1 ? 1000 : 999,
        }}
        onUploadHelpClick={handleUploadHelpClick}
      ></Upload>
      {/* </KeepAlive> */}
    </Box>
    // </Provider>
  )
}
