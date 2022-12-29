const useScreenStore = defineStore(
  'screen',
  {
    state: () => ({
      houseList: []
    }),
    actions: {
      setHouseList(list) {
        this.houseList = list || []
      },
    }
  })

export default useScreenStore
