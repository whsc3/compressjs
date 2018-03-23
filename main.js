define(function(require, exports, module){
  'use strict';
  var freeze = require('./lib/freeze');
  var BitStream = require('./lib/BitStream');
  var Stream = require('./lib/Stream');
  var BWT = require('./lib/BWT');
  var Context1Model = require('./lib/Context1Model');
  var DefSumModel = require('./lib/DefSumModel');
  var FenwickModel = require('./lib/FenwickModel');
  var MTFModel = require('./lib/MTFModel');
  var NoModel = require('./lib/NoModel');
  var Huffman = require('./lib/Huffman');
  var RangeCoder = require('./lib/RangeCoder');
  var BWTC = require('./lib/BWTC');
  var Bzip2 = require('./lib/Bzip2');
  var Dmc = require('./lib/Dmc');
  var Lzjb = require('./lib/Lzjb');
  var LzjbR = require('./lib/LzjbR');
  var Lzp3 = require('./lib/Lzp3');
  var PPM = require('./lib/PPM');
  var Simple = require('./lib/Simple');
        module.exports = freeze({
        version: "0.0.1",
        // APIs
        BitStream: BitStream,
        Stream: Stream,
        // transforms
        BWT: BWT,
        // models and coder
        Context1Model: Context1Model,
        DefSumModel: DefSumModel,
        FenwickModel: FenwickModel,
        MTFModel: MTFModel,
        NoModel: NoModel,
        Huffman: Huffman,
        RangeCoder: RangeCoder,
        // compression methods
        BWTC: BWTC,
        Bzip2: Bzip2,
        Dmc: Dmc,
        Lzjb: Lzjb,
        LzjbR: LzjbR,
        Lzp3: Lzp3,
        PPM: PPM,
        Simple: Simple
    });
});