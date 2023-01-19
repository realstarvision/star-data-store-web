function ScrollHeight(element) {
  let scrollHeight = element.scrollHeight
  return scrollHeight
}

function ScrollTop(element) {
  let scrollTop = element.pageYOffset || element.scrollTop || element.scrollTop
  return scrollTop
}

function ClientHeight(element) {
  let clientHeight = element.innerHeight || element.clientHeight
  return clientHeight
}

export default function hasMore(element, scrollThreshold = 0) {
  if (ClientHeight(element) + ScrollTop(element) >= ScrollHeight(element) - scrollThreshold) {
    return true
  } else {
    return false
  }
}