<template>
    <div>
        <notifications
                class="custom-notification"
                group="foo"
                position="bottom left"
                animation-type="velocity"
                :duration="1000"
                animation-name="v-fade-left"/>
    </div>
</template>

<script>
  export default {}
</script>

<style>
    .vue-notification {
        background-image: -webkit-linear-gradient( -90deg, rgb(97,255,255) 0%, rgb(25,236,236) 100%) !important;
        border-left: none !important;
        color: #333;
        font-family: "Microsoft YaHei";
    }
</style>
