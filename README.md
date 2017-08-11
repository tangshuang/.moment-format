# Moment Format

A library using momentjs to format datetime.

## Usage

```
import {format, date} from './datetime'

let datetime = '2017/08/07 08:12:33+08:00'
format(datetime, 'YYYY-MM-DD HH:mm:ss', 'YYYY/MM/DD HH:mm:ssZ') // => 2017-08-07 08:12:33
date(datetime, 'YYYY-MM-DD HH:mm:ss') // => 2017-08-07 06:12:33 (if local timezone is +06:00)
```

## API

### format(datetime, formatter, givenFormatter)

Format given date to target format.

**datetime**

The given date, can be ISOString, `new Date` or milliseconds.

**formatter**

The target format you want to convert to. Read more in momentjs's document.

**givenFormatter**

The format of your given date. If you are familar with momentjs, you can easily understand this. Becuase moment can only support only standard date format, when you pass a non-standard date, it will warn you error. So you can define your passed custom date format by using `givenFormatter`.

**@return**

The function return the formatted date string.

**@exmaple**

```
let formattedstr = format(new Date(), 'YYYY-MM-DD HH:mm:ss')

format('2017/08/07 08:12:33+08:00', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY/MM/DD HH:mm:ssZ')
// => 2017-08-07T08:12:33+08:00
```

When you use momentjs, the format method will convert your given datetime with given timezone. i.e.

```
moment('2017-08-07 08:12:33+08:00').format('YYYY-MM-DDTHH:mm:ssZ')
// if local timezone is +06:00 => 2017-08-07T06:12:33+06:00
moment('2017-08-07 08:12:33+08:00').utcOffset(240).format('YYYY-MM-DDTHH:mm:ssZ')
// timezone is set to be +04:00 => 2017-08-07T04:12:33+04:00
```

As you see, format method will format date to different timezone datetime. `format` function will not change the timezone, date is original date, just change the format.

### date(datetime, formatter, givenFormatter)

Get a local timezone datetime with given formatter, if no timezone, use current machine local timezone.

**datetime**

The same as previous. Can be with timezone.

**formatter**

The same as previous.

**givenFormatter**

The same as previous.

**@return**

A string, output datetime formatter.

**@exmaple**

```
let formattedDate = date(new Date(), 'YYYY-MM-DDTHH:mm:ssZ')

date('1990/02/04 00:04:33+00:00', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY/MM/DD HH:mm:ssZ')
// if local timezone is +06:00 => 1990-02-04T06:04:33+06:00
```

### utc(datetime, formatter, givenFormatter)

Format local date to utc date. Or the same meaning with get local date's utc date.

```
utc('2017-08-06 10:00:00', 'YYYY-MM-DDTHH:mm:ssZ')
// if local timezone is +08:00 => 2017-08-06T02:00:00+00:00
```

### utc2date(datetime, formatter, givenFormatter)

Format a utc date to local timezone date.
The given datetime will be treated as utc date, if it cantains timezone info, timezone will be ignored.

```
utc2date('2017-08-06 10:00:00+02:00', 'YYYY-MM-DDTHH:mm:ssZ')
// if local timezone is +08:00 => 2017-08-06T18:00:00+08:00, the +02:00 was ignored
```

### timezone()

Get current local timezone. Return like +08:00.

### timezoneOffset()

Get current local timezone offset in minutes. Return like 480 (which is +08:00).

### timezoneOffsetSTD()

Get current local timezone offset in minutes. This method will ignore daylight saving time. Return like 480 (which is +08:00).

`timezoneOffset` will consider the DST, if a user's computer's system timezone is -05:00 which is using DST, timezoneOffset() will return -05:00, timezoneOffsetSTD() will return -06:00.

### time2dst(mstime)

Convert a timestamp to daylight saving time timestamp. If the system uses DST, this function will convert the given time to DST. For example, if you give the timestamp of 05:00, the function will return timestamp of 06:00 if computer using DST, if it not using DST, original mstime will be return.

### date2dst(datetime, formatter, givenFormatter)

Like `time2dst`, convert the given datetime to DST datetime.

### oadate(datetime)

Get COleDateTime/OLE Automation date of datetime.

### oadate2time(value)

Get milliseconds of given COleDateTime/OLE Automation date:

```
let mstime = oadate2time(oadate)
let datetime = date(mstime, 'YYYY-MM-DD HH:mm:ss')
let dst = date2dst(datetime)
```

### oadate2date(value, formatter)

Get datetime of given COleDateTime/OLE Automation date. The previous code exmaple for oadate2time can be convert to:

```
let datetime = oadate2date(oadate, 'YYYY-MM-DD HH:mm:ss')
let dst = date2dst(datetime)
```

### dateAvsB(a, b)

Compare a to b, if a > b return 1, if a < b return -1, if a = b return 0.

### dateagb(a, b)

if a > b return true, else return false.

### datealb(a, b)

if a < b return true, else return false.

### datealb(a, b)

if a < b return true, else return false.

### dateaeb(a, b)

if a = b return true, else return false.
