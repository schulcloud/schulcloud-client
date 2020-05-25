/* eslint-disable max-len */
const { CORS } = require('../config/global');

const config = {
	enabled: CORS === '1',

	// Settings for HTTP Content-Security-Policy Header
	contentSecurityPolicy: {

		// Use 'strict-dynamic' 'nonce-<nonceValue>' (nonceValue auto generated) to create a whitelist
		corsDefault: {
			defaultSrc: "'self' data: blob: https://api.schul-cloud.org https://scchat.schul-cloud.org https://s3.hidrive.strato.com https://libreoffice.schul-cloud.org https://docs.schul-cloud.org https://edtrio.schul-cloud.org https://etherpad.schul-cloud.org https://blog.schul-cloud.org https://sc-content-resources.schul-cloud.org https://sentry.schul-cloud.dev https://open.hpi.de https://upload.wikimedia.org https://user-images.githubusercontent.com",
			fontSrc: "'self' data:",
			styleSrc: "'self' 'unsafe-inline'",
			// scriptSrc: "'strict-dynamic' 'unsafe-eval' 'nonce-<nonceValue>'",
			scriptSrc: "'self' 'unsafe-eval' 'unsafe-inline'",
			// Please activate for production
			// upgradeInsecureRequestsSrc: 'upgrade-insecure-requests',
			// blockAllMixedContentSrc: 'block-all-mixed-content',
		},

		/*
			Content-Security-Policy Header (added to default header) depending on the site
			site is matched with called website URL and regex key within corsSiteSpecific
			use * as value for defaultSrc, fontSrc, styleSrc, scriptSrc ... to ignore corsDefault and allow any external content
		*/
		corsSiteSpecific: {
			'^/$': {
				defaultSrc: 'https://www10-fms.hpi.uni-potsdam.de https://play.google.com https://blog.schul-cloud.org https://s3.hidrive.strato.com https://schul-cloud-hpi.s3.hidrive.strato.com',
			},
			'^/administration': {
			},
			'^/calendar': {
			},
			'^/content': {
				defaultSrc: 'https://pichasso.xopic.de',
				fontSrc: 'https://fonts.gstatic.com',
			},
			'^/dashboard': {
				defaultSrc: 'https://www10-fms.hpi.uni-potsdam.de',
			},
			'^/courses': {
				defaultSrc: 'https://nexboard.nexenio.com https://www.geogebra.org https://lti.tools https://codeocean.openhpi.de https://acc.bettermarks.com https://moodle.schul-cloud.org',
				fontSrc: 'https://vjs.zencdn.net https://fonts.googleapis.com https://cdn.jsdelivr.net',
				styleSrc: 'https://vjs.zencdn.net',
			},
			'^/files': {
				fontSrc: 'https://vjs.zencdn.net',
				styleSrc: 'https://vjs.zencdn.net',
			},
			'^/help/faq/documents': {
			},
			'^/homework': {
				fontSrc: 'https://fonts.gstatic.com',
			},
			'^/news': {
			},
			'^/teams': {
				fontSrc: 'https://vjs.zencdn.net',
				styleSrc: 'https://vjs.zencdn.net',
			},
		},
	},
	/*
		Access-Control-Allow-Origin header depending on the site
		site is matched with called website URL and regex key within accessControlAllowOrigin
		several allowed origins per route can be added by seperation with |
		if several regex match the URL routes will be joined
		if no regex is given for URLs the Access-Control-Allow-Origin will not be set
	*/
	accessControlAllowOrigin: {
		'^/rocketChat/authGet': 'https://scchat.schul-cloud.org',
	},
	// Additional default Security header can be set - key reprensents the HTTP header and the value the value of the header
	additionalSecurityHeader: {
		'Access-Control-Allow-Credentials': 'true',
		'X-Content-Type-Options': 'nosniff',
		'X-Download-Options': 'noopen',
		'X-Frame-Options': 'sameorigin',
		'X-Robots-Tag': 'none',
		'X-XSS-Protection': '1; mode=block',
		'Referrer-Policy': 'same-origin',
		'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
		'Feature-Policy': "vibrate 'self'; speaker *; fullscreen *; sync-xhr *; notifications 'self'; push 'self'; geolocation 'self'; midi 'self'; microphone 'self'; camera 'self'; magnetometer 'self'; gyroscope 'self'; payment 'none';",
	},
};


module.exports = config;
