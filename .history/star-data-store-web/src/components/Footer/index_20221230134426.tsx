import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Box, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import SvgIcon from '@/components/SvgIcon'
import './footer.scss'

export const DrawerFooter = styled('div')(({ theme }) => ({
  height: '40px',
  boxSizing: 'border-box',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
}))

export default function Footer() {
  // i18n
  const { t } = useTranslation()
  return (
    <>
      <Box className="footer">
        <Typography className="statement">
          <a href="mailto:sv@star.vision">{t('footer.mailbox')}</a>
        </Typography>
        <Divider
          orientation="vertical"
          sx={{
            borderColor: '#fff',
            height: '10px',
            margin: '0 5px',
          }}
        />
        <Typography className="phone">{t('footer.phone').replace('%s', '86-0571-86227683')}</Typography>
      </Box>
    </>
  )
}
