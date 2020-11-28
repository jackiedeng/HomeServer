'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const rpio = require('rpio');

//GPIO 4
let pin = 7;
var debug = false;

function dbg()
{
	if (debug) {
		console.error.apply(console, arguments);
	}
}

function read_dht11(vals)
{
  console.log("begin read dhtt");
  /*
  * Our read buffer of all the bits sent.  Should be plenty.  On a
  * Raspberry Pi 4 a successful read uses up about half of this.
  */
  var buf = new Buffer(50000);

  /*
  * Array storing the data bits received from the DHT11 after parsing
  * the input buffer.
  */
  var data = new Array();

  /*
  * The initialisation sequence as per the datasheet is to start high,
  * pull low for at least 18ms, then back high and read.  The JavaScript
  * function call overhead ensures that we'll actually be sleeping
  * longer than that, but it doesn't appear to be a problem.
  */
  rpio.open(pin, rpio.OUTPUT, rpio.HIGH);
  rpio.write(pin, rpio.LOW);
  rpio.msleep(18);

  /*
  * Enable the pin pull-up then use the mode-setting variant of readbuf()
  * to read the pin value into the buffer as fast as possible.  We only
  * have around 100us before the DHT11 will start transmitting data so
  * there needs to be no delay between configuring the pin as an input and
  * reading the data.
  *
  * Configuring the pin for input, enabling the pull-up, then reading the
  * data would take way too long.  Apart from the JavaScript function call
  * overhead, just enabling the pull-up can require a 150us delay on some
  * hardware.
  */
  rpio.pud(pin, rpio.PULL_UP);
  rpio.readbuf(pin, buf, buf.length, true);
  rpio.close(pin);

  /*
  * The data has been received, split the buffer into groups of "1"s.  By
  * measuring the length of each group we can determine whether it is a
  * low (short) or high (long) bit sent by the DHT11.
  */
  buf.join('').replace(/0+/g, '0').split('0').forEach(function(bits, n) {
    data.push(bits.length);
  });

  /*
  * In normal operation we'd expect to see 43 values: the initial high of
  * the pull-up, a ready signal, 40 bits of data, then a continuous high
  * to signal end of transmission.  Use shift() and pop() to remove the
  * control bits, leaving just the data.
  *
  * In certain circumstances the first bit can be missing, if we didn't
  * switch to read mode fast enough.  However as that's just the high
  * value configured by the pull-up and not data from the DHT11 we allow
  * it to be missing.  Everything else, even with a correct checksum (can
  * happen!) we treat as invalid.
  */
  if (data.length < 42 || data.length > 43) {
    dbg("Bad data read: length=%d", data.length);
    return false;
  }

  /* Remove extra first bit generated by the pull-up */
  if (data.length == 43) {
    data.shift();
  }

  /* Remove data ready bit */
  data.shift();

  /* Remove end of transmission bit */
  data.pop();

  /*
  * Calculate the low and high water marks.  As each model of Raspberry
  * Pi will run at different speeds, the length of each high bit will
  * vary, so calculate the average and use that to determine what is
  * "high" and "low".
  *
  * The longest "low" seen on a Raspberry Pi 4 is around 135, so the
  * default low here should be more than sufficient.
  */
  var low = 10000;
  var high = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i] < low)
      low = data[i];
    if (data[i] > high)
      high = data[i];
  }
  var avg = (low + high) / 2;

  /*
  * The data received from the DHT11 is in 5 groups of 8-bits:
  *
  *	[0:7] integral relative humidity
  *	[8:15] decimal relative humidity
  *	[16:23] integral temperature
  *	[24:31] decimal temperature
  *	[32:39] checksum
  *
  * Parse the bitstream into the supplied "vals" buffer.
  */
  vals.fill(0);
  for (var i = 0; i < data.length; i++) {
    var group = parseInt(i/8)

    /* The data is in big-endian format, shift it in. */
    vals[group] <<= 1;

    /* This should be a high bit, based on the average. */
    if (data[i] >= avg)
      vals[group] |= 1;
  }

  /*
  * Occasionally the final checksum test can be valid even when the
  * values are clearly bogus.  Perform additional sanity checks to
  * ensure they are within the limitations of the DHT11.
  */

  /* Relative humidity range is 20 - 90% */
  if (vals[0] < 20 || vals[0] > 90) {
    dbg("Bad humidity: %d%%", vals[0]);
    return false;
  }

  /* Temperature range is 0 - 50C */
  if (vals[2] > 50) {
    dbg("Bad temperature: %d", vals[0]);
    return false;
  }

  /*
  * Validate the checksum and return whether successful or not.  The
  * checksum is simply the value of the other 4 groups combined.
  *
  * In theory the total should be masked off to 8-bits, but in testing
  * this has occasionally resulted in obviously bogus data passing the
  * test.  It's unlikely that valid data will total >255 anyway given
  * the limitations of the DHT11 and the lack of decimal precision in
  * many implementations.
  */
  if ((vals[0] + vals[1] + vals[2] + vals[3]) != vals[4]) {
    dbg("Bad checksum: %d:%d:%d:%d %d", v[0], v[1], v[2], v[3], v[4]);
    return false;
  }

  return true;
}

class TemperatureSensor extends Controller {
  
    async index() {
    
    const { ctx } = this;
    // ctx.logger.error("begin temperature read!!!");
    ctx.body = JSON.stringify({"d":123});  
  //   try{

  //     if (read_dht11(v)) {
  //     let result = "Temperature = "+v[2]+"."+v[3]+", Humidity = "+v[0]+"."+v[1];
  //     }

  //     let data ="temperature:"+rpio.read(4);

  //     ctx.body = JSON.stringify({"d":data});

  //   }catch(e){
  //     ctx.logger.error("error:"+JSON.stringify(e));
  //   }
  // }
}

module.exports = TemperatureSensor;
