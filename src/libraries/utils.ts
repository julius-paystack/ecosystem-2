import m_ from "minified-headless";
import randomstring from "randomstring"
import { Request } from "express";

const Utils = {
	/**
	 * Clone an object
	 */
	clone(obj: any): any {
		const new_obj = {};
		m_.copyObj(obj, new_obj);
		return new_obj;
	},

	/**
	 * Return an object or null if no fields exists
	 */
	objOrNull(obj: any): any|null {
		if(this.empty(obj)) return null;
		else return obj;
	},

	/** 
	 * Exclude certain fields from object, returns new object without exclude fields
	 */
	blackFields(obj: any, fields: Array<string>): any {
		return m_.filterObj(obj, (key: string, value: any) => {
			return !m_.contains(fields, key);
		}, null);
	},

	/** 
	 * Return new object with keys that are in fields 
	 */
	whiteFields(obj: any, fields: Array<string>): any {
		return m_.filterObj(obj, (key: string, value: any) => {
			return m_.contains(fields, key);
		}, null);
	},

	/**
	 * Check if object has certain keys
	 */
	hasKeys(obj: any, keys: Array<string>): boolean {
		const l = keys.length;
		for(let i = 0; i < l; ++i) {
			if(!this.hasKey(obj, keys[i])) return false;
		}
		return true;
	},

	/** Check if object has key */
	hasKey(obj: any, key: string): boolean {
		return Object.prototype.hasOwnProperty.call(obj, key);
	},

	/**
	 * Check if a value is numeric
	 */
	isNumeric(value: any): boolean {
		return !isNaN(parseFloat(value)) && isFinite(value);
	},

	/**
	 * Remove non printable characters from string and trim
	 */
	removeNonPrint(str: string, trim: boolean = true): string {
		str = str.toString().replace(/[^\x20-\x7E]+/g, "");
		return trim? str.trim() : str;
	},

	/**
	 * Get random number between two numbers
	 */
	rand(a: number, b: number): number {
		return parseInt((Math.abs(a-b) * Math.random()).toString())+Math.min(a,b);
	},

	/** Generate uuid */
	uuid(): string {
		let raw = randomstring.generate({
			length: 32,
			charset: "hex"
		});
		let uuid = raw.substring(0, 8) + '-' + raw.substring(8, 12) + '-'
			+ raw.substring(12, 16) + '-' + raw.substring(16, 20) + '-' + raw.substring(20);
		return uuid;
	},

	/** Get full host for current request */
	host(req: Request): string {
		// var scheme = (this.isLive()? 'https' : req.protocol)+"://";
		// var hostname = req.get("X-Forwarded-Host") || req.get("Host");
		let hostname = req.get("Host");
		let scheme = req.protocol;
		return scheme+"://"+hostname;
	},

	/**
	 * Split a string received from the client into an array
	 * Splits using ',', '|' or ' ' as delimiters
	 */
	convertClientStringToArray(client_string: string): string[] {
		let client_array: string[] = [].concat(client_string);
		for(let char of ['|', ',', ' ']) {
			if(client_string.includes(char)) {
				client_array = client_string.split(char).map((x) => x.trim());
				break;
			}
		}
		return client_array.filter(Boolean);
	}
};


export default Utils;
