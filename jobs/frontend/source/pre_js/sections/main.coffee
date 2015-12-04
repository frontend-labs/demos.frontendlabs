ani = 'nombre'
###App = (->
	dom = {}
	st =
		body: ".body"
	catchDom = ->
		dom.body = $(st.body)

	subscribeEvents = ->
		dom.body.on "click", events.myFunction
		return

	events =
		myFunction: ->
			dom.body.css 'background', 'green'
			return

	initialize = ->
		catchDom()
		subscribeEvents()

	init: initialize
)()
App.init()###