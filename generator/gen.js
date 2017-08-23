var DEBUG = false;
var INPUT = ["[Held]",
             "[Active],\n[Held, Active],\n[Held]",
             "[Active, Waiting],\n[Active]",
             "[Active],\n[Held, Active(out)]"];

var DONE = [];
var TODO = [];


// Execute
main();

function main() {

  // Get input
  INPUT.map(function(aInput) {
    TODO.push(aInput.split(",\n").sort());
  });

  // process
  while (TODO.length) {

    console.log(">>> " + TODO);
    TODO.map(function(a) {console.log("--- " + a)});

    console.log(">>> " + DONE);
    DONE.map(function(a) {console.log("+++ " + a)});



    // Get input
    var iSet = TODO.shift();

    // Save the input to DONE pool
    DONE.push(iSet);

    // Process iSet and save the new sets
    var newSets = process(iSet);
    newSets.map(function(aSet) {

      // Check DONE
      if (DONE.some(function(aSRC) {
        return aSRC.length === aSet.length &&
               !aSRC.some(function(aValue, aIndex) {
          return aValue !== aSet[aIndex];
        });
      })) return;

      // Check TODO
      if (TODO.some(function(aSRC) {
        return aSRC.length === aSet.length &&
               !aSRC.some(function(aValue, aIndex) {
          return aValue !== aSet[aIndex];
        });
      })) return;

      // Push
      TODO.push(aSet);
    });

    console.log(">>> " + newSets);
    newSets.map(function(a) {console.log("*** " + a)});
    console.log("...");
  }
}


function process(aInput) {
  var output = [];

  var iSet = aInput;
  var iString = arrayToString(iSet);

  // CD
  // TODO: exclude [held]
  var oSet = ["[Active, Waiting]", "[Active]"];
  oSet = oSet.sort();
  output.push(oSet);

  var oString = arrayToString(oSet);
  console.log("// \"" + iString + "\" -> " +
              "\"(NEW)\\n" + oString + "\"" +
              " [label = \"CD\"];");

  // NF
  oSet = generateSet(aInput, function(aToken) {
    switch(aToken) {
      case "[Active]":            return "[Held, Active(out)]";
      case "[Held]":              return "[Held, Active(out)]";
      case "[Held, Active(out)]": return "[Active, Active]";
      case "[Active, Active]":    return "[Active, Active]";
      case "[Active, Waiting]":   return "[Held, Active]";
      case "[Active, Held]":      return "[Held, Active]";
      case "[Held, Active]":      return "[Active, Held]";
      default:                    return "UNKOWN";
    }
  });
  output.push(oSet);

  oString = arrayToString(oSet);
  console.log("\"" + iString + "\" -> " +
              "\"" + oString + "\"" +
              " [label = \"NF\"];");

  // F
  oSet = generateSet(aInput, function(aToken) {
    switch(aToken) {
      case "[Active]":            return "[Held]";
      case "[Held]":              return "[Active]";
      case "[Held, Active(out)]": return "[Active, Active]";
      case "[Active, Active]":    return "[Active, Active]";
      case "[Active, Waiting]":   return "[Held, Active]";
      case "[Active, Held]":      return "[Held, Active]";
      case "[Held, Active]":      return "[Active, Held]";
      default:                    return "UNKOWN";
    }
  });
  output.push(oSet);

  oString = arrayToString(oSet);
  console.log("\"" + iString + "\" -> " +
              "\"" + oString + "\"" +
              " [label = \"F\"];");

  // EMPTY LINE
  console.log("");

  return output;
}

function generateSet(aISet, aFunction) {
  // Move one step
  var oSet = aISet.map(aFunction);

  // Add Active state if needed
  if (oSet.some(function(aToken) {
    return aToken !== "[Held]" &&
           aToken !== "[Active]";
  })) {
    oSet.push("[Active]");
  }

  // Uniqify oSet
  oSet = oSet.filter(function(aTerget, aPos){
    return oSet.indexOf(aTerget) == aPos;
  });

  return oSet.sort();
}

function arrayToString(aArray) {
  return aArray.reduce(function(aOut, aToken) {return aOut + ",\\n" + aToken});
}

function debug(aString) {
  if (DEBUG) {
    console.log(aString);
  }
}

