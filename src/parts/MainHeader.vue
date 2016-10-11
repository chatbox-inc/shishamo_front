<template lang="html">
	<header class="navbar navbar-inverse">
		<div class="navbar-header">
			<a class="navbar-brand" v-link="{path: '/buckets/'}">Shishamo</a>
		</div>

		<div class="collapse navbar-collapse">
			<ul class="nav navbar-nav">
				<li><a v-link="{path : '/buckets/'}">S3バケット一覧 <span class="sr-only">(current)</span></a></li>
				<li v-if="authority >= 2"><a v-link="{path : '/users/'}">ユーザー管理 <span class="sr-only">(current)</span></a></li>
			</ul>

			<ul class="nav navbar-nav navbar-right">
				<li class="dropdown">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
						{{email}} <span class="caret"></span>
					</a>
					<ul class="dropdown-menu">
						<li><a v-on:click="logout">ログアウト</a></li>
					</ul>
				</li>
			</ul>
		</div>
	</header>
</template>

<style scoped>
.navbar.navbar-inverse{
	border-radius: 0;
	background: #3F6284;
	border: none;
}

.navbar.navbar-inverse .navbar-brand{
	color: rgba(255,255,255,1.0) !important;
}

.navbar.navbar-inverse *{
	color: rgba(255,255,255,0.5) !important;
}

.navbar.navbar-inverse *:hover{
	color: rgba(255,255,255,1.0) !important;
}

.navbar-inverse .navbar-nav>.active>a{
	background: rgba(0,0,0,0.1);
}

.navbar.navbar-inverse .dropdown-menu a{
	color: rgba(0,0,0,0.7) !important;
	cursor: pointer;
}
</style>

<script>
export default {
	data: function () {
		return {
			email    : localStorage.email,
			authority: localStorage.authority
		};
	},
	computed: {},
	ready: function () {},
	attached: function () {},
	methods: {
		logout: function(){
			delete　localStorage.authority;
			delete　localStorage.token;
			location.href = "/";
		}
	},
	components: {}
};
</script>
