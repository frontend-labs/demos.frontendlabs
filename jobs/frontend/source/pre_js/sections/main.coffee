App = (->
	dom = {}
	st =
		lnkLogin: ".lnk-login"
		loginBox: ".login-box"
		modal: ".modal"
		modalContent: ".modal-content"
		btnCloseModal: ".close-modal"
		filterSearchBar: "header .filter-search"
		headerTop: "header .header-top"

	catchDom = ->
		dom.lnkLogin = $(st.lnkLogin)
		dom.loginBox = $(st.loginBox)
		dom.modal = $(st.modal)
		dom.modalContent = $(st.modalContent)
		dom.btnCloseModal = $(st.btnCloseModal)
		dom.filterSearchBar = $(st.filterSearchBar)
		dom.headerTop = $(st.headerTop)

		return

	subscribeEvents = ->
		dom.lnkLogin.on "click", events.showLoginBox
		dom.btnCloseModal.on "click", events.closeModal
		$(window).on "scroll", events.fixHeader
		return

	events =
		showLoginBox: ->
			dom.modal.addClass('modal--open')
			dom.modalContent.animateCSS("don")# , {duration: 600}) 
			return

		closeModal: ->
			dom.modalContent.animateCSS("bounceOut", ->
				dom.modal.removeClass('modal--open')
				)
			return

		fixHeader: ->
			if $(".board").length # only works in index
				barPosition = dom.headerTop.height()
				if $(window).scrollTop() >= barPosition
					$("body").addClass "fixed"
				else 
					$("body").removeClass "fixed"
			return

	functions =
		floatLabels: ->
			$('input.floatlabel').floatlabel()
			return



	initialize = ->
		catchDom()
		$ ->
			subscribeEvents()
			functions.floatLabels({ 
				transitionEasing: 'ease' 
				labelStartTop: '50px'
				labelEndTop: '40px'
				})
			return
		return

	init: initialize
)()
App.init()
