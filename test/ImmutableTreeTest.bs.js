// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Caml = require("@rescript/std/lib/js/caml.js");
var Curry = require("@rescript/std/lib/js/curry.js");
var Caml_obj = require("@rescript/std/lib/js/caml_obj.js");
var Belt_Array = require("@rescript/std/lib/js/belt_Array.js");
var Belt_Option = require("@rescript/std/lib/js/belt_Option.js");
var ImmutableTree = require("../src/ImmutableTree.bs.js");
var Caml_js_exceptions = require("@rescript/std/lib/js/caml_js_exceptions.js");

function timeIt(fn, message, param) {
  var start = Date.now();
  var result = Curry._1(fn, undefined);
  var m = message !== undefined ? "Total time taken for " + message + " is : " : "Total time taken is : ";
  console.log(m + " " + String(Date.now() - start) + "ms");
  return result;
}

function test(name, fn) {
  console.log("-- Started :", name);
  try {
    Curry._1(fn, undefined);
    console.log("-- " + name + " SUCCESS");
    return ;
  }
  catch (raw_e){
    var e = Caml_js_exceptions.internalToOCamlException(raw_e);
    console.log("-- " + name + " FAILED");
    console.log(e);
    return ;
  }
}

var compare = Caml_obj.caml_compare;

var FloatTree = ImmutableTree.Make({
      compare: compare
    });

var compare$1 = Caml_obj.caml_compare;

var IntTree = ImmutableTree.Make({
      compare: compare$1
    });

function compare$2(a, b) {
  return Caml.caml_int_compare(a.id, b.id);
}

var PersonTree = ImmutableTree.Make({
      compare: compare$2
    });

test("Test Huge Tree", (function (param) {
        var root = timeIt((function (param) {
                var _root = Curry._1(FloatTree.empty, undefined);
                var _a = 1;
                var _current = 0;
                var total = 10000;
                while(true) {
                  var current = _current;
                  var a = _a;
                  var root = _root;
                  if (current > total) {
                    return root;
                  }
                  var next = Curry._2(FloatTree.insert, root, a + 1);
                  if (!Curry._1(FloatTree.checkBlackBalance, next)) {
                    throw {
                          RE_EXN_ID: "Assert_failure",
                          _1: [
                            "ImmutableTreeTest.res",
                            57,
                            10
                          ],
                          Error: new Error()
                        };
                  }
                  _current = current + 1;
                  _a = a + 1;
                  _root = next;
                  continue ;
                };
              }), "Creation of huge tree", undefined);
        var result = timeIt((function (param) {
                return Curry._2(FloatTree.search, root, 10000);
              }), "Search of huge tree", undefined);
        if (!Caml_obj.caml_equal(result, 10000)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  69,
                  2
                ],
                Error: new Error()
              };
        }
        timeIt((function (param) {
                var _root = root;
                var _a = 0;
                var _current = 0;
                var total = 10000;
                while(true) {
                  var current = _current;
                  var a = _a;
                  var root$1 = _root;
                  if (current > total) {
                    return root$1;
                  }
                  var next = Curry._2(FloatTree.deleteNode, root$1, a + 1);
                  if (!Curry._1(FloatTree.checkBlackBalance, next)) {
                    throw {
                          RE_EXN_ID: "Assert_failure",
                          _1: [
                            "ImmutableTreeTest.res",
                            77,
                            10
                          ],
                          Error: new Error()
                        };
                  }
                  _current = current + 1;
                  _a = a + 1;
                  _root = next;
                  continue ;
                };
              }), "Deletion of huge tree", undefined);
        
      }));

test("Array Test", (function (param) {
        var expectedBalancedTree = Curry._2(IntTree.insert, Curry._2(IntTree.insert, Curry._2(IntTree.insert, Curry._1(IntTree.empty, undefined), 1), 2), 3);
        if (!Caml_obj.caml_equal(Curry._1(IntTree.fromArray, [
                    1,
                    2,
                    3
                  ]), expectedBalancedTree)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  88,
                  2
                ],
                Error: new Error()
              };
        }
        if (Caml_obj.caml_equal(Curry._1(IntTree.toArray, Curry._1(IntTree.fromArray, [
                        1,
                        2,
                        3
                      ])), [
                1,
                2,
                3
              ])) {
          return ;
        }
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "ImmutableTreeTest.res",
                89,
                2
              ],
              Error: new Error()
            };
      }));

