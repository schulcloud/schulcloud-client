const { contentSecurityPolicy, accessControlAllowOrigin, enabled } = require('../config/http-headers');
const { CORS } = require('../config/global');
const logger = require('../helpers/logger');

if (!CORS) 	{
	logger.info('CORS env has not been defined, to enable route specific CORS'
	+ ' header set value to 1 and update values in config.cors');
}

// TODO @ciphron remove all time same nonceValue??
const clearNonceValue = ( nonceValueField, nonceValue ) => {
	if (nonceValueField.includes('nonce-<nonceValue>')) {
		nonceValueField = nonceValueField.replace(/<nonceValue>/g, nonceValue);
	}
	return nonceValueField
}

// TODO @ciphron probably add matchingHeaders?
const addMatchHeaders = ( context, value, nonceValue ) => {
	if (matchingHeader[value] && matchingHeader[value].includes('*')) {
		value = '*';
		if (matchingHeader[value].includes('unsafe-inline')) {
			value += " 'unsafe-inline'";
		}
		if (matchingHeader[value].includes('unsafe-eval')) {
			value += " 'unsafe-eval'";
		}
		if (matchingHeader[value].includes('nonce-<nonceValue>')) {
			value += ` 'nonce-${nonceValue}'`;
		}
	} else if (matchingHeader[value]) {
		value = `${value} ${matchingHeader.value}`;
	}
	return value;
}

const cspHeadersForRoute = (path, regexs, corsDefault, nonceValue) => {
	let {
		defaultSrc = '',
		scriptSrc = '',
		styleSrc = '',
		imageSrc = '',
		fontSrc = '',
		connectSrc = '',
		mediaSrc = '',
		objectSrc = '',
		prefetchSrc = '',
		childSrc = '',
		frameSrc = '',
		workerSrc = '',
		frameancestorsSrc = '',
		formactionSrc = '',
		upgradeInsecureRequestsSrc = '',
		blockAllMixedContentSrc = '',
		sandboxSrc = '',
		baseuriSrc = '',
		manifestSrc = '',
	} = corsDefault;

	defaultSrc = clearNonceValue(defaultSrc, nonceValue);
		scriptSrc = clearNonceValue(scriptSrc, nonceValue);
		styleSrc = clearNonceValue(styleSrc, nonceValue);
		imageSrc = clearNonceValue(imageSrc, nonceValue);
		fontSrc = clearNonceValue(fontSrc, nonceValue);
		connectSrc = clearNonceValue(connectSrc, nonceValue);
		mediaSrc = clearNonceValue(mediaSrc, nonceValue);
		objectSrc = clearNonceValue(objectSrc, nonceValue);
		prefetchSrc = clearNonceValue(prefetchSrc, nonceValue);
		childSrc = clearNonceValue(childSrc, nonceValue);
		frameSrc = clearNonceValue(frameSrc, nonceValue);
		workerSrc = clearNonceValue(workerSrc, nonceValue);
		frameancestorsSrc = clearNonceValue(frameancestorsSrc, nonceValue);
		formactionSrc = clearNonceValue(formactionSrc, nonceValue);
		baseuriSrc = clearNonceValue(baseuriSrc, nonceValue);
	manifestSrc = clearNonceValue(manifestSrc, nonceValue);

	const matchingKeys = Object.keys(regexs)
		.filter(key => path.match(key));

	const corsHeaders = matchingKeys.map(key => regexs[key]);
	corsHeaders.forEach(matchingHeader => {
		defaultSrc = addMatchHeaders( 'defaultSrc', defaultSrc, nonceValue );
		scriptSrc = addMatchHeaders( 'scriptSrc', scriptSrc, nonceValue );
		objectSrc = addMatchHeaders( 'objectSrc', objectSrc, nonceValue );
		prefetchSrc = addMatchHeaders( 'prefetchSrc', prefetchSrc, nonceValue );
		childSrc = addMatchHeaders( 'childSrc', childSrc, nonceValue );
		frameSrc = addMatchHeaders( 'frameSrc', frameSrc, nonceValue );
		workerSrc = addMatchHeaders( 'workerSrc', workerSrc, nonceValue );
		frameancestorsSrc = addMatchHeaders( 'frameancestorsSrc', frameancestorsSrc, nonceValue );
		formactionSrc = addMatchHeaders( 'formactionSrc', formactionSrc, nonceValue );
		upgradeInsecureRequestsSrc = addMatchHeaders( 'upgradeInsecureRequestsSrc', upgradeInsecureRequestsSrc, nonceValue );
		blockAllMixedContentSrc = addMatchHeaders( 'blockAllMixedContentSrc', blockAllMixedContentSrc, nonceValue );
		sandboxSrc = addMatchHeaders( 'sandboxSrc', sandboxSrc, nonceValue );
		baseuriSrc = addMatchHeaders( 'baseuriSrc', baseuriSrc, nonceValue );
		manifestSrc = addMatchHeaders( 'manifestSrc', manifestSrc, nonceValue );
	});
	const finalCors = {
		defaultSrc,
		scriptSrc,
		objectSrc,
		prefetchSrc,
		childSrc,
		frameSrc,
		workerSrc,
		frameancestorsSrc,
		formactionSrc,
		upgradeInsecureRequestsSrc,
		blockAllMixedContentSrc,
		sandboxSrc,
		baseuriSrc,
		manifestSrc,
	};
	logger.debug(`cors headers for route ${path}`, finalCors);
	return finalCors;
};

const accessControlHeadersForRoute = (path, regexs) => {
	const matchingKeys = Object.keys(regexs)
		.filter(key => path.match(key));
	const corsHeaders = matchingKeys.map(key => regexs[key]);
	logger.debug(`cors headers for route ${path}`, corsHeaders);
	return corsHeaders;
};

const cors = (req, res, next) => {
	if (enabled) {
		try {
			// Content-Security-Policy
			const { corsDefault, corsSiteSpecific } = contentSecurityPolicy;
			const corsAllowContentOrigins = cspHeadersForRoute(
				req.path,
				corsSiteSpecific,
				corsDefault,
				res.local.nonceValue
			);
			if (corsAllowContentOrigins) {
				// eslint-disable-next-line max-len
				res.setHeader('Content-Security-Policy', `default-src ${corsAllowContentOrigins.defaultSrc}; script-src ${corsAllowContentOrigins.scriptSrc}; object-src ${corsAllowContentOrigins.objectSrc};`);

				// CSP
				let cspString = '';
				for ( let x in Object.keys(corsAllowContentOrigins) ) {
					let kebab = x
						.replace(/([a-z])([A-Z])/g, "$1-$2")
            .replace(/\s+/g, '-')
            .toLowerCase();
					cspString += `${kebab} ${corsAllowContentOrigins[x]}`;
				}

				if (cspString) {
					// eslint-disable-next-line max-len
					res.setHeader('Content-Security-Policy', cspString);
				} else {
					logger.debug('Content-Security-Policy header string not found');
				}
			} else {
				logger.debug('Content-Security-Policy header not set, because config does not contain valid content');
			}

			// Access-Control-Allow-Origin
			const corsAllowOrigins = accessControlHeadersForRoute(req.path, accessControlAllowOrigin);
			if (corsAllowOrigins.length !== 0) {
				res.setHeader('Access-Control-Allow-Origin', corsAllowOrigins.join(' | '));
			} else {
				logger.debug('do not set cors header, because config does not contain valid content');
			}
		} catch (error) {
			logger.error('error while setting cors header', error);
		}
	}
	return next();
};

module.exports = cors;
