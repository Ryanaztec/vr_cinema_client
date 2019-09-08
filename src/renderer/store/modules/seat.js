import API from '../.././service/api'
const state = {
  seats: [],
  playingSeats: [],
  isMain: false,
  currentSeat: '',
  mainSeat: ''
}

const mutations = {
  SET_SEATS: (state, seats) => {
    state.seats = seats
  },
  SET_IS_MAIN: (state, status) => {
    state.isMain = status
  },
  ADD_PLAYING_SEATS: (state, seats) => {
    state.playingSeats.push(seats)
  },
  SET_PLAYING_SEATS: (state, seats) => {
    state.playingSeats = seats
  },
  SET_CURRENT_SEAT: (state, seat) => {
    state.currentSeat = seat
  },
  SET_MAIN_SEAT: (state, seat) => {
    state.mainSeat = seat
  },
  UPDATE_PLAYING_SEATS: (state, seat) => {
    state.playingSeats.forEach((value, key) => {
      if (value.id === seat.id) {
        state.playingSeats.splice(key, 1)
      }
    })
    state.playingSeats.push(seat)
  },
  REMOVE_PLAYING_SEATS: (state, id) => {
    state.playingSeats.forEach((value, key) => {
      if (value.id === id) {
        state.playingSeats.splice(key, 1)
      }
    })
    console.log(state.playingSeats, id)
  }
}

const actions = {
  GetPlayingStatusSeats (store, params) {
    API.getPlayingSeats(params).then(response => {
      if (response.data.data && response.data.data.length !== 0) {
        response.data.data.forEach((item, index) => {
          item.playingStarted = true
        })
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
