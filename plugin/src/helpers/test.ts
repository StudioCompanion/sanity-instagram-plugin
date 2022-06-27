export const filterUniqueFromArray = (array: any[]) => {
  return array.filter((item, index) => array.indexOf(item) === index)
}
