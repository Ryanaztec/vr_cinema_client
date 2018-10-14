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
          if (completed !== 0) {
            progress.push({ variant: seatNumber, value: completed })
          }
        }
      })
      var compare = function (prop) {
        return function (obj1, obj2) {
          var val1 = obj1[prop]
          var val2 = obj2[prop]
          if (val1 < val2) {
            return -1
          } else if (val1 > val2) {
            return 1
          } else {
            return 0
          }
        }
      }
      progress.sort(compare('variant'))
      return progress
    }
  }
}
</script>