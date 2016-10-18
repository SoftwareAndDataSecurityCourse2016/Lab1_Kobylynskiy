

var Vigenere = (function() {

    // standard frequency for each char in English
    standardFrequency = {
        'A': .0651738, 'B': .0124248, 'C': .0217339, 'D': .0349835,
        'E': .1041442, 'F': .0197881, 'G': .0158610, 'H': .0492888,
        'I': .0558094, 'J': .0009033, 'K': .0050529, 'L': .0331490,
        'M': .0202124, 'N': .0564513, 'O': .0596302, 'P': .0137645,
        'Q': .0008606, 'R': .0497563, 'S': .0515760, 'T': .0729357,
        'U': .0225134, 'V': .0082903, 'W': .0171272, 'X': .0013692,
        'Y': .0145984, 'Z': .0007836
    };

    // remove all whitespaces in a string
    function strip(str) {
        return str.replace(/\s+/g, '');
    }

    // convert from char to ascii
    function ascii(char) {
        return char.charCodeAt(0);
    }

    // convert from ascii to char
    function chr(ascii) {
        return String.fromCharCode(ascii);
    }

    // shift an array left cicularly
    function circularShiftLeft(array) {
        array.push(array.shift());
    }

    // get the frequency table of each char in a string
    function getFrequencyTable(str) {
        var i, charCount, charFrequency;
        
        charCount = {};
        for (i = 0; i < 26; ++i) {
            charCount[chr(i + ascii('A'))] = 0;
        }
        for (i = 0; i < str.length; ++i) {
            ++charCount[str[i]];
        }
        
        charFrequency = {};
        for (i = 0; i < 26; ++i) {
            charFrequency[chr(i + ascii('A'))] = 
                charCount[chr(i + ascii('A'))] / str.length;
        }
        //console.log(charFrequency);
        return charFrequency;
    }

    // calculate the index of coincidence between the 
    // stardard and the given frequency
    function indexOfCoincidence(frequencyTable) {
        var i, c, idx;

        idx = 0;
        for (i = 0; i < 26; ++i) {
            c = chr(i + ascii('A'));
            idx += frequencyTable[c] * standardFrequency[c];
        }

        return idx;
    }

    // divide the string into groups
    function divide(str, numGroups) {
        var i, groups;

        groups = [];
        for (i = 0; i < numGroups; ++i) {
            groups.push([]);
        }
        for (i = 0; i < str.length; ++i) {
            groups[i % numGroups].push(str[i]);
        }
        for (i = 0; i < numGroups; ++i) {
            groups[i] = groups[i].join('');
        }
        console.log(groups[0]);
        return groups;
    }

    // get the most probable Caeser shift amount and the corresponding difference of a ciphertext 
    function bestCaeserShift(ciphertext) {
        var plaintext, shiftAmount, bestShiftAmount, bestOffset, index, 
            difference, bestDifference;

        bestShiftAmount = 0;
        bestDifference = Number.MAX_VALUE;
        for (shiftAmount = 0; shiftAmount < 26; ++shiftAmount) {
            plaintext = Caeser.decrypt(ciphertext, shiftAmount);
            index = indexOfCoincidence(getFrequencyTable(plaintext));
            difference = Math.abs(index - 0.065); // 0.065 is the index for natural English
            if (difference < bestDifference) {
                bestDifference = difference;
                bestShiftAmount = shiftAmount;
            }
        }

        return [bestShiftAmount, bestDifference];
    }

    var Vigenere = {


        crack: function(ciphertext, maxKeyLength) {
            var i, keyLen,
                groups, groupIndex, group, 
                info,
                plaintexts,
                shiftAmounts, shiftAmount, difference, totalDifference,

                overall;


            overall = [];

            // enumerate key length
            for (keyLen = 1; keyLen <= maxKeyLength; ++keyLen) {

                // get groups
                groups = divide(ciphertext, keyLen);
                console.log(groups[0].length);
                totalDifference = 0;
                plaintexts = [];
                // enumerate shift amount for each group
                for (groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
                    group = groups[groupIndex];

                    info = bestCaeserShift(group);
                    shiftAmount = info[0];
                    difference = info[1];
                   // console.log(difference);
                    totalDifference += difference;
                    plaintexts.push(Caeser.decrypt(group, shiftAmount));
                }

                // build plaintext 
                plaintext = [];
                for (i = 0; i < ciphertext.length; ++i) {
                    plaintext.push(plaintexts[i % keyLen].charAt(i / keyLen));
                }
                plaintext = plaintext.join('');
                //console.log(plaintext)
                overall.push([totalDifference, plaintext]);
            }

           /* overall.sort(function(a, b) {
                return a[0] < b[0];
            });*/

            return overall;
        },
    };


    return Vigenere;

})();
