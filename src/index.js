if(location.pathname !== "/" && !( "token" in localStorage)){
	location.href = "/";
	document.querySelector("body").style.display = "none";
}

const Vue = require("vue");
const VueRouter = require("vue-router");
const VueResource = require("vue-resource");
Vue.use(VueRouter);
Vue.use(VueResource);

Vue.http.options.root = "http://shishamo-backend.herokuapp.com/api";
if("token" in localStorage) Vue.http.headers.common["Authorization"] = localStorage.token;

const App = Vue.extend(require("./App.vue"));
const router = new VueRouter({
	hashbang: false,
	history: true,
});

// Components require here.

// Pages require here.

const Index = require("./pages/index.vue");
const Buckets = {
	"index": require("./pages/buckets/index.vue"),
	"detail": require("./pages/buckets/detail.vue")
};

const Users = {
	"index": require("./pages/users/index.vue")
};

// Routing

router.map({

	"/": {
		component: Index
	},

	"/buckets/": {
		component: Buckets["index"]
	},

	"/buckets/detail/": {
		component: Buckets["detail"]
	},

	"/users/": {
		component: Users["index"]
	},

});

router.start(App, "#app");

router.afterEach(function (transition) {
	if(transition.to.path !== "" && !( "token" in localStorage)){
		location.href = "/";
	}
});