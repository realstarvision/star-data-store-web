import { configureStore } from '@reduxjs/toolkit'
import toolActive from './module/toolActive'
import login from './module/login'
import language from './module/language'
import allOrderVisible from './module/allOrderVisible'

export const store = configureStore({
  reducer: {
    toolActive,
    login,
    language,
    allOrderVisible
  },
})
