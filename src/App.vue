<template lang="html">
	<div id="app">
		<main-header></main-header>
		<div class="contents">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
const MainHeader = require("./parts/MainHeader.vue");

export default {
	data: function () {
		return {
		};
	},
	computed: {},
	ready: function () {},
	attached: function () {},
	methods: {},
	components: {
		MainHeader
	}
};
</script>

<style scoped>

#app{
	font-family: "Hiragino Sans", Meiryo, sans-serif;
}

.contents{
	padding: 10px;
}
</style>
