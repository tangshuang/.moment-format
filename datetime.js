import moment from 'moment'

/**
 * @desc use moment to format a datetime
 * @param string|date|timestamp datetime: the datetime to format
   the given datetime can have timezone, and the timezone will be kept in the process of output datetime
   i.e. formate('2017-09-08 11:24:00+08:00', 'D/M/YYYY HH:mm:ss Z') =>  8/9/2017 11:24:00 +08:00, as you see, +08:00 is kept, which is different from moment default behavior
   if timezone has not been given, local timezone will be used.
 * @param string formatter: the target format you want to get
 * @param string givenFormatter: moment allow developer to define your own formatter, i.e. DD/MM/YYYY HH,mm,ss which is not a statndard time format
 * @return string new formatted datetime string
 * @example:
   1. format(new Date(), 'YYYY-MM-DD HH:mm:ss')
   2. format(your_date, 'YYYY-MM-DD HH:mm:ss', 'DD/MM/YYYY HH,mm,ss')
 */
export function format(datetime, formatter, givenFormatter) {
  let localTimezoneOffset = timezoneOffset()
  let givenTimezoneOffset = moment.parseZone(datetime).utcOffset()

  if (givenTimezoneOffset !== 0) {
    return moment(datetime, givenFormatter).utcOffset(givenTimezoneOffset).format(formatter)
  }
  else {
    // big problem: we do not know whether timezone has not been given or it is +00:00
    // if its utc time is the same with itself, it means timezone has been given
    let u = utc(datetime, 'YYYY-MM-DD HH:mm:ss', givenFormatter)
    let t = moment(datetime, givenFormatter).parseZone(datetime).format('YYYY-MM-DD HH:mm:ss')
    if (u === t) {
      return moment(datetime, givenFormatter).utc().format(formatter)
    }
    else {
      return moment(datetime, givenFormatter).format(formatter)
    }
  }
}

/**
 * @desc get a local datetime with given formatter, if no timezone, use current machine timezone
 * @param string|Date datetime: given datetime, can be string or Date instance, if not given, current time will be used
 * @param string formatter: output datetime formatter
 */
export function date(datetime, formatter, givenFormatter) {
  return moment(datetime, givenFormatter).format(formatter)
}

/**
 * @desc get a UTC datetime with given formatter, if not timezone, use current machine timezone
 * @param string|Date datetime: passed datetime, can be string or Date instance, if not given, current time will be used
 * @param string formatter: target utc datetime formatter
 */
export function utc(datetime, formatter, givenFormatter) {
  return moment(datetime, givenFormatter).utc().format(formatter)
}

/**
 * @desc get a local datetime with a utc which may not have timezone info
 * @param string|Date utcdatetime: the given utc time, timezone will be ignored
 * @param string formatter: formatter of target current datetime
 * @example 20:00:00 (without 'Z', but treated as utc) -> 12:00:00 (LOCAL)
 */
export function utc2date(utcdatetime, formatter, givenFormatter) {
  let datetime = format(utcdatetime, 'YYYY-MM-DDTHH:mm:ss.SSS\\Z', givenFormatter)
  return moment(datetime).format(formatter)
}

/**
 * @desc get local timezone, considering daylight saving time
 */
export function timezone() {
  return moment().format('Z')
}
/**
 * @desc get local timezone offset (minutes), considering daylight saving time
 */
export function timezoneOffset() {
  return moment().utcOffset()
}
/**
 * @desc get local timezone offset, ignore daylight saving time
 * so even in different seasons, it will get the same value
 * @return number: minutes of timezone offset, i.e. US -04:00 will get -240
 */
export function timezoneOffsetSTD() {
  let d = new Date()
  return -(new Date(d.getFullYear(), 0, 1).getTimezoneOffset())
}

/**
 * @desc convert the passed milliseconds time to be a local timezone milliseconds time,
 * if it is using daylight saving time, the return value will be true local timezone milliseconds time,
 * or it will return itself
 */
export function time2dst(mstime) {
  let localTimezoneOffset = timezoneOffset()
  let localTimezoneOffsetSTD = timezoneOffsetSTD()
  return mstime + (localTimezoneOffsetSTD - localTimezoneOffset) * 60 *1000
}
/**
 * @desc convert the passed datetime to be a local timezone datetime, considering daylight saving time
 */
export function date2dst(datetime, formatter, givenFormatter) {
  let time = moment(datetime, givenFormatter).valueOf()
  let localtime = time2dst(time)
  return date(localtime, formatter)
}

/**
 * convert COleDateTime/OLE Automation date
 * https://stackoverflow.com/questions/15549823/oadate-to-milliseconds-timestamp-in-javascript
 * https://stackoverflow.com/questions/10443325/how-to-convert-ole-automation-date-to-readable-format-using-javascript
 * https://stackoverflow.com/questions/7348805/what-is-equivalent-of-datetime-tooadate-in-javascript
 */

 /**
  * @desc convert a normal datetime to oadate
  * @param datetime datetime: the given datetime, can be date, milliseconds or string
  * @return number: oadate based on datetime's timestamp
  */
 export function oadate(datetime) {
   let epoch = 25569
   let msPerDay = 24 * 3600 * 1000
   let time = moment(datetime).valueOf()
   let value = time / msPerDay + epoch
   return value
 }

/**
 * @desc convert a oadate to utc milliseconds
 * @param number value: the value of oadate
 * @return number: milliseconds from January 1st, 1970,
 * it is a UTC ms, if you want to convert it to be local time, just use `utc2date`
 */
export function oadate2time(value) {
  let epoch = 25569 // days from January 1st, 1900 to January 1st, 1970
  let msPerDay = 24 * 3600 * 1000
  let time = (value - epoch) * msPerDay
  return Math.ceil(time)
}

export function oadate2date(value, formatter) {
  let time = oadate2time(value)
  return date(time, formatter)
}

/**
 * @desc compare two datetime
 * @return if a > b return 1, if a < b return -1, if a = b return 0
 */
export function dateAvsB(a, b) {
  let c = moment(a).unix()
  let d = moment(b).unix()
  return c > d ? 1 : c < d ? -1 : 0
}

/**
 * @desc compare two datetime whether a > b
 * @return if a > b return true, else return false
 */
export function dateagb(a, b) {
  return dateAvsB(a, b) === 1
}

/**
 * @desc compare two datetime whether a < b
 * @return if a < b return true, else return false
 */
export function datealb(a, b) {
  return dateAvsB(a, b) === -1
}

/**
 * @desc compare two datetime whether a = b
 * @return if a = b return true, else return false
 */
export function dateaeb(a, b) {
  return dateAvsB(a, b) === 0
}
