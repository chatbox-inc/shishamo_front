if(location.pathname !== "/" && !( "token" in localStorage)){
	location.href = "/";
	document.querySelector("body").style.display = "none";
}

const Vue = require("vue");
const VueRouter = require("vue-router");
const VueResource = require("vue-resource");
const API_ROOT = "http://localhost:8000/api";
Vue.use(VueRouter);
Vue.use(VueResource);

Vue.http.options.root = API_ROOT;
if("token" in localStorage) Vue.http.headers.common["Authorization"] = localStorage.token;

const App = Vue.extend(require("./App.vue"));
const router = new VueRouter({
	hashbang: false,
	history: true,
});

// Components require here.

const ApplicationStore = require("./stores/ApplicationStore.js");
ApplicationStore.root = API_ROOT;

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