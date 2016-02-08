// main.js
// This file contains all the main javascript file regarding to the application

// if localStorage isn't available
(function () {
	if (!window.localStorage) {
		document.body.textContent = "Upgrade to a better browser which includes localStorage"
	}
})()


// Model for all the favorite gifs in using browser's localStorage API

// favorite Gifs will be stored by their id in the localStorage
var favoriteGifsModel = {
	init: function () {
		this.localStorageCheck()
	},
	getAllGifs: function () {
		return this.giphyStorage
	},
	getGifById: function (id) {
		var result = this.giphyStorage.filter(function (gifId) {
			return gifId == id
		})

		return result && result[0]
	},
	addGifById: function (id) {
		this.giphyStorage.push(id)
		this.localStoragePersist()
	},
	localStorageCheck: function () {
		if (!localStorage.giphyStorage) {
			this.localStorageInit()
			return
		}
		this.giphyStorage =  JSON.parse(localStorage.giphyStorage)
	},
	localStorageInit: function () {
		this.giphyStorage = []
		this.localStoragePersist()
	},
	localStoragePersist: function () {
		try {
			localStorage.setItem("giphyStorage", JSON.stringify(this.giphyStorage))
		}
		catch (error) {
			console.error(error)
		}
	}
}

// giphyService to communicate with the giphyApi
var giphyService =  {
	init: function (key) {
		this.giphyKey = key || "dc6zaTOxFJmzC"
		this.baseUrl = "https://api.giphy.com"
		this.endpoints = {
			search: "/v1/gifs/search",
			gifById: "/v1/gifs/:gifId",
			trending: "/v1/gifs/trending",
			gifsById: "/v1/gifs"
		}
	},
	search: function (q, limit, rating) {
		var params = {
			q: q,
			limit: limit,
			rating: rating || undefined,
			api_key: this.giphyKey
		}

		return $.ajax({
			url: this.baseUrl + this.endpoints.search,
			data: params,
		})
	},
	trending: function (limit) {
		return $.ajax({
			limit: limit,
			url: this.baseUrl + this.endpoints.trending,
			data: {
				api_key: this.giphyKey
			}
		})
	},
	searchById: function (id) {
		if (!id) {
			var id = "YyKPbc5OOTSQE"
		}

		return $.ajax({
			url: this.baseUrl + this.endpoints.gifById.replace(":gifId", id),
			data: {
				api_key: this.giphyKey
			}
		})
	},
	getGifs: function (ids) {
		if (!ids) {
			console.log("no ids given for gifs")
			return
		}

		return $.ajax({
			url: this.baseUrl + this.endpoints.gifsById,
			data: {
				api_key: this.giphyKey,
				ids: ids.join(",")
			}
		})
	}
}


var giphyOctopus = {
	init: function () {
		favoriteGifsModel.init()
		giphyService.init()
		favortieView.init()
	},
	getAllGifsData: function () {
		return giphyService.getGifs(favoriteGifsModel.getAllGifs())
	},
	addGifById: function (id) {
		favoriteGifsModel.addGifById(id)
	}
}

// gif result for showing all types of results about gifs
var gifResultView = {
	init: function () {
	},
	gifRender: function () {

	}
}

var favortieView = {
	init: function () {
		this.favortieView = $("#favortieView")
		var addGifBtn = $("#addGifBtn")
		addGifBtn.on("click", function (event) {
			var gifIdInput = $("#gifIdInput")
			giphyOctopus.addGifById(gifIdInput.val())
			this.render()
		}.bind(this))
	},
	render: function () {
		var panel = this.favortieView
		giphyOctopus.getAllGifsData()
			.then(function (data) {
				
			})
	}
}

giphyOctopus.init()