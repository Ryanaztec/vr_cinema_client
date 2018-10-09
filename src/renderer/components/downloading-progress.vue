<template>
  <div>
    <div v-for="bar in bars" class="row mb-1">
      <div class="col-sm-2">{{ bar.variant }}</div>
      <div class="col-sm-10 pt-1">
        <b-progress :value="bar.value"
                    :variant="bar.variant"
                    show-progress
        ></b-progress>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    movieInfo: {
      default: [],
      required: false
    }
  },
  data () {
    return {}
  },
  mounted () {},
  computed: {
    bars () {
      let progress = []
      let seatNumber = ''
      this.$store.state.movie.subSeatDownloadingStatus.forEach((value, key) => {
        let completed = 0
        if (value.movie_id === this.movieInfo.id) {
          completed = value.percentage
          this.$store.state.seat.seats.forEach((item, index) => {
            if (item.id === value.seat_id) {
              seatNumber = item.seat_number.toString()
            }
          })
          progress.push({variant: seatNumber, value: completed})
        }
      })
      return progress
    }
  }
}
</script>