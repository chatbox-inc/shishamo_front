<template lang="html">
	<div class="container">
		<div class="row">
			<div class="col col-sm-3">
				<h3>Buckets <i class="glyphicon glyphicon-info-sign"></i></h3>
				<div class="list-group" style="margin-top: 50px;">
				<div class="list-group">
					<a href="#" class="list-group-item" v-if="buckets.length == 0">Loading...</a>
					<a href="#" class="list-group-item" v-link="{path : '/buckets/detail?name='+bucket.Name}" v-for="bucket in buckets">{{bucket.Name}}</a>
				</div>
			</div>
		</div>
	</div>

	<div class="modal-dialog">
		<div class="modal-dialog-content">

		</div>
	</div>
</template>

<style scoped>
i.glyphicon{
	font-size: 14px;
	color: #3E6185;
	cursor: pointer;
}

h3{
	margin: 0 0 20px;
}
</style>

<script>
const BucketsStore = require("../../stores/BucketsStore.js");

export default {
	data: function (){
		return {
			buckets : [],
			stores: {
				BucketsStore: BucketsStore
			}
		};
	},
	route: {
		activate: function(){
			this.buckets = this.stores.BucketsStore.data;
			if(this.stores.BucketsStore.data.length == 0){
				this.$http.get("buckets").then(
					(res) => {
						console.log("Data", res);
						this.buckets = res.body.buckets;
						this.stores.BucketsStore.data = res.body.buckets;
					},
					(err) => {
						console.log("Error", err);
					}
				);
			}
		}
	}
};
</script>