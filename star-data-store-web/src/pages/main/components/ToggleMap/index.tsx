import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { getMapList } from '@/api/map'
import PopoverBtn from '@/components/PopoverBtn'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { deepClone } from '@/utils/tool'
import './style.scss'

// 图片
import streetMap from '@/assets/image/map/street_map.png'

// 地图接口类型
export interface MapList {
  id?: number
  imageUrl?: string
  mapName?: string
  mapUrl?: string
}

export default function index({ setMapType }) {
  const { t } = useTranslation()
  let language = useSelector((state: { language }) => state.language.value)
  const [mapList, setMapList] = useState<Array<MapList>>([
    {
      id: 0,
      imageUrl: 'https://star-test1.oss-cn-hangzhou.aliyuncs.com/Mask%20group%402x%20%281%29.png',
      mapName: t('mapList.satelliteMap'),
      mapUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    },
    {
      id: 1,
      imageUrl: 'https://star-test1.oss-cn-hangzhou.aliyuncs.com/Mask%20group%402x.png',
      mapName: t('mapList.streetMapEN'),
      mapUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
    {
      id: 2,
      imageUrl: streetMap,
      mapName: t('mapList.streetMap'),
      mapUrl:
        'http://t0.tianditu.com/vec_w/wmts?layer=vec&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=5e77b8e24c935ea880079bdede600cf8',
    },
  ])
  let [mapIndex, setMapIndex] = useState(0)

  /* 初始化地图列表 */
  useEffect(() => {
    // mapList[0].mapName = t('mapList.satelliteMap')
    // mapList[1].mapName = t('mapList.satelliteMap')
    // setMapList([...mapList])
  }, [language])

  /* 切换地图点击事件 */
  const handleMapTypeClick = (data, index) => {
    setMapType(data)
    setMapIndex(index)
  }
  return (
    <>
      {/*  切换地图类型按钮部分 */}
      <Box className="hang-tool-btn">
        <PopoverBtn
          className="hang-btn"
          style={{
            mb: '10px',
          }}
          svgName="map_type_icon"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          popoverStyle={{
            mt: '-10px',
          }}
          contentClassName="popver-map_type-box"
        >
          {mapList.map((map, index) => {
            return (
              <Box key={index} className="map_type-box">
                <img
                  className="map_type-img"
                  src={map.imageUrl}
                  onClick={() => handleMapTypeClick(map, index)}
                  style={{
                    borderColor: index === mapIndex ? '#AEBDD8' : 'transparent',
                  }}
                ></img>
                <p
                  className="map_type-text"
                  style={{
                    color: index === mapIndex ? '#AEBDD8' : '#fff',
                  }}
                >
                  {map.id == 0
                    ? t('mapList.satelliteMap')
                    : map.id == 1
                    ? t('mapList.streetMapEN')
                    : t('mapList.streetMap')}
                </p>
              </Box>
            )
          })}
        </PopoverBtn>
      </Box>
    </>
  )
}
