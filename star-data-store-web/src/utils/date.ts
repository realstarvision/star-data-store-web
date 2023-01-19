export const GetSevenDayLaterDate = (date) => {
  return new Date(new Date().getTime() + (date * 24 * 60 * 60 * 1000))
}
