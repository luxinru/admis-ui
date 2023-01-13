const useScreenStore = defineStore(
  'screen',
  {
    state: () => ({
      houseList: [],
      classList: []
    }),
    actions: {
      setHouseList(list) {
        this.houseList = list || []
      },
      setClassList(list) {
        this.classList = list || []
      },
    }
  })

export default useScreenStore
