function escapeRegex(string) {
	return string.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, "\\$&");
}
