const CONSTANTS = {
  ANY: '%',
  SINGLE: '_',
  ESCAPE: '\\'
};

/**
 * Iterative wildcard search algorithm
 * http://dodobyte.com/wildcard.html#Iterative_Algorithms
 */
function isMatch (str, pat) {
  let strIndex = 0;
  let patIndex = 0;
  let strLocation = null;
  let patLocation = null;
  let escaped = false;

  while (strIndex < str.length) {
    if (pat[patIndex] === CONSTANTS.ESCAPE) {
      escaped = true;
      patIndex++;
    } else {
      escaped = false;
    }

    // Unescaped '_' - save current "str" and "pat" positions
    // If we're at the end of "pat" exit early as it must match
    if (pat[patIndex] === CONSTANTS.ANY && !escaped) {
      strLocation = strIndex;
      patLocation = ++patIndex;
      if (patIndex === pat.length) {
        return true;
      }
      continue;
    }

    // Equal characters or unescaped '_'
    if (str[strIndex] === pat[patIndex] || (pat[patIndex] === CONSTANTS.SINGLE && !escaped)) {
      strIndex++;
      patIndex++;
    } else {
      // If there was not a '%' seen previously there is no match
      if (!patLocation) {
        return false;
      }
      // Go back to where we saw the '%'
      strIndex = ++strLocation;
      patIndex = patLocation;
    }
  }

  // Once you go through all of "str" the rest of "pat" has to be '%'s or it's not a match
  while (pat[patIndex] === CONSTANTS.ANY) {
    patIndex++;
  }
  return patIndex === pat.length;
}

module.exports = {
  isMatch,
  iIsMatch: (str, pat) => {
    return isMatch(str.toLowerCase(), pat.toLowerCase());
  }
};
