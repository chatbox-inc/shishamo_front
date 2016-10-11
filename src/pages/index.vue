<template lang="html">
	<div class="cover">
		<div class="content">
			<h1>Shishamo</h1>
			<form v-on:submit.prevent="login">
				<div class="form-group">
					<label for="exampleInputEmail1">メールアドレス</label>
					<input type="email" class="form-control" placeholder="user@example.com" v-model="email">
				</div>

				<div class="form-group">
					<label for="exampleInputEmail1">パスワード</label>
					<input type="password" class="form-control" placeholder="Your password" v-model="password">
				</div>

				<div class="flex-center" style="margin-top:30px;">
					<button type="submit" class="btn btn-primary">ログイン</button>
				</div>
			</form>
		</div>
	</div>
</template>

<style scoped>
.cover{
	margin: 0;
	padding: 0;
	position: absolute;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	color: #fff;
	background: linear-gradient(hsl(210, 36%, 43%), hsl(210, 36%, 33%));
	display: flex;
	align-items: center;
	justify-content: center;
}

.flex-center{
	display: flex;
	align-items: center;
	justify-content: center;
}

h1{
	margin: 10px auto 30px;
	text-align: center;
}

form{
	padding: 20px 80px 30px;
	color: #999;
	background: #fff;
	border-radius: 1px;
}
</style>

<script>
export default {
	data: function () {
		return {
			email: "",
			password: ""
		};
	},
	computed: {},
	ready: function () {},
	attached: function () {},
	methods: {
		login: function(){
			this.$http.post(
				"login",
				{
					email    : this.email,
					password : this.password
				}
			).then(
				(res)=>{
					console.log("OK:", res.body);

					localStorage.email = this.email;
					localStorage.token = res.body.user.token;
					localStorage.authority = res.body.user.authority;

					location.href = "/buckets/";
				},
				(err)=>{
					console.log("NG", err);
				}
			);
		}
	},
	components: {}
};
</script>
