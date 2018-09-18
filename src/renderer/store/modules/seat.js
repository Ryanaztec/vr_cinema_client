import API from '../.././service/api'
const state = {
  seats: [],
  playingSeats: [],
  isMain: false
}

const mutations = {
  SET_SEATS: (state, seats) => {
    state.seats = seats
  },
  SET_MAIN_SEAT: (state, status) => {
    state.isMain = status
  },
  ADD_PLAYING_SEATS: (state, seats) => {
    state.playingSeats.push(seats)
  },
  SET_PLAYING_SEATS: (state, seats) => {
    state.playingSeats = seats
  }
}

const actions = {
  GetPlayingStatusSeats (store, params) {
    API.getPlayingSeats(params).then(response => {
      if (response.data.data.length !== 0) {
        store.commit('SET_PLAYING_SEATS', response.data.data)
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
