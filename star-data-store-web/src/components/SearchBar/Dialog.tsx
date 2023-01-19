import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { Box, Grid, Checkbox, FormGroup } from '@mui/material'
import Button from '@/components/Button'
import MyDialog from '@/components/Dialog'
import { MyFormControlLabel } from './index'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
// import Checkbox, { AECheckbox } from '@/components/CheckBox'
import { getSatelliteList } from '@/api/satellite'
import {
  getCustomizationParams,
  getInventoryParams,
  setInventoryParams,
  setCustomizationParams,
  removeInventoryParams,
  removeCustomizationParams,
} from '@/utils/auth'
import s from './Dialog.module.scss'
import map_icon from '@/assets/image/png/map_icon.png'
import set from 'date-fns/esm/fp/set/index'

function index({ onSatelliteDialogConfirm, postpone, list }, ref) {
  const { t } = useTranslation()
  const theme = useTheme()
  // 卫星列表
  // 弹出图像信息框
  let [dialogOpen, setDialogOpen] = useState(false)
  const [satelliteList, setSatelliteList] = useState([])
  const [allChecked, setAllChecked] = useState(false)
  const [checkData, setCheckData] = useState([])
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  useImperativeHandle(ref, () => ({
    handleOpen,
  }))

  /* 初始化卫星数据 */
  useEffect(() => {
    if (dialogOpen) {
      getSatelliteList().then(({ data }) => {
        let satelliteName = []
        /* 判断是库存还是定制 */
        if (!postpone) {
          if (getInventoryParams()) {
            satelliteName = getInventoryParams().satelliteName
          }
        } else {
          if (getCustomizationParams()) {
            satelliteName = getCustomizationParams().satelliteName
          }
        }
        /* 初始化选框状态 */
        let i = 0
        data.forEach((element) => {
          element.checked = true
          i++
          if (list.length > 0) {
            if (list.includes(element.satelliteName)) {
              element.checked = true
            } else {
              element.checked = false
              i--
            }
          } else if (satelliteName.length > 0) {
            if (satelliteName.includes(element.satelliteName)) {
              element.checked = true
            } else {
              element.checked = false
              i--
            }
          } else {
            element.checked = false
            i--
          }
        })
        setSatelliteList([...data])
        // 判断是否全选
        if (i === data.length) {
          setAllChecked(true)
        }
      })
    }
  }, [dialogOpen])

  /* 复选框事件 */
  const handleChange = (e) => {
    let i = 0
    let newData = satelliteList.map((item) => {
      e.target.name === item.satelliteName && (item.checked = e.target.checked)
      if (item.checked) {
        i++
      }
      if (i === satelliteList.length) {
        setAllChecked(true)
      } else {
        setAllChecked(false)
      }
      return item
    })
    setSatelliteList([...newData])
  }

  /* 全选按钮 */
  const handleAllChange = (e) => {
    satelliteList.forEach((element) => {
      element.checked = e.target.checked
    })
    setAllChecked(e.target.checked)
    setSatelliteList([...satelliteList])
  }

  /* 确认按钮 */
  const handleConfirmClick = () => {
    let checkedData = []
    satelliteList.forEach((item) => {
      item.checked && checkedData.push(item.satelliteName)
    })
    onSatelliteDialogConfirm(checkedData)
    setDialogOpen(false)
  }

  /* 打开弹窗 */
  const handleOpen = () => {
    setDialogOpen(true)
  }

  /* 关闭弹窗 */
  const handleClose = () => {
    satelliteList.forEach((element) => {
      element.checked = false
    })
    setSatelliteList([...satelliteList])
    setDialogOpen(false)
  }

  return (
    <MyDialog
      title={t('Drawer.searchBar.dialog.title')}
      open={dialogOpen}
      onClose={handleClose}
      className={s.dialog}
      style={{
        height: '600px',
        padding: '30px 20px',
        position: 'relative !important',
        overflow: 'hidden',
      }}
      boxStyle={{
        width: '120% !important',
        // overflow: 'auto',
      }}
      maxWidth="lg"
      fullWidth={true}
    >
      <Box
        style={{
          height: 'calc(100% - 44px)',
          overflow: 'auto',
        }}
      >
        <FormGroup className={s.container}>
          {satelliteList.map((item) => {
            return (
              <Box className={s.item}>
                <MyFormControlLabel
                  control={<Checkbox checked={item.checked} onChange={handleChange} name={item.satelliteName} />}
                  label={item.satelliteName}
                />
              </Box>
            )
          })}
        </FormGroup>
      </Box>
      <Box className={s.confirmBtnBox}>
        <MyFormControlLabel
          control={<Checkbox checked={allChecked} onChange={handleAllChange} name={'全选'} />}
          label={t('checkAll')}
        />
        <Button className={s.btn} onClick={handleConfirmClick}>
          {t('Drawer.searchBar.dialog.btnText')}
        </Button>
      </Box>
    </MyDialog>
  )
}

export default forwardRef(index)
