import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { Box, FormLabel, Grid, SliderThumb, Stack, FormControlLabel, Collapse, RadioGroup } from '@mui/material'
import SvgIcon from '@/components/SvgIcon'
import Slider from '@/components/Slider'
import Button, { LoadingButton } from '@/components/Button'
import AECheckbox from '@/components/CheckBox/AECheckbox'
import Dialog from './Dialog'
import {
  getCustomizationParams,
  getInventoryParams,
  setInventoryParams,
  setCustomizationParams,
  removeInventoryParams,
  removeCustomizationParams,
  getLanguage,
  getRememberArray,
  setRememberArray,
} from '@/utils/auth'
import KeyboardDatePicker from '@/components/KeyboardDatePicker'
import { styled } from '@mui/material/styles'
import Radio from '@/components/Radio'
import { GetSevenDayLaterDate } from '@/utils/date'
import Popper from '@/components/Popper'
import { useTranslation } from 'react-i18next'
import Message from '@/components/Message'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import moment from 'moment'
import DateFnsUtils from '@date-io/date-fns'
import zhLocale from 'date-fns/locale/zh-CN'
import enLocale from 'date-fns/locale/en-US'
import { getSatelliteList } from '@/api/satellite'
import { deepClone } from '@/utils/tool'
// import { getToken, getUserInfo, getLanguage } from '@/utils/auth'
import './style.scss'

export const MyFormControlLabel = styled(FormControlLabel)({
  '& .MuiFormControlLabel-label': {
    letterSpacing: '0.5px',
    fontSize: '14px',
  },
})

