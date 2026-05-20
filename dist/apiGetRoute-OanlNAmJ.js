import axios from "axios";
//#region node_modules/qs-esm/lib/formats.js
var replace = String.prototype.replace;
var percentTwenties = /%20/g;
var Format = {
	RFC1738: "RFC1738",
	RFC3986: "RFC3986"
};
var formatters = {
	RFC1738: function(value) {
		return replace.call(value, percentTwenties, "+");
	},
	RFC3986: function(value) {
		return String(value);
	}
};
var RFC1738 = Format.RFC1738;
Format.RFC3986;
var formats_default = Format.RFC3986;
//#endregion
//#region node_modules/qs-esm/lib/utils.js
var has$2 = Object.prototype.hasOwnProperty;
var isArray$2 = Array.isArray;
var overflowChannel = /* @__PURE__ */ new WeakMap();
var markOverflow = function markOverflow(obj, maxIndex) {
	overflowChannel.set(obj, maxIndex);
	return obj;
};
function isOverflow(obj) {
	return overflowChannel.has(obj);
}
var getMaxIndex = function getMaxIndex(obj) {
	return overflowChannel.get(obj);
};
var setMaxIndex = function setMaxIndex(obj, maxIndex) {
	overflowChannel.set(obj, maxIndex);
};
var hexTable = (function() {
	const array = [];
	for (let i = 0; i < 256; ++i) array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
	return array;
})();
var compactQueue = function compactQueue(queue) {
	while (queue.length > 1) {
		const item = queue.pop();
		const obj = item.obj[item.prop];
		if (isArray$2(obj)) {
			const compacted = [];
			for (let j = 0; j < obj.length; ++j) if (typeof obj[j] !== "undefined") compacted.push(obj[j]);
			item.obj[item.prop] = compacted;
		}
	}
};
var arrayToObject = function arrayToObject(source, options) {
	const obj = options && options.plainObjects ? Object.create(null) : {};
	for (let i = 0; i < source.length; ++i) if (typeof source[i] !== "undefined") obj[i] = source[i];
	return obj;
};
var merge = function merge(target, source, options) {
	if (!source) return target;
	if (typeof source !== "object") {
		if (isArray$2(target)) target.push(source);
		else if (target && typeof target === "object") {
			if (isOverflow(target)) {
				var newIndex = getMaxIndex(target) + 1;
				target[newIndex] = source;
				setMaxIndex(target, newIndex);
			} else if (options && (options.plainObjects || options.allowPrototypes) || !has$2.call(Object.prototype, source)) target[source] = true;
		} else return [target, source];
		return target;
	}
	if (!target || typeof target !== "object") {
		if (isOverflow(source)) {
			var sourceKeys = Object.keys(source);
			var result = options && options.plainObjects ? {
				__proto__: null,
				0: target
			} : { 0: target };
			for (var m = 0; m < sourceKeys.length; m++) {
				var oldKey = parseInt(sourceKeys[m], 10);
				result[oldKey + 1] = source[sourceKeys[m]];
			}
			return markOverflow(result, getMaxIndex(source) + 1);
		}
		return [target].concat(source);
	}
	let mergeTarget = target;
	if (isArray$2(target) && !isArray$2(source)) mergeTarget = arrayToObject(target, options);
	if (isArray$2(target) && isArray$2(source)) {
		source.forEach(function(item, i) {
			if (has$2.call(target, i)) {
				const targetItem = target[i];
				if (targetItem && typeof targetItem === "object" && item && typeof item === "object") target[i] = merge(targetItem, item, options);
				else target.push(item);
			} else target[i] = item;
		});
		return target;
	}
	return Object.keys(source).reduce(function(acc, key) {
		const value = source[key];
		if (has$2.call(acc, key)) acc[key] = merge(acc[key], value, options);
		else acc[key] = value;
		return acc;
	}, mergeTarget);
};
var decode = function(str, decoder, charset) {
	const strWithoutPlus = str.replace(/\+/g, " ");
	if (charset === "iso-8859-1") return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
	try {
		return decodeURIComponent(strWithoutPlus);
	} catch (e) {
		return strWithoutPlus;
	}
};
var limit = 1024;
var encode = function encode(str, defaultEncoder, charset, kind, format) {
	if (str.length === 0) return str;
	let string = str;
	if (typeof str === "symbol") string = Symbol.prototype.toString.call(str);
	else if (typeof str !== "string") string = String(str);
	if (charset === "iso-8859-1") return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
		return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
	});
	let out = "";
	for (let j = 0; j < string.length; j += limit) {
		const segment = string.length >= limit ? string.slice(j, j + limit) : string;
		const arr = [];
		for (let i = 0; i < segment.length; ++i) {
			let c = segment.charCodeAt(i);
			if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === RFC1738 && (c === 40 || c === 41)) {
				arr[arr.length] = segment.charAt(i);
				continue;
			}
			if (c < 128) {
				arr[arr.length] = hexTable[c];
				continue;
			}
			if (c < 2048) {
				arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
				continue;
			}
			if (c < 55296 || c >= 57344) {
				arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
				continue;
			}
			i += 1;
			c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
			arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
		}
		out += arr.join("");
	}
	return out;
};
var compact = function compact(value) {
	const queue = [{
		obj: { o: value },
		prop: "o"
	}];
	const refs = [];
	for (let i = 0; i < queue.length; ++i) {
		const item = queue[i];
		const obj = item.obj[item.prop];
		const keys = Object.keys(obj);
		for (let j = 0; j < keys.length; ++j) {
			const key = keys[j];
			const val = obj[key];
			if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
				queue.push({
					obj,
					prop: key
				});
				refs.push(val);
			}
		}
	}
	compactQueue(queue);
	return value;
};
var isRegExp = function isRegExp(obj) {
	return Object.prototype.toString.call(obj) === "[object RegExp]";
};
var isBuffer = function isBuffer(obj) {
	if (!obj || typeof obj !== "object") return false;
	return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};
