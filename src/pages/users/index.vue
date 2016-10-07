<template lang="html">
	<div class="container">
		<div class="row">
			<div class="col col-sm-3">
				<h3>Users</h3>
				<div class="list-group">
					<a href="#" class="list-group-item" v-if="users.length == 0">Loading...</a>
					<a href="#" class="list-group-item" v-for="user in users" data-id="{{user.id}}" v-on:click="switchDetailMode">{{user.email}}</a>
					<a href="#" class="list-group-item active" v-on:click="switchCreateMode">+ 新規作成</a>
				</div>
			</div>

			<div class="col col-sm-4" v-if="isCreateMode">
				<h3>新規作成</h3>
				<form id="makeUser" v-on:submit.prevent="makeUser">
					<div class="form-group">
						<label for="exampleInputEmail1">メールアドレス</label>
						<input type="email" class="form-control" placeholder="user@example.com" v-model="formData.email">
					</div>

					<div class="form-group">
						<label for="exampleInputEmail1">パスワード</label>
						<input type="password" class="form-control" placeholder="Your password" v-model="formData.password">
					</div>

					<div class="form-group">
						<label for="exampleInputEmail1">権限</label><br>
						<select v-model="formData.authority">
							<option value="0">閲覧ユーザー</option>
							<option value="2">編集ユーザー</option>
							<option value="2">管理者ユーザー</option>
						</select>
					</div>

					<button type="submit" class="btn btn-primary">+ 新規作成</button>
				</form>
			</div>

			<div class="col col-sm-4" v-if="isDetailMode">
				<h3>{{user.email}}</h3>

				<small>ユーザーID</small>
				<p>{{user.id}}</p>

				<small>メールアドレス</small>
				<p>{{user.email}}</p>

				<small>権限</small>
				<p>
					<span v-if="user.authority == 0">閲覧ユーザー</span>
					<span v-if="user.authority == 1">編集ユーザー</span>
					<span v-if="user.authority == 2">管理者ユーザー</span>
				</p>

				<small>閲覧可能バケット</small>
				<p>
					<form id="allowBuckets">
						<ul style="list-style:none;padding-left:0;">
							<li v-for="bucket in buckets">
								<label style="font-weight:normal;">
									<span v-if="bucket.Name == userBuckets[bucket.Name]">
										<input type="checkbox" name="buckets[]" v-bind:data-name="bucket.Name" checked="">　{{bucket.Name}}
									</span>

									<span v-else>
										<input type="checkbox" name="buckets[]" v-bind:data-name="bucket.Name" v-else>　{{bucket.Name}}
									</span>
								</label>
							</li>
						</ul>
					</form>
				</p>

				<p>
					<button type="button" class="btn btn-primary btn-sm" v-on:click="updateUser">設定を適用</button> <button type="button" class="btn btn-danger btn-sm" v-on:click="deleteUser">ユーザー削除</button>
				</p>

			</div>
		</div>
	</div>
</template>

<style scoped>
h3{
	margin: 0 0 20px;
}
</style>

<script>
const BucketsStore = require("../../stores/BucketsStore.js");

export default {
	data: function (){
		return {
			user    : {id: null, email: null, authority: null},
			users   : [],
			userBuckets: {},
			buckets : [],
			isDetailMode : false,
			isCreateMode : false,
			stores  : {
				BucketsStore: BucketsStore
			},
			formData: {
				email: "",
				password: "",
				authority: "0"
			}
		};
	},
	route: {
		activate: function(){
			this.$http.get(
				"users"
			).then(
				(res) => {
					this.users = res.body.users;
					console.log(this.users);
				},
				(err) => {
					console.log(err);
					alert(`エラーが発生しました。\n${err.res.body.message}`);
				}
			);

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
						alert(`エラーが発生しました。\n${err.res.body.message}`);
					}
				);
			}
		}
	},
	methods: {
		reflesh: function(){
			this.user.id = null;
			this.user.email = null;
			this.user.authority = null;

			this.users = [];

			this.isDetailMode = false;
			this.isCreateMode = false;

			this.$http.get(
				"users"
			).then(
				(res) => {
					this.users = res.body.users;
					console.log(this.users);
				},
				(err) => {
					console.log(err);
					alert(`エラーが発生しました。\n${err.res.body.message}`);
				}
			);
		},

		switchCreateMode: function(){
			this.isCreateMode = true;
			this.isDetailMode = false;
		},

		switchDetailMode: function(e){
			e.preventDefault();
			this.user = this.users.find((u)=>{
				return u.id == e.target.getAttribute("data-id");
			});

			this.userBuckets = {};

			JSON.parse(this.user.buckets || "[]").map((bucket)=>{
				this.userBuckets[bucket] = bucket;
			})
			console.log(this.userBuckets);

			this.isDetailMode = true;
			this.isCreateMode = false;
		},

		makeUser: function(){
			this.$http.post(
				"users",
				this.formData
			).then(
				()=>{
					this.reflesh();
				},
				()=>{
					this.reflesh();
				}
			);

		},

		updateUser: function(e){
			e.preventDefault();

			const $ = require("jquery");
			let checks = [];
			$("#allowBuckets [type='checkbox']:checked").each(function(){
				checks.push(this.getAttribute("data-name"));
			});
			console.log(checks);

			this.$http.put(
				`users/${this.user.id}`,
				{
					buckets: JSON.stringify(checks)
				}
			).then(
				()=>{
					this.reflesh();
				},
				()=>{
					this.reflesh();
				}
			);

		},

		deleteUser: function(){
			if(window.confirm("本当に削除しますか？")){
				this.$http.delete(
					`users/${this.user.id}`
				).then(
					()=>{
						this.reflesh();
					},
					()=>{
						this.reflesh();
					}
				);
			}
		}
	}
};
</script>