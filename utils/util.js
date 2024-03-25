import crypto from "crypto"
import emailValidator from "email-validator"
import config from "../config/config.js"

export function isValidValue(val) {
    return (val !== undefined && val !== "")
}

/**
 * Replaces {0}, {1} inside string with given arguments
 * First argument is the string
 * @returns string
 */
export function formatString() {
    try {
        let str = arguments[0]
        for (let i = 1; i < arguments.length; i++) {
            str = str.replace("{"+(i-1)+"}", arguments[i]);
        }    
        return str;
    }
    catch(err) {
      console.log(err)
        return "N/A"
    }
  }
  
  
/**
 * Formats local date and time in the IL timezone
 * @returns 
 */
export function getCurrentDateTime() {
    const now = new Date().toLocaleString('en', {timeZone: 'Asia/Jerusalem'})
    return new Date(now).toISOString();
}

export function getHash(str) {
    //creating hash object 
    var hash = crypto.createHash('sha512');
    //passing the data to be hashed
    data = hash.update(str, 'utf-8');
    //Creating the hash in the required format
    gen_hash= data.digest('hex');
    return gen_hash;
}

export function validateEmail(email) {
    return emailValidator.validate(email)
}

export function getOneTimeToken() {
    var token = crypto.randomBytes(64).toString('hex');
    return token
}

export function getTokenExpiration() {
    const now = new Date()
    now.setDate(now.getDate() + config.config.app.expiration)
    return now.toISOString();
}