var combine = function combine(a, b, arrayLimit, plainObjects) {
	if (isOverflow(a)) {
		var newIndex = getMaxIndex(a) + 1;
		a[newIndex] = b;
		setMaxIndex(a, newIndex);
		return a;
	}
	var result = [].concat(a, b);
	if (result.length > arrayLimit) return markOverflow(arrayToObject(result, { plainObjects }), result.length - 1);
	return result;
};
var maybeMap = function maybeMap(val, fn) {
	if (isArray$2(val)) {
		const mapped = [];
		for (let i = 0; i < val.length; i += 1) mapped.push(fn(val[i]));
		return mapped;
	}
	return fn(val);
};
//#endregion
//#region node_modules/qs-esm/lib/stringify.js
var has$1 = Object.prototype.hasOwnProperty;
var arrayPrefixGenerators = {
	brackets: function brackets(prefix) {
		return prefix + "[]";
	},
	comma: "comma",
	indices: function indices(prefix, key) {
		return prefix + "[" + key + "]";
	},
	repeat: function repeat(prefix) {
		return prefix;
	}
};
var isArray$1 = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function(arr, valueOrArray) {
	push.apply(arr, isArray$1(valueOrArray) ? valueOrArray : [valueOrArray]);
};
var toISO = Date.prototype.toISOString;
var defaultFormat = formats_default;
var defaults$1 = {
	addQueryPrefix: false,
	allowDots: false,
	allowEmptyArrays: false,
	arrayFormat: "indices",
	charset: "utf-8",
	charsetSentinel: false,
	delimiter: "&",
	encode: true,
	encodeDotInKeys: false,
	encoder: encode,
	encodeValuesOnly: false,
	format: defaultFormat,
	formatter: formatters[defaultFormat],
	indices: false,
	serializeDate: function serializeDate(date) {
		return toISO.call(date);
	},
	skipNulls: false,
	strictNullHandling: false
};
var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
	return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
};
var sentinel = {};
var _stringify = function stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
	let obj = object;
	let tmpSc = sideChannel;
	let step = 0;
	let findFlag = false;
	while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
		const pos = tmpSc.get(object);
		step += 1;
		if (typeof pos !== "undefined") if (pos === step) throw new RangeError("Cyclic object value");
		else findFlag = true;
		if (typeof tmpSc.get(sentinel) === "undefined") step = 0;
	}
	if (typeof filter === "function") obj = filter(prefix, obj);
	else if (obj instanceof Date) obj = serializeDate(obj);
	else if (generateArrayPrefix === "comma" && isArray$1(obj)) obj = maybeMap(obj, function(value) {
		if (value instanceof Date) return serializeDate(value);
		return value;
	});
	if (obj === null) {
		if (strictNullHandling) return encoder && !encodeValuesOnly ? encoder(prefix, defaults$1.encoder, charset, "key", format) : prefix;
		obj = "";
	}
	if (isNonNullishPrimitive(obj) || isBuffer(obj)) {
		if (encoder) return [formatter(encodeValuesOnly ? prefix : encoder(prefix, defaults$1.encoder, charset, "key", format)) + "=" + formatter(encoder(obj, defaults$1.encoder, charset, "value", format))];
		return [formatter(prefix) + "=" + formatter(String(obj))];
	}
	const values = [];
	if (typeof obj === "undefined") return values;
	let objKeys;
	if (generateArrayPrefix === "comma" && isArray$1(obj)) {
		if (encodeValuesOnly && encoder) obj = maybeMap(obj, encoder);
		objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
	} else if (isArray$1(filter)) objKeys = filter;
	else {
		const keys = Object.keys(obj);
		objKeys = sort ? keys.sort(sort) : keys;
	}
	const encodedPrefix = encodeDotInKeys ? prefix.replace(/\./g, "%2E") : prefix;
	const adjustedPrefix = commaRoundTrip && isArray$1(obj) && obj.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
	if (allowEmptyArrays && isArray$1(obj) && obj.length === 0) return adjustedPrefix + "[]";
	for (let j = 0; j < objKeys.length; ++j) {
		const key = objKeys[j];
		const value = typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key];
		if (skipNulls && value === null) continue;
		const encodedKey = allowDots && encodeDotInKeys ? key.replace(/\./g, "%2E") : key;
		const keyPrefix = isArray$1(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
		sideChannel.set(object, step);
		const valueSideChannel = /* @__PURE__ */ new WeakMap();
		valueSideChannel.set(sentinel, sideChannel);
		pushToArray(values, _stringify(value, keyPrefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, generateArrayPrefix === "comma" && encodeValuesOnly && isArray$1(obj) ? null : encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel));
	}
	return values;
};
var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
	if (!opts) return defaults$1;
	if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
	if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
	if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") throw new TypeError("Encoder has to be a function.");
	const charset = opts.charset || defaults$1.charset;
	if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
	let format = formats_default;
	if (typeof opts.format !== "undefined") {
		if (!has$1.call(formatters, opts.format)) throw new TypeError("Unknown format option provided.");
		format = opts.format;
	}
	const formatter = formatters[format];
	let filter = defaults$1.filter;
	if (typeof opts.filter === "function" || isArray$1(opts.filter)) filter = opts.filter;
	let arrayFormat;
	if (opts.arrayFormat in arrayPrefixGenerators) arrayFormat = opts.arrayFormat;
	else if ("indices" in opts) arrayFormat = opts.indices ? "indices" : "repeat";
	else arrayFormat = defaults$1.arrayFormat;
	if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
	const allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults$1.allowDots : !!opts.allowDots;
	return {
		addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults$1.addQueryPrefix,
		allowDots,
		allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults$1.allowEmptyArrays,
		arrayFormat,
		charset,
		charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults$1.charsetSentinel,
		commaRoundTrip: opts.commaRoundTrip,
		delimiter: typeof opts.delimiter === "undefined" ? defaults$1.delimiter : opts.delimiter,
		encode: typeof opts.encode === "boolean" ? opts.encode : defaults$1.encode,
		encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults$1.encodeDotInKeys,
		encoder: typeof opts.encoder === "function" ? opts.encoder : defaults$1.encoder,
		encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults$1.encodeValuesOnly,
		filter,
		format,
		formatter,
		serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults$1.serializeDate,
		skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults$1.skipNulls,
		sort: typeof opts.sort === "function" ? opts.sort : null,
		strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults$1.strictNullHandling
	};
};
function stringify(object, opts) {
	let obj = object;
	const options = normalizeStringifyOptions(opts);
	let objKeys;
	let filter;
	if (typeof options.filter === "function") {
		filter = options.filter;
		obj = filter("", obj);
	} else if (isArray$1(options.filter)) {
		filter = options.filter;
		objKeys = filter;
	}
	const keys = [];
	if (typeof obj !== "object" || obj === null) return "";
	const generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
	const commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
	if (!objKeys) objKeys = Object.keys(obj);
	if (options.sort) objKeys.sort(options.sort);
	const sideChannel = /* @__PURE__ */ new WeakMap();
	for (let i = 0; i < objKeys.length; ++i) {
		const key = objKeys[i];
		if (options.skipNulls && obj[key] === null) continue;
		pushToArray(keys, _stringify(obj[key], key, generateArrayPrefix, commaRoundTrip, options.allowEmptyArrays, options.strictNullHandling, options.skipNulls, options.encodeDotInKeys, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel));
	}
	const joined = keys.join(options.delimiter);
	let prefix = options.addQueryPrefix === true ? "?" : "";
	if (options.charsetSentinel) if (options.charset === "iso-8859-1") prefix += "utf8=%26%2310003%3B&";
	else prefix += "utf8=%E2%9C%93&";
	return joined.length > 0 ? prefix + joined : "";
}
//#endregion
//#region node_modules/qs-esm/lib/parse.js
var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;
var defaults = {
	allowDots: false,
	allowEmptyArrays: false,
	allowPrototypes: false,
	allowSparse: false,
	arrayLimit: 20,
	charset: "utf-8",
	charsetSentinel: false,
	comma: false,
	decodeDotInKeys: false,
	decoder: decode,
	delimiter: "&",
	depth: 5,
	duplicates: "combine",
	ignoreQueryPrefix: false,
	interpretNumericEntities: false,
	parameterLimit: 1e3,
	parseArrays: true,
	plainObjects: false,
	strictNullHandling: false
};
var interpretNumericEntities = function(str) {
	return str.replace(/&#(\d+);/g, function($0, numberStr) {
		return String.fromCharCode(parseInt(numberStr, 10));
	});
};
var parseArrayValue = function(val, options) {
	if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) return val.split(",");
	return val;
};
var isoSentinel = "utf8=%26%2310003%3B";
var charsetSentinel = "utf8=%E2%9C%93";
var parseValues = function parseQueryStringValues(str, options) {
	const obj = { __proto__: null };
	const cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
	const limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
	const parts = cleanStr.split(options.delimiter, limit);
	let skipIndex = -1;
	let i;
	let charset = options.charset;
	if (options.charsetSentinel) {
		for (i = 0; i < parts.length; ++i) if (parts[i].indexOf("utf8=") === 0) {
			if (parts[i] === charsetSentinel) charset = "utf-8";
			else if (parts[i] === isoSentinel) charset = "iso-8859-1";
			skipIndex = i;
			i = parts.length;
		}
	}
	for (i = 0; i < parts.length; ++i) {
		if (i === skipIndex) continue;
		const part = parts[i];
		const bracketEqualsPos = part.indexOf("]=");
		const pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
		let key, val;
		if (pos === -1) {
			key = options.decoder(part, defaults.decoder, charset, "key");
			val = options.strictNullHandling ? null : "";
		} else {
			key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
			val = maybeMap(parseArrayValue(part.slice(pos + 1), options), function(encodedVal) {
				return options.decoder(encodedVal, defaults.decoder, charset, "value");
			});
		}
		if (val && options.interpretNumericEntities && charset === "iso-8859-1") val = interpretNumericEntities(val);
		if (part.indexOf("[]=") > -1) val = isArray(val) ? [val] : val;
		const existing = has.call(obj, key);
		if (existing && options.duplicates === "combine") obj[key] = combine(obj[key], val, options.arrayLimit, options.plainObjects);
		else if (!existing || options.duplicates === "last") obj[key] = val;
	}
	return obj;
};
var parseObject = function(chain, val, options, valuesParsed) {
	let leaf = valuesParsed ? val : parseArrayValue(val, options);
	for (let i = chain.length - 1; i >= 0; --i) {
		let obj;
		const root = chain[i];
		if (root === "[]" && options.parseArrays) if (isOverflow(leaf)) obj = leaf;
		else obj = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : combine([], leaf, options.arrayLimit, options.plainObjects);
		else {
			obj = options.plainObjects ? Object.create(null) : {};
			const cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
			const decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
			const index = parseInt(decodedRoot, 10);
			if (!options.parseArrays && decodedRoot === "") obj = { 0: leaf };
			else if (!isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && options.parseArrays && index <= options.arrayLimit) {
				obj = [];
				obj[index] = leaf;
			} else if (decodedRoot !== "__proto__") obj[decodedRoot] = leaf;
		}
		leaf = obj;
	}
	return leaf;
};
var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
	if (!givenKey) return;
	const key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
	const brackets = /(\[[^[\]]*])/;
	const child = /(\[[^[\]]*])/g;
	let segment = options.depth > 0 && brackets.exec(key);
	const parent = segment ? key.slice(0, segment.index) : key;
	const keys = [];
	if (parent) {
		if (!options.plainObjects && has.call(Object.prototype, parent)) {
			if (!options.allowPrototypes) return;
		}
		keys.push(parent);
	}
	let i = 0;
	while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
		i += 1;
		if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
			if (!options.allowPrototypes) return;
		}
		keys.push(segment[1]);
	}
	if (segment) keys.push("[" + key.slice(segment.index) + "]");
	return parseObject(keys, val, options, valuesParsed);
};
var normalizeParseOptions = function normalizeParseOptions(opts) {
	if (!opts) return defaults;
	if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
	if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
	if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") throw new TypeError("Decoder has to be a function.");
	if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
	const charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
	const duplicates = typeof opts.duplicates === "undefined" ? defaults.duplicates : opts.duplicates;
	if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") throw new TypeError("The duplicates option must be either combine, first, or last");
	return {
		allowDots: typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots,
		allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
		allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
		allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
		arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
		charset,
		charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
		comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
		decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
		decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
		delimiter: typeof opts.delimiter === "string" || isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
		depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
		duplicates,
		ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
		interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
		parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
		parseArrays: opts.parseArrays !== false,
		plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
		strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
	};
};
function parse(str, opts) {
	const options = normalizeParseOptions(opts);
	if (str === "" || str === null || typeof str === "undefined") return options.plainObjects ? Object.create(null) : {};
	const tempObj = typeof str === "string" ? parseValues(str, options) : str;
	let obj = options.plainObjects ? Object.create(null) : {};
	const keys = Object.keys(tempObj);
	for (let i = 0; i < keys.length; ++i) {
		const key = keys[i];
		const newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
		obj = merge(obj, newObj, options);
	}
	if (options.allowSparse === true) return obj;
	return compact(obj);
}
//#endregion
//#region node_modules/ziggy-js/dist/index.js
function r() {
	return r = Object.assign ? Object.assign.bind() : function(t) {
		for (var e = 1; e < arguments.length; e++) {
			var r = arguments[e];
			for (var n in r) ({}).hasOwnProperty.call(r, n) && (t[n] = r[n]);
		}
		return t;
	}, r.apply(null, arguments);
}
var n = class {
	constructor(t, e, r) {
		var n, i;
		this.name = t, this.definition = e, this.bindings = null != (n = e.bindings) ? n : {}, this.wheres = null != (i = e.wheres) ? i : {}, this.config = r;
	}
	get template() {
		const t = `${this.origin}/${this.definition.uri}`.replace(/\/+$/, "");
		return "" === t ? "/" : t;
	}
	get origin() {
		return this.config.absolute ? this.definition.domain ? `${this.config.url.match(/^\w+:\/\//)[0]}${this.definition.domain}${this.config.port ? `:${this.config.port}` : ""}` : this.config.url : "";
	}
	get parameterSegments() {
		var t, e;
		return null != (t = null == (e = this.template.match(/{[^}?]+\??}/g)) ? void 0 : e.map((t) => ({
			name: t.replace(/{|\??}/g, ""),
			required: !/\?}$/.test(t)
		}))) ? t : [];
	}
	matchesUrl(e) {
		var r;
		if (!this.definition.methods.includes("GET")) return !1;
		const n = this.template.replace(/[.*+$()[\]]/g, "\\$&").replace(/(\/?){([^}?]*)(\??)}/g, (t, e, r, n) => {
			var i;
			const s = `(?<${r}>${(null == (i = this.wheres[r]) ? void 0 : i.replace(/(^\^)|(\$$)/g, "")) || "[^/?]+"})`;
			return n ? `(${e}${s})?` : `${e}${s}`;
		}).replace(/^\w+:\/\//, ""), [i, s] = e.replace(/^\w+:\/\//, "").split("?"), o = null != (r = new RegExp(`^${n}/?$`).exec(i)) ? r : new RegExp(`^${n}/?$`).exec(decodeURI(i));
		if (o) {
			for (const t in o.groups) o.groups[t] = "string" == typeof o.groups[t] ? decodeURIComponent(o.groups[t]) : o.groups[t];
			return {
				params: o.groups,
				query: parse(s)
			};
		}
		return !1;
	}
	compile(t) {
		return this.parameterSegments.length ? this.template.replace(/{([^}?]+)(\??)}/g, (e, r, n) => {
			var i, s;
			if (!n && [null, void 0].includes(t[r])) throw new Error(`Ziggy error: '${r}' parameter is required for route '${this.name}'.`);
			if (this.wheres[r] && !new RegExp(`^${n ? `(${this.wheres[r]})?` : this.wheres[r]}$`).test(null != (s = t[r]) ? s : "")) throw new Error(`Ziggy error: '${r}' parameter '${t[r]}' does not match required format '${this.wheres[r]}' for route '${this.name}'.`);
			return encodeURI(null != (i = t[r]) ? i : "").replace(/%7C/g, "|").replace(/%25/g, "%").replace(/\$/g, "%24");
		}).replace(this.config.absolute ? /(\.[^/]+?)(\/\/)/ : /(^)(\/\/)/, "$1/").replace(/\/+$/, "") : this.template;
	}
};
var i = class extends String {
	constructor(t, e, i = !0, s) {
		if (super(), this.t = null != s ? s : "undefined" != typeof Ziggy ? Ziggy : null == globalThis ? void 0 : globalThis.Ziggy, !this.t && "undefined" != typeof document && document.getElementById("ziggy-routes-json") && (globalThis.Ziggy = JSON.parse(document.getElementById("ziggy-routes-json").textContent), this.t = globalThis.Ziggy), this.t = r({}, this.t, { absolute: i }), t) {
			if (!this.t.routes[t]) throw new Error(`Ziggy error: route '${t}' is not in the route list.`);
			this.i = new n(t, this.t.routes[t], this.t), this.o = this.u(e);
		}
	}
	toString() {
		const t = Object.keys(this.o).filter((t) => !this.i.parameterSegments.some(({ name: e }) => e === t)).filter((t) => "_query" !== t).reduce((t, e) => r({}, t, { [e]: this.o[e] }), {});
		return this.i.compile(this.o) + stringify(r({}, t, this.o._query), {
			addQueryPrefix: !0,
			arrayFormat: "indices",
			encodeValuesOnly: !0,
			skipNulls: !0,
			encoder: (t, e) => "boolean" == typeof t ? Number(t) : e(t)
		});
	}
	h(t) {
		t ? this.t.absolute && t.startsWith("/") && (t = this.l().host + t) : t = this.m();
		let e = {};
		const [i, s] = Object.entries(this.t.routes).find(([r, i]) => e = new n(r, i, this.t).matchesUrl(t)) || [void 0, void 0];
		return r({ name: i }, e, { route: s });
	}
	m() {
		const { host: t, pathname: e, search: r } = this.l();
		return (this.t.absolute ? t + e : e.replace(this.t.url.replace(/^\w*:\/\/[^/]+/, ""), "").replace(/^\/+/, "/")) + r;
	}
	current(t, e) {
		const { name: i, params: s, query: o, route: u } = this.h();
		if (!t) return i;
		const h = new RegExp(`^${t.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`).test(i);
		if ([null, void 0].includes(e) || !h) return h;
		const a = new n(i, u, this.t);
		e = this.u(e, a);
		const l = r({}, s, o);
		if (Object.values(e).every((t) => !t) && !Object.values(l).some((t) => void 0 !== t)) return !0;
		const c = (t, e) => Object.entries(t).every(([t, r]) => Array.isArray(r) && Array.isArray(e[t]) ? r.every((r) => e[t].includes(r) || e[t].includes(decodeURIComponent(r))) : "object" == typeof r && "object" == typeof e[t] && null !== r && null !== e[t] ? c(r, e[t]) : e[t] == r || e[t] == decodeURIComponent(r));
		return c(e, l);
	}
	l() {
		var t, e, r, n, i, s;
		const { host: o = "", pathname: u = "", search: h = "" } = "undefined" != typeof window ? window.location : {};
		return {
			host: null != (t = null == (e = this.t.location) ? void 0 : e.host) ? t : o,
			pathname: null != (r = null == (n = this.t.location) ? void 0 : n.pathname) ? r : u,
			search: null != (i = null == (s = this.t.location) ? void 0 : s.search) ? i : h
		};
	}
	get params() {
		const { params: t, query: e } = this.h();
		return r({}, t, e);
	}
	get routeParams() {
		return this.h().params;
	}
	get queryParams() {
		return this.h().query;
	}
	has(t) {
		return this.t.routes.hasOwnProperty(t);
	}
	u(t = {}, e = this.i) {
		t ??= {}, t = ["string", "number"].includes(typeof t) ? [t] : t;
		const n = e.parameterSegments.filter(({ name: t }) => !this.t.defaults[t]);
		return Array.isArray(t) ? t = t.reduce((t, e, i) => r({}, t, n[i] ? { [n[i].name]: e } : "object" == typeof e ? e : { [e]: "" }), {}) : 1 !== n.length || t.hasOwnProperty(n[0].name) || !t.hasOwnProperty(Object.values(e.bindings)[0]) && !t.hasOwnProperty("id") || (t = { [n[0].name]: t }), r({}, this.p(e), this.$(t, e));
	}
	p(t) {
		return t.parameterSegments.filter(({ name: t }) => this.t.defaults[t]).reduce((t, { name: e }, n) => r({}, t, { [e]: this.t.defaults[e] }), {});
	}
	$(t, { bindings: e, parameterSegments: n }) {
		return Object.entries(t).reduce((t, [i, s]) => {
			if (!s || "object" != typeof s || Array.isArray(s) || !n.some(({ name: t }) => t === i)) return r({}, t, { [i]: s });
			const o = s.hasOwnProperty(e[i]) ? e[i] : s.hasOwnProperty("id") ? "id" : void 0;
			if (void 0 === o) throw new Error(`Ziggy error: object passed as '${i}' parameter is missing route model binding key '${e[i]}'.`);
			return r({}, t, { [i]: s[o] });
		}, {});
	}
	valueOf() {
		return this.toString();
	}
};
function s(t, e, r, n) {
	const s = new i(t, e, r, n);
	return t ? s.toString() : s;
}
function u(t) {
	if (!t && !globalThis.Ziggy && "undefined" == typeof Ziggy && !document.getElementById("ziggy-routes-json")) throw new Error("Ziggy error: missing configuration. Ensure that a `Ziggy` variable is defined globally or pass a config object into the useRoute hook.");
	return (e, r, n, i = t) => s(e, r, n, i);
}
//#endregion
//#region src/Routes/apiRoute.ts
function apiRoute(RouteName, data = null, options = null, method = "GET") {
	if (!RouteName) return null;
	const option_load_screen = options?.load_screen ?? null;
	const route = u();
	return {
		option_load_screen,
		routeURL: method === "GET" ? route(RouteName, data) : route(RouteName)
	};
}
//#endregion
//#region src/Routes/apiGetRoute.ts
async function apiGetRoute(RouteName, data = {}, options = null) {
	const system_options = apiRoute(RouteName, data, options, "GET");
	const config = { responseType: "json" };
	if (options?.file === true) config.responseType = "blob";
	try {
		axios.defaults.withCredentials = true;
		return (await axios.get(system_options.routeURL, config)).data;
	} catch (error) {
		if (options?.error !== false) console.error(">> Erro apiGetRoute - URL: \"" + system_options.routeURL + "\"", error?.message);
		return null;
	}
}
//#endregion
export { apiRoute as n, u as r, apiGetRoute as t };

//# sourceMappingURL=apiGetRoute-OanlNAmJ.js.map