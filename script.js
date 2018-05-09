/**
 * @module AlphaGen
 * Uses jquery for getting/setting html elements.
 * Tutorial: http://jqfundamentals.com
**/

const shown = []; // This holds the alphabets being asked for current question so that its not repeated
const question = $('#question'); // gets the question element
const result = $('#result'); // get the results element
const results = []; // this is the result array, which will hold the data
let questionNo = 1; // question numbering
let current; // current holds the displayed alphabets

/**
 * genRandom - Generates random alphabet from the list
 * @param {boolean} [check=true] Put in a check if need to check for duplicates or not. Primarily used when displaying
 * @returns {string} Returns the char
 */
const genRandom = (check = true) => {
 const list = "BCDFGHJKLMNPQURSTVWXYZ";
 const char = list.substr( Math.floor(Math.random() * list.length), 1);
 // If the check for duplicates is false then return the char. Used in asking the question
 if (!check) {
  return char;
 }
 // If we are checking for duplicates then see if its shown before otherwise genRandom again (as below)
 if (!shown.includes(char)) {
    shown.push(char);
    return char;
  }
  // as mentioned in above comment
  return genRandom();
};



/**
 * run - This runs the question generation, where it limits according to no of alphabets
 * @param {number} [limit=7] Default limit is 7, this can be changed when called eg: run(8)
 * @returns {}
 */
const run = (limit = 7) => {
 let count = 1;
  while(count < limit) {
    question.append(genRandom());
    count++;
  }
}

/**
 * process - This process the key stroke when the user replies with an answer (accepted y/n from keyboard)
 * @param {type} key It contains the value of the key, which the user pressed
 * @param {type} chk Contains the question alphabet being asked
 * @returns {}
 */
const process = (key, chk) => {
   const options = ['y', 'n']; // accepted answers from the user
   let res;  // holds the result

   // if key that user pressed, includes in the accepted answer then assign it to res
   if (options.includes(key.toLowerCase())) { // here we convert it to lowercase, just in case caps in on.
    res = key.toLowerCase(); // same as above
   }

   // push the result for the question, to the results array. Which we use later on to display results
   results.push({
    qno: questionNo, // question No
    ans: res, // answer user pressed
    disp: current, // The alphabets which were displayed
    chk: chk // the question alphabet, which user has to respond to.
   });

   questionNo++; // increment the question numbers
   $(document).off('keypress'); // remove anyevents on keypress, as only initiate it after we ask the question
   question.html(''); // clean the question, so that we start from fresh
   init(); // call the init function again.
};

/**
 * showResult - Displays the result, after all the questions are finished
 * @param {object} results The results array, that we were pushing a result to.
 * @returns {string} html for displaying
 */
const showResult = (results) => {
  let html = '<ul>';
  results.forEach((r) => {
    html += `<li>#: ${r.qno}</li>`; // add question no
    html += `<li>Display: ${r.disp}</li>`; // add alphabets displayed
    html += `<li>Question: ${r.chk}</li>`; // the alphabet being asked if included
    html += `<li>Answer: ${r.ans === 'n' ? 'No' : 'Yes'}</li>`; // answer whether yes/no
  });
  html += '</ul>';

  return html;
};


/**
 * ask - This function is invoked 3 seconds after the alphabets are displayed
 * @returns {}
 */
const ask = () => {
 const chk = genRandom(false); // generate a random alphabet, which we ask the user question
 current = question.html(); // get the current displayed alphabets
 question.html(chk); // show an alphabet
 $(document).on('keypress', (e) => process(e.key, chk)); // setup listening to keyboard events, so that we can accept answer
}


/**
 * init - Initalizes the tests
 * @param {number} [times=3] By default it only asks 3 times, you can change it to whatever. eg: init(5) in document.ready.
 * @returns {type} Description
 */
const init = (times = 3) => {
 if (questionNo <= times) { // if questionNo is less or eql to times, then ask next question
  run();
  setTimeout(() => ask(), 3000);
} else { // say we have completed, and show results
  question.html('Completed!');
  result.addClass('result');
  result.html(showResult(results));
 }
}

// start the main function. Only run after the document is fully loaded so that we have access to all libs.
$(document).ready(() => {
  init();
});
