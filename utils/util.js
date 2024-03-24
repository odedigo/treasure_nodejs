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
    return now.valueOf();
}
