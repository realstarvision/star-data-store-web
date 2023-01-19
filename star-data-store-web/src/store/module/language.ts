import { createSlice } from '@reduxjs/toolkit'
import { getLanguage } from '@/utils/auth'

const initialState = {
  value: getLanguage() === 'EN' ? 'en' : 'zh'
}

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguageSlice: (state, value) => {
      // Redux Toolkit允许我们在reducers中直接写改变state的逻辑.
      // 由于使用了Immer库,所以并没有真的改变state
      // 而是检测到“草稿state”的更改并根据这些更改生成一个全新的不可变state
      state.value = value.payload
    },
  },
})

// reducer方法的每一个case都会生成一个Action
export const { setLanguageSlice } = languageSlice.actions

export default languageSlice.reducer