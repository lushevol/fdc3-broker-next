const list = {
  /**
   * get first element of arraylike
   * @param list arraylike 
   * @returns first element of arraylike
   */
  first(list: ArrayLike<any>) {
    return list[0];
  },
  /**
   * get last element of arraylike
   * @param list arraylike
   * @returns last element of arraylike
   */
  last(list: ArrayLike<any>) {
    return list[list.length - 1];
  },
  /**
   * create new array from arraylike
   * @param list arraylike
   * @returns array
   */
  from(list: ArrayLike<any>) {
    const result = [];
    const length = list.length;
    let idx = -1;
    while (++idx < length) {
      result[idx] = list[idx];
    }
    return result;
  },
  /**
   * get rest elements except first one
   * @param list array
   * @returns array
   */
  rest(list: Array<any>) {
    return list.slice(1);
  },
  /**
   * if item exists in arraylike
   * @param array array | dom list
   * @param item sub element
   * @returns boolean
   */
  contains(array: Array<any> | DOMTokenList, item: any) {
    if (array && array.length && item) {
      if (array instanceof Array) {
        return array.indexOf(item) !== -1;
      } else if (array instanceof DOMTokenList) {
        return array.contains(item);
      }
    }
    return false;
  },
};

export default list;
