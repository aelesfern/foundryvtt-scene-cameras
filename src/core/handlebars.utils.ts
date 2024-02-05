Handlebars.registerHelper('lookupProp', function (obj, key, prop) {
	if (!obj) return null;
	return obj[key] && obj[key][prop];
});
Handlebars.registerHelper('concat3', function (a, b, c) {
	return a + b + c;
});

Handlebars.registerHelper('log', function (data) {
	console.log(data);
});
