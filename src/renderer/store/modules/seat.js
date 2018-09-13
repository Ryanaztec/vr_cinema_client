import API from '../.././service/api'
const state = {
  seats: [],
  playingSeats: []
}

const mutations = {
  SET_SEATS: (state, seats) => {
    state.seats = seats
  },
  SET_PLAYING_SEATS: (state, seats) => {
    state.playingSeats.push(seats)
  },
  SET_SEAT_PLAYING_STATUS: (state, params) => {
    state.seats[params.index].status = params.status
  },
  SET_SEAT_PLAYING_TIME: (state, params) => {
    state.seats[params.index].time = params.time
  },
  SET_SEAT_PLAYING_MOVIE: (state, params) => {
    state.seats[params.index].movie = params.movie
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