test("Insert Test", (function (param) {
        if (!Caml_obj.caml_equal(Curry._1(FloatTree.toArray, Curry._2(FloatTree.insert, Curry._1(FloatTree.empty, undefined), 1)), [1])) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  95,
                  2
                ],
                Error: new Error()
              };
        }
        if (Caml_obj.caml_equal(Curry._1(FloatTree.toArray, Curry._2(FloatTree.insert, Curry._2(FloatTree.insert, Curry._1(FloatTree.empty, undefined), 1), 2)), [
                1,
                2
              ])) {
          return ;
        }
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "ImmutableTreeTest.res",
                96,
                2
              ],
              Error: new Error()
            };
      }));

test("Delete Test", (function (param) {
        var tree = Curry._2(FloatTree.insert, Curry._2(FloatTree.insert, Curry._2(FloatTree.insert, Curry._1(FloatTree.empty, undefined), 1), 2), 3);
        var tree2 = Curry._2(FloatTree.insert, Curry._2(FloatTree.insert, Curry._2(FloatTree.insert, tree, 4), 5), 6);
        if (Curry._2(FloatTree.search, Curry._2(FloatTree.deleteNode, tree2, 2), 2) !== undefined) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  105,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._2(FloatTree.search, Curry._2(FloatTree.deleteNode, Curry._1(FloatTree.empty, undefined), 2), 2) !== undefined) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  106,
                  2
                ],
                Error: new Error()
              };
        }
        if (!Caml_obj.caml_equal(Curry._2(FloatTree.search, Curry._2(FloatTree.deleteNode, tree2, 2), 3), 3)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  107,
                  2
                ],
                Error: new Error()
              };
        }
        if (Caml_obj.caml_equal(Curry._1(FloatTree.toArray, Curry._2(FloatTree.deleteNode, tree, 2)), [
                1,
                3
              ])) {
          return ;
        }
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "ImmutableTreeTest.res",
                108,
                2
              ],
              Error: new Error()
            };
      }));

test("Min Max Test", (function (param) {
        var tree = Curry._1(FloatTree.fromArray, [
              1,
              2,
              3,
              4,
              5,
              6
            ]);
        if (!Caml_obj.caml_equal(Curry._1(FloatTree.getMin, tree), 1)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  116,
                  2
                ],
                Error: new Error()
              };
        }
        if (Caml_obj.caml_equal(Curry._1(FloatTree.getMax, tree), 6)) {
          return ;
        }
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "ImmutableTreeTest.res",
                117,
                2
              ],
              Error: new Error()
            };
      }));

test("Fold Test", (function (param) {
        var arr = [
          1,
          2,
          3,
          4,
          5,
          6
        ];
        var tree = Curry._1(FloatTree.fromArray, arr);
        var reduceToArray = function (acc, a) {
          return acc.concat([a]);
        };
        if (!Caml_obj.caml_equal(Curry._3(FloatTree.fold, tree, reduceToArray, []), arr)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  127,
                  2
                ],
                Error: new Error()
              };
        }
        if (Caml_obj.caml_equal(Curry._3(FloatTree.foldRight, tree, reduceToArray, []), Belt_Array.reverse(arr))) {
          return ;
        }
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "ImmutableTreeTest.res",
                128,
                2
              ],
              Error: new Error()
            };
      }));

test("Object data test", (function (param) {
        var arjun = {
          id: 1,
          name: "Arjun"
        };
        var chris = {
          id: 3,
          name: "Chris"
        };
        var benjamin = {
          id: 2,
          name: "Benjamin"
        };
        var arr = [
          arjun,
          benjamin,
          chris
        ];
        var tree = Curry._1(PersonTree.fromArray, arr);
        if (!Caml_obj.caml_equal(Curry._2(PersonTree.search, tree, arjun), arjun)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  140,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._2(PersonTree.search, Curry._2(PersonTree.deleteNode, tree, arjun), arjun) !== undefined) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  141,
                  2
                ],
                Error: new Error()
              };
        }
        if (!Caml_obj.caml_equal(Curry._1(PersonTree.getMin, tree), arjun)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  142,
                  2
                ],
                Error: new Error()
              };
        }
        if (!Caml_obj.caml_equal(Curry._1(PersonTree.getMax, tree), chris)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  143,
                  2
                ],
                Error: new Error()
              };
        }
        if (!Caml_obj.caml_equal(Curry._1(PersonTree.getData, tree), benjamin)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  144,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._1(PersonTree.getData, Curry._1(PersonTree.empty, undefined)) === undefined) {
          return ;
        }
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "ImmutableTreeTest.res",
                145,
                2
              ],
              Error: new Error()
            };
      }));