function index(
  {
    className,
    postpone = false,
    onConfrom,
    loading = false,
  }: {
    className?: string
    postpone
    onConfrom: Function
    loading?: boolean
  },
  ref
) {
  const { t } = useTranslation()
  const dialogRef = useRef(null)
  let [open, setOpen] = useState(false)
  // const [selectedDate, setselectedDate] = useState()
  let [formParams, setFormParams] = useState({
    startTime: !postpone ? GetSevenDayLaterDate(-30) : GetSevenDayLaterDate(7),
    endTime: !postpone ? new Date() : GetSevenDayLaterDate(37),
    cloudCoverage: 100,
    resolutionRatio: [0, 10.1],
    rollSatelliteAngle: 45,
    productType: 2,
    satelliteName: [],
  })
  // 是否保存筛选数据
  const [rememberCheckBox, setRememberCheckBox] = useState(true)
  // 全部卫星数据
  const [satelliteList, setSatelliteList] = useState([])

  useEffect(() => {
    /* 初始化筛选条件按钮选中状态 */
    setRememberState()
    // 初始化获取微信数据
    getSatelliteList().then(({ data }) => {
      setSatelliteList(data)
      let list = []
      /* 判断是库存还是定制 */
      if (!postpone) {
        if (getInventoryParams()) {
          formParams = { ...getInventoryParams() }
          if (formParams.rollSatelliteAngle > 45) {
            formParams.rollSatelliteAngle = 45
          }
          list = getInventoryParams().satelliteName
        }
      } else {
        if (getCustomizationParams()) {
          formParams = { ...getCustomizationParams() }
          if (formParams.rollSatelliteAngle > 45) {
            formParams.rollSatelliteAngle = 45
          }
          list = getCustomizationParams().satelliteName
        }
      }
      /*  */
      let arr = []
      data.forEach((element) => {
        element.checked = true
        if (list.length > 0) {
          if (list.includes(element.satelliteName)) {
            element.checked = true
          } else {
            element.checked = false
          }
        }
        if (element.checked) {
          arr.push(element.satelliteName)
        }
      })
      formParams.satelliteName = arr
      setFormParams({ ...formParams })
    })
  }, [])

  /* 监听记住筛选本次条件按钮变化 */
  // useEffect(() => {
  //   if (!postpone) {
  //     setRememberArray([rememberCheckBox, getRememberArray() ? getRememberArray()[1] : true])
  //   } else {
  //     setRememberArray([getRememberArray() ? getRememberArray()[0] : true, rememberCheckBox])
  //   }
  //   console.log(getRememberArray())
  // }, [rememberCheckBox])

  // 监听tab切换变化
  useEffect(() => {
    if (!postpone) {
      if (getInventoryParams()) {
        // list = getInventoryParams().satelliteName
        // setFormParams({ ...getInventoryParams() })
        formParams = { ...getInventoryParams() }
      }
    } else {
      if (getCustomizationParams()) {
        // setFormParams({ ...getCustomizationParams() })
        // list = getCustomizationParams().satelliteName
        formParams = { ...getCustomizationParams() }
      }
    }

    /* 设置本次赛选条件按钮状态 */
    setRememberState()
  }, [postpone])

  /* 设置本次赛选条件按钮状态函数 */
  function setRememberState() {
    console.log(getRememberArray())
    if (getRememberArray()) {
      if (!postpone) {
        setRememberCheckBox(getRememberArray()[0])
      } else {
        setRememberCheckBox(getRememberArray()[1])
      }
    }
  }

  /* 监听筛选条件变化来记住 */
  useEffect(() => {
    rememberFormParams()
  }, [JSON.stringify(formParams)])

  /* 如果记住筛选条件选中就记住本次筛选内容 */
  function rememberFormParams() {
    if (rememberCheckBox) {
      if (!postpone) {
        setInventoryParams(formParams)
      } else {
        setCustomizationParams(formParams)
      }
    }
  }

  /* 向外暴露 */
  useImperativeHandle(ref, () => ({
    handleCloseSearch,
    handleConfromBtn,
  }))

  /* 打开关闭 */
  const handleOpenSearch = (state) => {
    setOpen(!open)
  }

  /* 关闭 */
  const handleCloseSearch = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (!postpone) {
      if (getInventoryParams()) {
        // formParams = { ...getInventoryParams() }
        setFormParams({ ...getInventoryParams() })
      } else {
        handleResetBtn()
      }
    } else {
      if (getCustomizationParams()) {
        let params = getCustomizationParams()
        let sevenDayLaterDate = GetSevenDayLaterDate(7)
        // 判断编程的存储日期比当前七天后日期小的时候 就取当前七天后日期
        if (new Date(params.startTime).getTime() < sevenDayLaterDate.getTime()) {
          params.startTime = sevenDayLaterDate
        }
        if (new Date(params.endTime).getTime() < sevenDayLaterDate.getTime()) {
          params.endTime = sevenDayLaterDate
        }
        setFormParams({ ...params })
      } else {
        handleResetBtn()
      }
    }
  }, [postpone])

  /* 时间选择器时间 */
  const handleDateChange = (date, type) => {
    console.log(new Date(date))
    if (type === 'start') {
      formParams.startTime = new Date(date)
    } else {
      formParams.endTime = new Date(date)
    }
    setFormParams({ ...formParams })
  }

  /* 选择数据集 */
  const handleSelectDataSetClick = () => {
    dialogRef.current.handleOpen()
  }

  /* 滑块选择器 */
  const handleSliderChange = (e, type) => {
    if (type === 'resolutionRatio') {
      formParams[type][1] = e.target.value[1]
    } else {
      formParams[type] = e.target.value
    }
    setFormParams({ ...formParams })
  }

  /* 重置按钮 */
  const handleResetBtn = () => {
    let newSatelliteList = []
    satelliteList.forEach((element) => {
      newSatelliteList.push(element.satelliteName)
    })
    setFormParams({
      startTime: !postpone ? GetSevenDayLaterDate(-30) : GetSevenDayLaterDate(7),
      endTime: !postpone ? new Date() : GetSevenDayLaterDate(37),
      cloudCoverage: 100,
      resolutionRatio: [0, 10.1],
      rollSatelliteAngle: 45,
      productType: 2,
      satelliteName: newSatelliteList,
    })
  }

  /* 数据类型 */
  const handleRadioGroup = (e) => {
    formParams.productType = e.target.value
    setFormParams({ ...formParams })
  }

  /* 卫星数据选择弹出框中确认事件 */
  const handleSatelliteDialogConfirm = (data) => {
    console.log(99999)
    console.log(data)
    formParams.satelliteName = [...data]
    setFormParams({ ...formParams })
    rememberFormParams()
  }

  /* 确认按钮 */
  const handleConfromBtn = (type: any) => {
    // 处理记住本次筛选条件
    if (!formParams.startTime || !formParams.endTime) {
      Message({
        content: t('Drawer.searchBar.message.time'),
        style: {
          marginTop: '120px',
          marginLeft: '100px',
        },
      })
      return false
    } else if (formParams.satelliteName.length === 0) {
      Message({
        content: t('Drawer.searchBar.message.satellite'),
        style: {
          marginTop: '120px',
          marginLeft: '100px',
        },
      })
      return false
    }

    if (!postpone) {
      // 库存数据
      if (rememberCheckBox) {
        setInventoryParams(formParams)
      }
    } else {
      // 定制数据
      if (rememberCheckBox) {
        setCustomizationParams(formParams)
      }
    }

    // TODO:给卫星数据列表添加数据源类型
    let newSatelliteNameList = []
    satelliteList.forEach((item) => {
      if (formParams.satelliteName.includes(item.satelliteName)) {
        newSatelliteNameList.push({
          satelliteName: item.satelliteName,
          sourceType: item.sourceType,
        })
      }
    })

    let newFormParams: any = deepClone(formParams)
    newFormParams.satelliteName = newSatelliteNameList
    // // 提交的参数传给父元素
    onConfrom(newFormParams, type)
  }

  /* 记住本次筛选条件 */
  const handleRememberCheckBoxChange = (e) => {
    setRememberCheckBox(e.target.checked)
    if (!postpone) {
      setRememberArray([e.target.checked, getRememberArray() ? getRememberArray()[1] : true])
    } else {
      setRememberArray([getRememberArray() ? getRememberArray()[0] : true, e.target.checked])
    }
  }
  return (
    <Box className={className + ' search-container'}>
      <Box className="search-box">
        <SvgIcon
          svgName="search_condition_icon"
          svgClass="icon"
          style={{
            // marginTop: '3px',
            width: '20px',
            height: '20px',
          }}
        ></SvgIcon>
        <p>
          <span>
            {`${t('Drawer.searchBar.abbreviations.cloudCoverage')}≤${formParams.cloudCoverage}%, ${t(
              'Drawer.searchBar.abbreviations.resolutionRatio'
            )}: ${
              formParams.resolutionRatio[1] == 10.1
                ? 'All'
                : formParams.resolutionRatio[0] + '~' + formParams.resolutionRatio[1] + 'm'
            },  ${t('Drawer.searchBar.abbreviations.rollSatelliteAngle')}: 0~${formParams.rollSatelliteAngle}° `}
          </span>

          {/* <br /> */}
          <span>
            {`${t('Drawer.searchBar.abbreviations.Date')}: ${moment(formParams.startTime).format(
              'MM/DD/yyyy'
            )}-${moment(formParams.endTime).format('MM/DD/yyyy')}`}
          </span>
        </p>
        <Box className="arrows-box">
          <SvgIcon
            svgName="arrows"
            svgClass={'icon drop-down ' + (open ? 'upwards' : '')}
            onClick={handleOpenSearch}
          ></SvgIcon>
        </Box>
      </Box>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLanguage() == 'CN' ? zhLocale : enLocale}>
        <Collapse in={open} timeout={500}>
          <Box className="search-content">
            {/* 起始时间 */}
            <Stack direction="row" spacing={6} className="form-bar">
              <Box className="date">
                <FormLabel component="span" className="label">
                  <p className="label-title">{t('Drawer.searchBar.date.startTime')}</p>
                  {postpone && (
                    <Popper
                      textContent={t(`Drawer.date.help`)}
                      fontBoxStyle={{
                        background: 'rgba(0,0,0,0.6)',
                        display: 'inline-block',
                        width: '183px',
                        lineHeight: '16px',
                        padding: '10px',
                        fontSize: '12px',
                        fontWeight: 300,
                      }}
                    >
                      <SvgIcon svgName="date_help" svgClass="help"></SvgIcon>
                    </Popper>
                  )}
                </FormLabel>
                <KeyboardDatePicker
                  value={formParams.startTime}
                  placeholder={t('Drawer.searchBar.date.startTimeplaceholder')}
                  onChange={(date) => handleDateChange(date, 'start')}
                  minDate={postpone ? GetSevenDayLaterDate(7) : new Date('1900-01-01')}
                  maxDate={formParams.endTime ? formParams.endTime : !postpone ? new Date() : new Date('2100-01-01')}
                  // maxDate={formParams.endTime ? formParams.endTime : ''}
                  format="MM/dd/yyyy"
                  keyboardIcon={<SvgIcon svgName="date_icon"></SvgIcon>}
                  okLabel={
                    <Button className="date_btn">
                      {formParams.endTime
                        ? t('Drawer.searchBar.date.confromBtnText')
                        : t('Drawer.searchBar.date.nextStep')}
                    </Button>
                  }
                  cancelLabel={<span className="date_cancel_btn">{t('Drawer.searchBar.date.cancelBtnText')}</span>}
                  helperText={null}
                />
              </Box>
              <Box>
                <FormLabel component="span" className="label">
                  <p className="label-title">{t('Drawer.searchBar.date.endTime')}</p>
                </FormLabel>

                <KeyboardDatePicker
                  value={formParams.endTime}
                  placeholder={t('Drawer.searchBar.date.endTimeplaceholder')}
                  onChange={(date) => handleDateChange(date, 'end')}
                  minDate={
                    postpone
                      ? formParams.startTime
                        ? formParams.startTime
                        : GetSevenDayLaterDate(7)
                      : formParams.startTime
                      ? formParams.startTime
                      : new Date('1900-01-01')
                  }
                  maxDate={!postpone ? new Date() : new Date('2100-01-01')}
                  // minDate={formParams.startTime ? formParams.startTime : ''}
                  format="MM/dd/yyyy"
                  keyboardIcon={<SvgIcon svgName="date_icon"></SvgIcon>}
                  okLabel={<Button className="date_btn">{t('Drawer.searchBar.date.confromBtnText')}</Button>}
                  cancelLabel={<span className="date_cancel_btn">{t('Drawer.searchBar.date.cancelBtnText')}</span>}
                  helperText={null}
                  readOnly={true}
                />
              </Box>
            </Stack>
            {/* 云量 */}
            <Grid container className="form-bar">
              <Grid item xs={4} className="from-item">
                <FormLabel component="span" className="label">
                  <span>{t('Drawer.searchBar.cloudCoverage')} :</span>
                </FormLabel>
              </Grid>
              <Grid item xs={8} className="from-item">
                <Slider
                  key={'cloudCoverage'}
                  sx={{ width: '92%' }}
                  value={formParams.cloudCoverage}
                  onChange={(e) => handleSliderChange(e, 'cloudCoverage')}
                  slots={{ thumb: (e) => AirbnbThumbComponent(e, 'cloudCover') }}
                ></Slider>
              </Grid>
            </Grid>
            {/* 分辨率 */}
            <Grid container className="form-bar">
              <Grid item xs={4} className="from-item">
                <FormLabel component="span" className="label">
                  <span>{t('Drawer.searchBar.resolutionRatio')} :</span>
                </FormLabel>
              </Grid>
              <Grid item xs={8} className="from-item">
                <Slider
                  key={'resolutionRatio'}
                  sx={{ width: '92%' }}
                  value={formParams.resolutionRatio}
                  step={0.1}
                  max={10.1}
                  onChange={(e) => handleSliderChange(e, 'resolutionRatio')}
                  disableSwap
                  slots={{ thumb: (e) => AirbnbThumbComponent(e, 'resolutionResolution') }}
                ></Slider>
              </Grid>
            </Grid>
            {/* 偏移角度 */}
            <Grid container className="form-bar">
              <Grid item xs={4} className="from-item">
                <FormLabel component="span" className="label">
                  <span>{t('Drawer.searchBar.rollSatelliteAngle')} :</span>
                </FormLabel>
              </Grid>
              <Grid item xs={8} className="from-item">
                <Slider
                  key={'rollSatelliteAngle'}
                  sx={{ width: '92%' }}
                  max={45}
                  value={formParams.rollSatelliteAngle}
                  onChange={(e) => handleSliderChange(e, 'rollSatelliteAngle')}
                  slots={{ thumb: (e) => AirbnbThumbComponent(e, 'angleDeviation') }}
                ></Slider>
              </Grid>
            </Grid>
            {/* 数据类型 */}
            <Grid container className="form-bar">
              <Grid item xs={4} className="from-item data-type-label">
                <FormLabel component="span" className="label ">
                  <span>{t('Drawer.searchBar.productType')} :</span>
                </FormLabel>
              </Grid>
              <Grid item xs={8} className="from-item">
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={formParams.productType}
                  name="radio-buttons-group"
                  onChange={handleRadioGroup}
                >
                  <MyFormControlLabel
                    value={2}
                    className="mb"
                    style={{
                      height: '38px',
                    }}
                    control={<Radio className="mr" size="small" />}
                    label={t('Drawer.searchBar.productTypeRadioLabel.optics')}
                  />
                  <MyFormControlLabel
                    value={1}
                    className="mb"
                    style={{
                      height: '38px',
                    }}
                    control={<Radio className="mr" size="small" />}
                    label={t('Drawer.searchBar.productTypeRadioLabel.radar')}
                  />
                  <MyFormControlLabel
                    value={3}
                    className="mb"
                    style={{
                      height: '38px',
                    }}
                    control={<Radio className="mr" size="small" />}
                    label={t('Drawer.searchBar.productTypeRadioLabel.elevation')}
                  />
                </RadioGroup>
              </Grid>
            </Grid>
            {/* 卫星数据 */}
            {/* <Grid container className="form-bar">
              <Grid item xs={4} className="from-item">
                <FormLabel component="span" className="label">
                  <span>{t('Drawer.searchBar.satellite')} :</span>
                </FormLabel>
              </Grid>
              <Grid item xs={8} className="from-item">
                <Button onClick={handleSelectDataSetClick} className="data_set_btn">
                  {t('Drawer.searchBar.satelliteBtnText')}
                </Button>
              </Grid>
            </Grid> */}
            {/* 按钮 */}
            <Grid container className="form-bar operation-bar">
              <Grid
                item
                xs={7}
                className="from-item"
                style={{
                  padding: '0 10px',
                }}
              >
                <MyFormControlLabel
                  style={{
                    color: '#fff',
                  }}
                  control={
                    <AECheckbox
                      checked={rememberCheckBox}
                      onChange={handleRememberCheckBoxChange}
                      style={{
                        paddingRight: '15px',
                        marginTop: '2px',
                      }}
                    />
                  }
                  label={t('Drawer.searchBar.filtratelabel')}
                />
              </Grid>
              <Grid item xs={5} className="from-item">
                <Stack direction="row" spacing={2} className="row">
                  <span className="reset_btn" onClick={handleResetBtn}>
                    {t('Drawer.searchBar.resetBtnText')}
                  </span>
                  <LoadingButton loading={loading} className="confrom_btn" onClick={handleConfromBtn}>
                    {!postpone ? t('Drawer.searchBar.confromBtnText') : t('Drawer.searchBar.submitBtnText')}
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </MuiPickersUtilsProvider>
      {/* 弹出框 */}
      <Dialog
        ref={dialogRef}
        onSatelliteDialogConfirm={handleSatelliteDialogConfirm}
        postpone={postpone}
        list={formParams.satelliteName}
      ></Dialog>
    </Box>
  )
}

