// composables/useScrollToAnchor.js
export const useScrollToAnchor = (offset = 120) => {
	const scrollToAnchor = (id) => {
		if (!id) return

		const el = document.getElementById(id)
		if (!el) return

		const y =
			el.getBoundingClientRect().top +
			window.pageYOffset -
			offset

		window.scrollTo({
			top: y,
			behavior: 'smooth',
		})
	}

	return { scrollToAnchor }
}