test("Update test", (function (param) {
        var chris = {
          id: 3,
          name: "Chris"
        };
        var benjamin = {
          id: 3,
          name: "Benjamin"
        };
        var arr = [
          {
            id: 1,
            name: "Arjun"
          },
          chris
        ];
        var tree = Curry._1(PersonTree.fromArray, arr);
        if (!Caml_obj.caml_equal(Curry._2(PersonTree.search, Curry._3(PersonTree.update, tree, chris, benjamin), chris), benjamin)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  157,
                  2
                ],
                Error: new Error()
              };
        }
        if (!Caml_obj.caml_equal(Curry._2(PersonTree.search, Curry._3(PersonTree.update, tree, chris, benjamin), benjamin), benjamin)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  158,
                  2
                ],
                Error: new Error()
              };
        }
        if (!Caml_obj.caml_equal(Curry._2(PersonTree.search, tree, benjamin), chris)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  159,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._2(PersonTree.search, Curry._3(PersonTree.update, Curry._1(PersonTree.empty, undefined), chris, benjamin), chris) === undefined) {
          return ;
        }
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "ImmutableTreeTest.res",
                160,
                2
              ],
              Error: new Error()
            };
      }));

test("Traversal Test", (function (param) {
        var arr = [
          1,
          2,
          3,
          4,
          5
        ];
        var result = Curry._3(FloatTree.traverseInOrder, Curry._1(FloatTree.fromArray, arr), (function (acc, d) {
                return acc.concat([d]);
              }), []);
        if (!Caml_obj.caml_equal(result, arr)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  168,
                  2
                ],
                Error: new Error()
              };
        }
        var result$1 = Curry._3(FloatTree.traversePreOrder, Curry._1(FloatTree.fromArray, arr), (function (acc, d) {
                return acc.concat([d]);
              }), []);
        if (!Caml_obj.caml_equal(result$1, [
                2,
                1,
                4,
                3,
                5
              ])) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  171,
                  2
                ],
                Error: new Error()
              };
        }
        var result$2 = Curry._3(FloatTree.traversePostOrder, Curry._1(FloatTree.fromArray, arr), (function (acc, d) {
                return acc.concat([d]);
              }), []);
        if (Caml_obj.caml_equal(result$2, [
                1,
                3,
                5,
                4,
                2
              ])) {
          return ;
        }
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "ImmutableTreeTest.res",
                174,
                2
              ],
              Error: new Error()
            };
      }));

test("Range search test", (function (param) {
        var tree = Curry._1(FloatTree.fromArray, [
              0,
              1,
              2,
              3,
              4,
              5
            ]);
        if (!Caml_obj.caml_equal(Curry._3(FloatTree.searchRange, tree, 2, 5), [
                2,
                3,
                4,
                5
              ])) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  182,
                  2
                ],
                Error: new Error()
              };
        }
        if (!Caml_obj.caml_equal(Curry._3(FloatTree.searchRange, tree, -1, 2), [
                0,
                1,
                2
              ])) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  183,
                  2
                ],
                Error: new Error()
              };
        }
        if (!Caml_obj.caml_equal(Curry._3(FloatTree.searchRange, tree, 0, 2), [
                0,
                1,
                2
              ])) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  184,
                  2
                ],
                Error: new Error()
              };
        }
        if (!Caml_obj.caml_equal(Curry._3(FloatTree.searchRange, tree, -10, 10), [
                0,
                1,
                2,
                3,
                4,
                5
              ])) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  185,
                  2
                ],
                Error: new Error()
              };
        }
        if (!Caml_obj.caml_equal(Curry._3(FloatTree.searchRange, tree, -10, -3), [])) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  186,
                  2
                ],
                Error: new Error()
              };
        }
        if (Caml_obj.caml_equal(Curry._3(FloatTree.searchRange, tree, 6, 10), [])) {
          return ;
        }
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "ImmutableTreeTest.res",
                187,
                2
              ],
              Error: new Error()
            };
      }));