/* 滑块 */
interface AirbnbThumbComponentProps extends React.HTMLAttributes<unknown> {}
function AirbnbThumbComponent(props: AirbnbThumbComponentProps, type) {
  const { children, ...other } = props
  // useEffect(() => {
  //   console.log(props)
  // }, [JSON.stringify(props)])
  return (
    <SliderThumb {...other}>
      {/* {children}
      <span
        style={{
          fontSize: '12px',
          transform: 'scale(0.9)',
        }}
      >
        {type === 'resolutionResolution' && props['ownerState'].value
          ? props['ownerState'].value == 10.1
            ? 'All'
            : props['ownerState'].value
          : props['ownerState'].value
          ? props['ownerState'].value
          : 0}
        {type === 'cloudCover'
          ? '%'
          : type === 'resolutionResolution' && props['ownerState'].value != 10.1
          ? 'm'
          : type === 'angleDeviation'
          ? '°'
          : ''}
      </span> */}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: type === 'resolutionResolution' && props['data-index'] === 0 ? '#aaa' : '',
          borderRadius: '2px',
          cursor: 'notAllowed',
        }}
      >
        {children}
        <span
          style={{
            fontSize: '12px',
            transform: 'scale(0.9)',
          }}
        >
          {type === 'resolutionResolution' && props['ownerState'].value
            ? props['ownerState'].value[props['data-index']] == 10.1
              ? 'All'
              : props['ownerState'].value[props['data-index']]
            : props['ownerState'].value
            ? props['ownerState'].value
            : 0}
          {type === 'cloudCover'
            ? '%'
            : type === 'resolutionResolution' && props['ownerState'].value[props['data-index']] != 10.1
            ? 'm'
            : type === 'angleDeviation'
            ? '°'
            : ''}
        </span>
      </div>
    </SliderThumb>
  )
}

export default forwardRef(index)
