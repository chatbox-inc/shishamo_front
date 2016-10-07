<template lang="html">
	<div class="container">
		<div class="row">
			<div class="col col-sm-3">
				<h3>Buckets</h3>
				<div class="list-group" style="margin-top: 50px;">
					<a href="#" class="list-group-item" v-if="buckets.length == 0">Loading...</a>
					<a href="#" class="list-group-item {{bucket.Name == this.$route.query.name ? 'active' : ''}}" v-on:click="execReflesh" v-for="bucket in buckets">{{bucket.Name}}</a>
				</div>
			</div>

			<div class="col col-sm-3">
				<h3 class="flex-between" style="margin-bottom: 16px;">
					<span>Files</span>
					<a href="#" class="btn btn-primary btn-sm" v-on:click="showUpload" v-if="authority >= 1">アップロード</a>
				</h3>

				<ul class="path-tree">
					<li>
						<a href="#" v-on:click="moveDir" data-depth="0"> / </a>
					</li>
					<li v-for="(index, element) in tree">
						<a href="#" v-on:click="moveDir" data-depth="{{index+1}}">{{element}}</a>
					</li>
				</ul>

				<div class="list-group">
					<a href="#" class="list-group-item" v-if="files.length == 0">Loading...</a>
					<a href="#" class="list-group-item {{file.Key == selectedFilePath ? 'active' : ''}}" v-for="file in showFiles" v-on:click="selectFile" data-path="{{file.Key}}">
						{{file.ShowName}}
					</a>
				</div>
			</div>

			<div class="col col-sm-4" v-if="isSelectFile">
				<h3>{{selectedFilePath + "/"}}</h3>
				<div class="media">
					<div class="media-left">
						<div class="flex-center" style="width:48px;height:48px;">
							<span class="mega-octicon octicon-file{{icon}}"></span>
						</div>
					</div>
					<div class="media-body">
						<h4 class="media-heading" v-if="isSelectedDirectory">{{selectedFilePath}}</h4>
						<h4 class="media-heading" v-else>{{selectedFileName}}</h4>
					</div>
				</div>

				<div class="list-group">
					<a href="#" v-on:click="downloadObject" class="list-group-item"><i class="glyphicon glyphicon-download"></i> ダウンロード</a>
					<a href="#" v-on:click="deleteObject" class="list-group-item list-group-item-danger">&times;　削除</a>
				</div>
			</div>
		</div>
	</div>

	<form style="display:none;" enctype="multipart/form-data">
		<input type="file" v-on:change="execUpload" name="file">
	</form>

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

.list-group{
	overflow-x: hidden;
	overflow-y: auto;
	word-break: break-all;
	max-height: calc(100vh - 150px);
}

.thumbnail{
	border: none;
}

.media{
	margin-bottom: 20px;
}

.list-group .list-group-item.list-group-item-danger{
	color: #fff;
	background: #DB524B;
	cursor: pointer;
}

.flex-center{
	display: flex;
	align-items: center;
	justify-content: center;
}

