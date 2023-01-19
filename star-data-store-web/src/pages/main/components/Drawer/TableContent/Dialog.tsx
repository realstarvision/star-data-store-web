import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Box, Grid, Paper } from '@mui/material'
import MyDialog from '@/components/Dialog'
import map_icon from '@/assets/image/png/map_icon.png'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import { t } from 'i18next'

const EditDialogPaper = styled(Paper)({
  maxWidth: '772px',
})

function index({}, ref) {
  /* 列参数 */
  let column = [
    {
      label: t('Dialog.image'),
      key: 'thumbnailUrl',
    },
    {
      label: t('Dialog.imageName'),
      key: 'identifier',
    },
    {
      label: t('Dialog.satelliteName'),
      key: 'satelliteName',
    },
    {
      label: t('Dialog.date'),
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
  // 向外抛出
  useImperativeHandle(ref, () => ({
    handleOpen,
  }))

  // 弹出图像信息框
  let [dialogOpen, setDialogOpen] = useState(false)
  let [data, setData] = useState<any>({})

  /* 打开 */
  const handleOpen = (rowData) => {
    setData(rowData)
    setDialogOpen(true)
  }
  return (
    <MyDialog
      title={t('Dialog.title.imageInfo')}
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
          padding: '33px 20px',
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
                {/* data:image/jpg;base64,${data[item.key]} */}
                {item.key === 'thumbnailUrl' && (
                  <img
                    src={data[item.key] ? data[item.key] : map_icon}
                    style={{
                      width: '200px',
                      height: '200px',
                    }}
                  />
                )}
                {item.key === 'identifier' && (
                  <span
                    style={{
                      fontSize: '16px',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {data[item.key]}
                  </span>
                )}
                {item.key === 'satelliteName' && (
                  <span
                    style={{
                      fontSize: '16px',
                    }}
                  >
                    {data[item.key]}
                  </span>
                )}
                {item.key === 'centerTime' && (
                  <span
                    style={{
                      fontSize: '16px',
                    }}
                  >
                    {moment(data[item.key]).format('YYYY-MM-DD hh:mm')}
                  </span>
                )}
                {item.key === 'imageGSD' && (
                  <span
                    style={{
                      fontSize: '16px',
                    }}
                  >
                    {data[item.key]}m
                    {/* {data[item.key].length > 0 && `${data[item.key][0]}m ~ ${data[item.key][1]}m`} */}
                  </span>
                )}
                {item.key === 'rollSatelliteAngle' && (
                  <span
                    style={{
                      fontSize: '16px',
                    }}
                  >
                    {data.angle && data['angle'].rollSatelliteAngle}°
                  </span>
                )}
                {item.key === 'cloudCoverage' && (
                  <span
                    style={{
                      fontSize: '16px',
                    }}
                  >
                    {data[item.key]}%
                  </span>
                )}
              </Grid>
            </Grid>
          )
        })}
      </Box>
    </MyDialog>
  )
}

export default forwardRef(index)