test("Basic operations test", (function (param) {
        var tree = Curry._1(IntTree.fromArray, [
              1,
              2,
              3
            ]);
        if (!Caml_obj.caml_equal(Curry._1(IntTree.getData, tree), 2)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  196,
                  2
                ],
                Error: new Error()
              };
        }
        if (!Caml_obj.caml_equal(Belt_Option.flatMap(Curry._1(IntTree.getLeft, tree), IntTree.getData), 1)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  197,
                  2
                ],
                Error: new Error()
              };
        }
        if (!Caml_obj.caml_equal(Belt_Option.flatMap(Curry._1(IntTree.getRight, tree), IntTree.getData), 3)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  198,
                  2
                ],
                Error: new Error()
              };
        }
        if (Belt_Option.flatMap(Belt_Option.flatMap(Curry._1(IntTree.getRight, tree), IntTree.getRight), IntTree.getData) !== undefined) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  199,
                  2
                ],
                Error: new Error()
              };
        }
        if (Belt_Option.flatMap(Belt_Option.flatMap(Curry._1(IntTree.getRight, tree), IntTree.getLeft), IntTree.getData) !== undefined) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  200,
                  2
                ],
                Error: new Error()
              };
        }
        if (Belt_Option.flatMap(Belt_Option.flatMap(Curry._1(IntTree.getLeft, tree), IntTree.getLeft), IntTree.getData) !== undefined) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  201,
                  2
                ],
                Error: new Error()
              };
        }
        if (Belt_Option.flatMap(Belt_Option.flatMap(Curry._1(IntTree.getLeft, tree), IntTree.getRight), IntTree.getData) !== undefined) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  202,
                  2
                ],
                Error: new Error()
              };
        }
        if (Belt_Option.flatMap(Belt_Option.flatMap(Curry._1(IntTree.getLeft, tree), IntTree.getRight), IntTree.getRight) !== undefined) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  203,
                  2
                ],
                Error: new Error()
              };
        }
        if (Belt_Option.flatMap(Belt_Option.flatMap(Curry._1(IntTree.getLeft, tree), IntTree.getLeft), IntTree.getRight) !== undefined) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  204,
                  2
                ],
                Error: new Error()
              };
        }
        if (Belt_Option.flatMap(Belt_Option.flatMap(Curry._1(IntTree.getRight, tree), IntTree.getRight), IntTree.getLeft) !== undefined) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  205,
                  2
                ],
                Error: new Error()
              };
        }
        if (Belt_Option.flatMap(Belt_Option.flatMap(Curry._1(IntTree.getRight, tree), IntTree.getLeft), IntTree.getLeft) !== undefined) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  206,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._1(IntTree.getHeight, Curry._1(IntTree.fromArray, [])) !== 0) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  208,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._1(IntTree.getHeight, Curry._1(IntTree.fromArray, [1])) !== 1) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  209,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._1(IntTree.getHeight, Curry._1(IntTree.fromArray, [
                    1,
                    2,
                    3
                  ])) !== 2) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  210,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._1(IntTree.getHeight, Curry._1(IntTree.fromArray, [
                    1,
                    2,
                    3,
                    4,
                    5
                  ])) !== 3) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  211,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._1(IntTree.getLength, Curry._1(IntTree.fromArray, [])) !== 0) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  213,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._1(IntTree.getLength, Curry._1(IntTree.fromArray, [1])) !== 1) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  214,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._1(IntTree.getLength, Curry._1(IntTree.fromArray, [
                    1,
                    2,
                    3
                  ])) !== 3) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  215,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._1(IntTree.getLength, Curry._1(IntTree.fromArray, [
                    1,
                    2,
                    3,
                    4,
                    5
                  ])) !== 5) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  216,
                  2
                ],
                Error: new Error()
              };
        }
        if (!Caml_obj.caml_equal(Belt_Option.map(Curry._1(IntTree.getLeft, Curry._1(IntTree.fromArray, [
                            1,
                            2,
                            3,
                            4,
                            5
                          ])), IntTree.getLength), 1)) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  217,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._1(IntTree.isEmpty, tree) !== false) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  219,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._1(IntTree.isEmpty, Curry._2(IntTree.deleteNode, Curry._2(IntTree.deleteNode, tree, 1), 2)) !== false) {
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "ImmutableTreeTest.res",
                  220,
                  2
                ],
                Error: new Error()
              };
        }
        if (Curry._1(IntTree.isEmpty, Curry._2(IntTree.deleteNode, Curry._2(IntTree.deleteNode, Curry._2(IntTree.deleteNode, tree, 1), 2), 3)) === true) {
          return ;
        }
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "ImmutableTreeTest.res",
                221,
                2
              ],
              Error: new Error()
            };
      }));

exports.timeIt = timeIt;
exports.test = test;
exports.FloatTree = FloatTree;
exports.IntTree = IntTree;
exports.PersonTree = PersonTree;
/* FloatTree Not a pure module */