.flex-between{
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.path-tree{
	list-style: none;
	min-height: 30px;
	margin: 0;
	padding: 0 0 10px 0;
}

.path-tree li{
	display: inline-block;
	margin-left: 7px;
}

.path-tree li:after{
	content: " / ";
}

.path-tree li:first-child:after{
	content: "";
}

.path-tree li:nth-child(2){
	content: "";
	margin-left: 0;
}

.media{
	display: flex;
	align-items: center;
}
</style>

<script>
const BucketsStore = require("../../stores/BucketsStore.js");

export default {
	data: function (){
		return {
			busy    : false,
			icon    : null,
			buckets : [],
			files   : [],
			showFiles : [],
			tree        : [],
			isSelectFile: false,
			selectedFilePath: "",
			selectedFileName: "",
			authority : localStorage.authority,
			isSelectedDirectory: false,
			stores: {
				BucketsStore: BucketsStore
			}
		};
	},
	route: {
		activate: function(){
			this.reflesh();

			this.$http.get(
				"users/me"
			).then(
				(res)=>{
					const myBuckets = JSON.parse(res.body.user.buckets || "[]");
					console.log(myBuckets);
					myBuckets.map((bName)=>{
						this.showBuckets.push(
							this.buckets.find((bucket)=>{
								return bucket.Name == bName;
							})
						);
					});
				},
				(err)=>{
					console.log("Error:", err);
					console.log("プロフィールの取得に失敗しました。");
				}
			);
		}
	},

	methods: {
		execReflesh: function(e){
			e.preventDefault();
			this.$route.router.replace(`/buckets/detail/?name=${e.target.innerText}`);
			this.reset();
		},

		reset: function(){
			this.files = [];
			this.showFiles = [];
			this.selectedFilePath = "";
			this.isSelectFile = false;
			this.tree = [];
			this.busy = true;
			setTimeout(() =>{
				this.reflesh();
				this.busy = false;
			}, 200);
		},

		reflesh: function(){
			console.log(this.$route.params);

			this.buckets = this.stores.BucketsStore.data;
			if(this.stores.BucketsStore.data.length == 0){
				this.$http.get("buckets").then(
					(res) => {
						console.log("Data", res);
						if(!this.busy){
							this.buckets = res.body.buckets;
							this.stores.BucketsStore.data = res.body.buckets;
						}
					},
					(err) => {
						console.log("Error", err);
					}
				);
			}

			this.files = [];
			this.showFiles = [];
			this.$http.get(`buckets/${this.$route.query.name}/objects`).then(
				(res) => {
					console.log("Data", res);
					console.log(res.body.objects);
					this.files = res.body.objects;
					this.files.map((object) => {
						if(object.Key.indexOf("/") != "-1"){
							let data = object;
							data = Object.assign(
								{},
								data,
								{
									Key      : data.Key.split("/")[0] + "/",
									ShowName : data.Key.split("/")[0] + "/",
								}
							);
							console.log(this.showFiles.find((file)=>{return file.Key == data.Key;}) ? "True" : "False");
							if(!this.showFiles.find((file)=>{return file.Key == data.Key;})){
								this.showFiles.push(data);
								console.log("Push");
							}
						}else{
							this.showFiles.push(
								Object.assign({},
									object, {ShowName : object.Key}
								)
							);
						}
					});
				},
				(err) => {
					console.log("Error", err);
				}
			);
		},

		selectFile: function(e){
			e.preventDefault();
			this.selectedFilePath = e.target.getAttribute("data-path");
			this.selectedFileName = this.selectedFilePath.split("/").pop();
			this.selectedFilePath = this.selectedFilePath.split("/");
			this.isSelectedDirectory = this.selectedFilePath.pop() === "";
			this.selectedFilePath = this.selectedFilePath.join("/");

			if(this.isSelectedDirectory){
				this.showFiles = [];
				this.tree.push(this.selectedFilePath.split("/")[this.tree.length]);
				console.log(this.tree.join("/")+"/");
				this.files.map((object) => {
					if(object.Key.indexOf(this.selectedFilePath) != "-1"){
						let data = object;
						data = Object.assign(
							{},
							data,
							{
								Key      : this.tree.join("/")+"/" + data.Key.split("/")[this.tree.length] + (data.Key.split("/")[this.tree.length].indexOf(".") != -1 ? "" : "/"),
								ShowName : data.Key.split("/")[this.tree.length] + (data.Key.split("/")[this.tree.length].indexOf(".") != -1 ? "" : "/"),
							}
						);
						if(!this.showFiles.find((file)=>{return file.Key == data.Key;})){
							this.showFiles.push(data);
						}
					}
				});
				this.isSelectFile = false;
			}else{
				const dic = {
					png:"-media",jpg:"-media",gif:"-media",jpeg:"-media",
					zip:"-zip"  ,gz :"-zip","7zip":"-zip",
					pdf:"-pdf",
					html:"-code",css:"-code",js:"-code",htm:"code",json:"code",rb:"code",py:"code",yml:"code"
				};
				this.icon = dic[this.selectedFileName.split(".").pop()] || "";
				this.isSelectFile = true;
			}
			console.log(this.selectedFilePath);
		},

		downloadObject: function(){
			window.open(`buckets/${this.$route.query.name}/objects/raw?name=${this.selectedFilePath ? this.selectedFilePath+"/" : ""}${this.selectedFileName}`);
		},

		deleteObject: function(){
			if(window.confirm("本当に削除しますか？")){
				this.$http.delete(
					`buckets/${this.$route.query.name}/objects`,
					{
						body: {
							key: `${this.selectedFilePath}/${this.selectedFileName}`
						}
					}
				).then(
					() => {
						this.reset();
					},
					() => {
						this.reset();
					}
				);
			}
		},

		moveDir: function(e){
			e.preventDefault();
			const depth = +e.target.getAttribute("data-depth");

			this.isSelectFile = false;
			this.tree = this.tree.slice(0,depth);
			this.showFiles = [];

			if(depth){
				this.files.map((object) => {
					if(object.Key.indexOf(this.tree.join("/")) != "-1"){
						let data = object;
						data = Object.assign(
							{},
							data,
							{
								Key      : this.tree.join("/")+"/" + data.Key.split("/")[this.tree.length] + (data.Key.split("/")[this.tree.length].indexOf(".") != -1 ? "" : "/"),
								ShowName : data.Key.split("/")[this.tree.length] + (data.Key.split("/")[this.tree.length].indexOf(".") != -1 ? "" : "/"),
							}
						);
						if(!this.showFiles.find((file)=>{return file.Key == data.Key;})){
							this.showFiles.push(data);
						}
					}
				});
			}else{
				this.files.map((object) => {
					if(object.Key.indexOf("/") != "-1"){
						let data = object;
						data = Object.assign({},
							data,
							{
								Key      : data.Key.split("/")[0] + "/",
								ShowName : data.Key.split("/")[0] + "/",
							}
						);
						console.log(this.showFiles.find((file)=>{return file.Key == data.Key;}) ? "True" : "False");
						if(!this.showFiles.find((file)=>{return file.Key == data.Key;})){
							this.showFiles.push(data);
						}
					}else{
						this.showFiles.push(
							Object.assign({},
								object, {ShowName : object.Key}
							)
						);
					}
				});
			}
		},

		showUpload: function(e){
			e.preventDefault();
			const $ = (el) => document.querySelector(el);
			$("input[type='file']").click();
		},

		execUpload: function(){
			const $ = require("jquery");
			const path = (this.tree.join("/").length ? this.tree.join("/") + "/" : "") + $("input[type='file']").prop("files")[0].name;

			const form = new FormData();
			form.append("path", path);
			form.append("media", $("input[type='file']").prop("files")[0]);
			console.log("File:", $("input[type='file']").prop("files")[0]);
			console.log("FormData:", form);

			$.ajax({
				url: `https://shishamo-backend.herokuapp.com/api/buckets/${this.$route.query.name}/objects`,
				type: "POST",
				data: form,
				processData: false,  // jQuery がデータを処理しないよう指定
				contentType: false   // jQuery が contentType を設定しないよう指定
			});
		}
	}
};
</script>