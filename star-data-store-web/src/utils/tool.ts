/**
 * 防抖
 * @param {function} fn 
 * @param {number} delay 
 */
export function debounce(fn: any, delay = 500,) {
  let timer: NodeJS.Timeout | null | undefined = null
  return () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn()
      // fn.apply(this, arguments)
      clearTimeout(timer as NodeJS.Timeout)
    }, delay)
  }
}


/* 
*数组对象去重
*
*/

export function repetition(data: any[]) {

  let obj: any = {};
  let peon = data.reduce((cur, next) => {
    obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
    return cur
  }, []) //设置cur默认类型为数组，并且初始值为空的数组

  return peon
}


/* 深拷贝 */
export function deepClone(obj) {
  // 定义一个变量 并判断是数组还是对象
  var objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object' && obj != null) {
    // 判断obj存在并且是对象类型的时候 因为null也是object类型，所以要单独做判断
    for (var key in obj) {
      // 循环对象类型的obj
      if (obj.hasOwnProperty(key)) {
        // 判断obj中是否存在key属性
        if (obj[key] && typeof obj[key] === 'object') {
          // 判断如果obj[key]存在并且obj[key]是对象类型的时候应该深拷贝，即在堆内存中开辟新的内存
          if (obj[key] instanceof Date) {
            objClone[key] = obj[key]
          } else {
            objClone[key] = deepClone(obj[key])
          }

        } else {
          // 否则就是浅复制
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}