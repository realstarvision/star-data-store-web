import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const userInfo = 'User-Info-order'
const language = 'language'
const inventoryParams = 'inventoryParams'
const customizationParams = 'customizationParams'
const rememberCheckBox = 'rememberCheckBox'

/* token */
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


/* 用户信息 */
export function getUserInfo() {
  const info = Cookies.get(userInfo)
  return info ? JSON.parse(info as string) : ''
}

export function setUserInfo(info: { avatarUrl: string, nick: string }) {
  const user = JSON.stringify(info)
  return Cookies.set(userInfo, user)
}

export function removeUserInfo() {
  return Cookies.remove(userInfo)
}

/* 语言 */
export function getLanguage() {
  return Cookies.get(language)
}

export function setLanguage(data: string) {
  return Cookies.set(language, data)
}

export function removeLanguage() {
  return Cookies.remove(language)
}

/* 库存数据参数 */
export function getInventoryParams() {
  const info = Cookies.get(inventoryParams)
  return info ? JSON.parse(info as string) : null
}

export function setInventoryParams(param: any) {
  const params = JSON.stringify(param)
  return Cookies.set(inventoryParams, params)
}

export function removeInventoryParams() {
  return Cookies.remove(inventoryParams)
}

/* 定制数据参数 */
export function getCustomizationParams() {
  const info = Cookies.get(customizationParams)
  return info ? JSON.parse(info as string) : null
}

export function setCustomizationParams(param: any) {
  const params = JSON.stringify(param)
  return Cookies.set(customizationParams, params)
}

export function removeCustomizationParams() {
  return Cookies.remove(customizationParams)
}

/* 记住筛选 */
export function getRememberArray() {
  const info = Cookies.get(rememberCheckBox)
  return info ? JSON.parse(info as string) : null
}

export function setRememberArray(param: any) {
  const params = JSON.stringify(param)
  return Cookies.set(rememberCheckBox, params)
}

export function removeRememberArray() {
  return Cookies.remove(rememberCheckBox)
}
