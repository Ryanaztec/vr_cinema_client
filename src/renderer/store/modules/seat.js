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
  SET_PLAYING_SEATS: (state, seats) => {
    state.playingSeats.push(seats)
  },
  SET_SEAT_PLAYING_STATUS: (state, params) => {
    state.seats[params.index].status = params.status
  },
  REMOVE_PLAYING_SEATS: (state, seats) => {
    seats.forEach((value, key) => {
      state.playingSeats.forEach((item, index) => {
        if (item.seat_id === value.seat_id) {
          state.playingSeats.splice(index, 1)
        }
      })
    })
  }
}

const actions = {
  GetPlayingStatusSeats (store, id) {
    API.getPlayingSeats({cinema_id: id}).then(response => {
      if (response.data.data.length !== 0) {
        response.data.data.forEach((value, key) => {
          store.commit('SET_PLAYING_SEATS', value)
        })
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
