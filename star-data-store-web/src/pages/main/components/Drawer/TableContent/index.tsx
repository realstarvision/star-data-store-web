import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  CircularProgress,
  Grid,
  FormLabel,
} from '@mui/material'
import Dialog from './Dialog'
import SvgIcon from '@/components/SvgIcon'
import Checkbox from '@/components/CheckBox'
import hasMore from '@/utils/InfiniteScroll'
import emptyImg from '@/assets/image/png/empty.png'
import emptyRedImg from '@/assets/image/png/emptyRed.png'
import Popper from '@/components/Popper'
import moment from 'moment'
import './style.scss'
import { t } from 'i18next'

interface Column {
  key: string
  title?: string
  minWidth?: number
  align?: 'right' | 'center' | 'left'
  format?: (value: number) => string
  slot?: any
  label?: string
}

function index(
  {
    scrollState,
    searchParams,
    onScrollCapture,
    postpone = false,
    loading,
    rebound,
    list,
    onCheckBoxChange,
    onAllCheck,
    allCheckedValue,
  },
  ref
) {
  const columns: readonly Column[] = [
    {
      key: 'satelliteName',
      title: t('Drawer.searchBar.abbreviations.satellite'),
      align: 'center',
      label: t('Drawer.searchBar.tableThLabel.satellite'),
    },
    {
      key: 'centerTime',
      align: 'center',
      title: t('Drawer.searchBar.abbreviations.Date'),
      label: t('Drawer.searchBar.tableThLabel.Date'),
      slot: function ({ row }: { row: any }) {
        return <span>{row.centerTime !== null ? moment(row.centerTime).format('MM/DD/YYYY') : ''}</span>
      },
    },
    {
      key: 'imageGSD',
      align: 'center',
      title: t('Drawer.searchBar.abbreviations.resolutionRatio'),
      label: t('Drawer.searchBar.tableThLabel.resolutionRatio'),
      slot: function ({ row }: { row: any }) {
        return <span>{row.imageGSD !== null ? row.imageGSD + 'm' : ''}</span>
      },
    },
    {
      key: 'rollSatelliteAngle',
      align: 'center',
      title: t('Drawer.searchBar.abbreviations.rollSatelliteAngle'),
      label: t('Drawer.searchBar.tableThLabel.rollSatelliteAngle'),
      slot: function ({ row }: { row: any }) {
        return <span>{row.angle ? row.angle.rollSatelliteAngle + '°' : ''}</span>
      },
    },
    {
      key: 'cloudCoverage',
      align: 'center',
      title: t('Drawer.searchBar.abbreviations.cloudCoverage'),
      label: t('Drawer.searchBar.tableThLabel.cloudCoverage'),
      slot: function ({ row }: { row: any }) {
        return <span>{row.cloudCoverage + '%'}</span>
      },
    },
  ]
  const TableContainerRef = useRef(null)
  const DialogRef = useRef(null)

  /* 向外暴露 */
  useImperativeHandle(ref, () => ({}))

  /*  表格行点击事件 */
  const handleTableRowClick = (rowData) => {
    DialogRef.current.handleOpen(rowData)
  }

  /* 滚动条下拉请求事件 */
  function handleScrollCapture() {
    if (hasMore(TableContainerRef.current, 100) && !loading && !rebound) {
      // getESListData(searchParams)
      !postpone && onScrollCapture()
    }
  }

  /* 表格中单选按钮 */
  const handleCheckBoxChange = (e, row, i) => {
    list[i].checked = e.target.checked
    !postpone && onCheckBoxChange(e.target.checked, row, i)
  }

  /* 全选按钮 */
  const handleAllCheckChangle = (e) => {
    if (!postpone) {
      onAllCheck(e.target.checked)
    }
  }
  return (
    <Box
      style={{
        position: 'relative',
        height: 'cale(100% - 190px)',
        overflow: 'auto',
      }}
    >
      <TableContainer
        className={'table-container '}
        style={{
          overflow: scrollState ? 'hidden' : 'auto',
        }}
        ref={TableContainerRef}
        onScrollCapture={handleScrollCapture}
      >
        <Table sx={{ width: '100%' }} aria-label="simple table" stickyHeader>
          <TableHead
            style={{
              padding: '0 20px',
            }}
          >
            <TableRow>
              <TableCell align="center" className="TableCell">
                <Checkbox
                  checked={allCheckedValue}
                  onChange={handleAllCheckChangle}
                  sx={{
                    mr: '2px',
                  }}
                ></Checkbox>
              </TableCell>

              {columns.map((column) => (
                <TableCell
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  className="TableCell"
                  sx={{
                    '&:hover': {
                      opacity: 0.6,
                    },
                  }}
                >
                  <Popper
                    textContent={column.label}
                    fontBoxStyle={{
                      background: 'rgba(0,0,0,0.3)',
                    }}
                  >
                    {column.title}
                  </Popper>
                </TableCell>
              ))}
              <TableCell align="center" className="TableCell"></TableCell>
            </TableRow>
          </TableHead>

          {list.length > 0 && (
            <TableBody>
              {list.map((row, index) => (
                <TableRow className="tableBodyRow">
                  <TableCell align="center" className="TableCell TableCellHeight">
                    <Checkbox
                      key={row.identifier}
                      checked={row.checked}
                      onChange={(e) => handleCheckBoxChange(e, row, index)}
                      style={{
                        marginBottom: '3px',
                      }}
                    ></Checkbox>
                  </TableCell>
                  {columns.map((column: Column, indexColumn) => (
                    <TableCell
                      className="TableCell TableCellHeight"
                      align={column.align}
                      style={{
                        fontWeight: 300,
                      }}
                      onClick={() => handleTableRowClick(row)}
                    >
                      {column.slot ? <column.slot row={row} index={indexColumn}></column.slot> : row[column.key]}
                    </TableCell>
                  ))}
                  <TableCell align="right" className="TableCell" onClick={() => handleTableRowClick(row)}>
                    <SvgIcon
                      svgName="table_tips"
                      style={{
                        width: '15px',
                        height: '15px',
                      }}
                    ></SvgIcon>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>

        {/* 加载完毕 */}
        {rebound && list.length > 0 && (
          <div
            style={{
              color: '#999',
              paddingTop: '5px',
              paddingBottom: '10px',
              fontSize: '12px',
              textAlign: 'center',
            }}
          >
            {`${t('Dialog.tableEmpty')}`}
          </div>
        )}

        {/* 加载状态 */}
        {loading && !rebound && (
          <div
            style={{
              color: '#999',
              paddingTop: '5px',
              paddingBottom: '10px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress
              size={12}
              sx={{
                mr: '10px',
                color: '#999',
              }}
            />
            {`${t('Dialog.loadingText')}`}
          </div>
        )}
      </TableContainer>
      {/* 空状态 */}
      {list.length === 0 && !loading && (
        <Box
          style={{
            width: '100%',
            textAlign: 'center',
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%)',
          }}
        >
          <img
            src={!postpone ? emptyRedImg : emptyImg}
            style={{
              width: '100px',
              height: '100px',
            }}
          />
          <p
            className="empty-text"
            style={{
              fontSize: '18px',
              lineHeight: '24px',
              color: '#FFFFFF',
            }}
          >
            {!postpone ? `${t('Dialog.message.inventoryEmpty')}` : `${t('Dialog.message.customizationEmpty')}`}
          </p>
        </Box>
      )}

      {/* 弹出框 */}
      <Dialog ref={DialogRef}></Dialog>
    </Box>
  )
}

export default forwardRef(index)
