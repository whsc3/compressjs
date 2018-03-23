define(function(require, exports, module){
  'use strict';
  var freeze = require('./freeze');
  var Util = require('./Util');

  /**
   * FIRST() function
   * @param array The code length array
   * @param i The input position
   * @param nodesToMove The number of internal nodes to be relocated
   * @return The smallest {@code k} such that {@code nodesToMove <= k <= i} and
   *         {@code i <= (array[k] % array.length)}
   */
  var first = function(array, i, nodesToMove) {
    var length = array.length;
    var limit = i;
    var k = array.length - 2;

    while ((i >= nodesToMove) && ((array[i] % length) > limit)) {
      k = i;
      i -= (limit - i + 1);
    }
    i = Math.max (nodesToMove - 1, i);

    while (k > (i + 1)) {
      var temp = (i + k) >> 1;
      if ((array[temp] % length) > limit) {
        k = temp;
      } else {
        i = temp;
      }
    }

    return k;
  };

  /**
   * Fills the code array with extended parent pointers
   * @param array The code length array
   */
  var setExtendedParentPointers = function(array) {
    var length = array.length;

    array[0] += array[1];

    var headNode, tailNode, topNode, temp;
    for (headNode = 0, tailNode = 1, topNode = 2;
         tailNode < (length - 1);
         tailNode++) {
      if ((topNode >= length) || (array[headNode] < array[topNode])) {
        temp = array[headNode];
        array[headNode++] = tailNode;
      } else {
        temp = array[topNode++];
      }

      if ((topNode >= length) ||
          ((headNode < tailNode) && (array[headNode] < array[topNode]))) {
        temp += array[headNode];
        array[headNode++] = tailNode + length;
      } else {
        temp += array[topNode++];
      }

      array[tailNode] = temp;
    }
  };

  /**
   * Finds the number of nodes to relocate in order to achieve a given code
   * length limit
   * @param array The code length array
   * @param maximumLength The maximum bit length for the generated codes
   * @return The number of nodes to relocate
   */
  var findNodesToRelocate = function(array, maximumLength) {
    var currentNode = array.length - 2;
    var currentDepth;
    for (currentDepth = 1;
         (currentDepth < (maximumLength - 1)) && (currentNode > 1);
         currentDepth++) {
      currentNode =  first (array, currentNode - 1, 0);
    }

    return currentNode;
  };


  /**
   * A final allocation pass with no code length limit
   * @param array The code length array
   */
  var allocateNodeLengths = function(array) {
    var firstNode = array.length - 2;
    var nextNode = array.length - 1;
    var currentDepth, availableNodes, lastNode, i;

    for (currentDepth = 1, availableNodes = 2;
         availableNodes > 0;
         currentDepth++) {
      lastNode = firstNode;
      firstNode = first (array, lastNode - 1, 0);

      for (i = availableNodes - (lastNode - firstNode); i > 0; i--) {
        array[nextNode--] = currentDepth;
      }

      availableNodes = (lastNode - firstNode) << 1;
    }
  };

  /**
   * A final allocation pass that relocates nodes in order to achieve a
   * maximum code length limit
   * @param array The code length array
   * @param nodesToMove The number of internal nodes to be relocated
   * @param insertDepth The depth at which to insert relocated nodes
   */
  var allocateNodeLengthsWithRelocation = function(array, nodesToMove,
                                                   insertDepth) {
    var firstNode = array.length - 2;
    var nextNode = array.length - 1;
    var currentDepth = (insertDepth == 1) ? 2 : 1;
    var nodesLeftToMove = (insertDepth == 1) ? nodesToMove - 2 : nodesToMove;
    var availableNodes, lastNode, offset, i;

    for (availableNodes = currentDepth << 1;
         availableNodes > 0;
         currentDepth++) {
      lastNode = firstNode;
      firstNode = (firstNode <= nodesToMove) ? firstNode : first (array, lastNode - 1, nodesToMove);

      offset = 0;
      if (currentDepth >= insertDepth) {
        offset = Math.min (nodesLeftToMove, 1 << (currentDepth - insertDepth));
      } else if (currentDepth == (insertDepth - 1)) {
        offset = 1;
        if ((array[firstNode]) == lastNode) {
          firstNode++;
        }
      }

      for (i = availableNodes - (lastNode - firstNode + offset); i > 0; i--) {
        array[nextNode--] = currentDepth;
      }

      nodesLeftToMove -= offset;
      availableNodes = (lastNode - firstNode + offset) << 1;
    }
  };

  /**
   * Allocates Canonical Huffman code lengths in place based on a sorted
   * frequency array
   * @param array On input, a sorted array of symbol frequencies; On output,
   *              an array of Canonical Huffman code lengths
   * @param maximumLength The maximum code length. Must be at least
   *                      {@code ceil(log2(array.length))}
   */
  // public
  var allocateHuffmanCodeLengths = function(array, maximumLength) {
    switch (array.length) {
    case 2:
      array[1] = 1;
    case 1:
      array[0] = 1;
      return;
    }

    /* Pass 1 : Set extended parent pointers */
    setExtendedParentPointers (array);

    /* Pass 2 : Find number of nodes to relocate in order to achieve
     *          maximum code length */
    var nodesToRelocate = findNodesToRelocate (array, maximumLength);

    /* Pass 3 : Generate code lengths */
    if ((array[0] % array.length) >= nodesToRelocate) {
      allocateNodeLengths (array);
    } else {
      var insertDepth = maximumLength - (Util.fls(nodesToRelocate - 1));
      allocateNodeLengthsWithRelocation (array, nodesToRelocate, insertDepth);
    }
  };

  module.exports = freeze({
    allocateHuffmanCodeLengths: allocateHuffmanCodeLengths
  });
});