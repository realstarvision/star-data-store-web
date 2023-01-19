import Slider, { SliderThumb, SliderValueLabelProps } from '@mui/material/Slider'
import { styled } from '@mui/material/styles'

const PrettoSlider = styled(Slider)({
  color: '#686868',
  height: 4,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: '17px',
    width: '36px',
    backgroundColor: '#AEBDD8',
    // border,
    borderRadius: '2px',
    // border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    // borderRadius: '50% 50% 50% 0',
    backgroundColor: '#686868',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
})

export default PrettoSlider
