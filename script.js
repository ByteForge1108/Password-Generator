const inputSlider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[data-lengthnumber]");
const paswwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();


// set strength color to gray
setIndicator("#ccc");

function sufflePassword (array) {
    // Fishers Yates Method
     for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

// set password length
function handleSlider () {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength; 

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = 
    ((passwordLength-min) * 100) / (max-min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow 
  indicator.style.boxShadow = `0px 0px 12px 1px ${color} `;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNUmber () {
    return getRndInteger(0,10);
}

function generateLowerCase () {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase () {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol () {
    const randNum = getRndInteger(0,symbols.length);
    return symbols[randNum];
}

function calcStrength () {
    let hasLower = false;
    let hasUpper = false;
    let hasNum = false;
    let hasSymbol = false;

    if(lowerCaseCheck.checked) hasLower = true;
    if(upperCaseCheck.checked) hasUpper = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSymbol = true;

    if(hasLower && hasUpper && hasNum && hasSymbol && passwordLength>=8)
    setIndicator("#0f0");
    else if((hasLower || hasUpper) && (hasSymbol || hasNum) && passwordLength>=6)
    setIndicator("#ff0")
    else
    setIndicator("#f00");
}

// for showing copied message
async function copyContent () {
    try{
    // copying to clipboard 
    await navigator.clipboard.writeText(paswwordDisplay.value);
    copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed"
    }

    copyMsg.classList.add("active")

    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000);
}

inputSlider.addEventListener("input", (e) =>{
    passwordLength = Number(e.target.value);
    handleSlider();}
);

copyBtn.addEventListener("click", (e)=>{
    if(paswwordDisplay.value)
        copyContent();
});

function handleCheckBoxChange () {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        checkCount++;
    });

    // default case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

generateBtn.addEventListener('click', ()=>{
    // if no checkbox clicked 
    if(checkCount<=0) return;

    // special case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // get new password
    // first remove old one's
    password = "";

    // first check which checkboxes are checked
    // if(upperCaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowerCaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password += generateRandomNUmber();
    // }
    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }

    let func = [];
    if(upperCaseCheck.checked)
        func.push(generateUpperCase);

    if(lowerCaseCheck.checked)
        func.push(generateLowerCase);

    if(numberCheck.checked)
        func.push(generateRandomNUmber);

    if(symbolCheck.checked)
        func.push(generateSymbol);

    for(let i=0; i<func.length; i++){
        password += func[i]();
    }

    for(let i=0; i<passwordLength-func.length; i++){
        let idx = getRndInteger(0, func.length);
        password += func[idx]();
    }

    // suffle it 
    password = sufflePassword(Array.from(password));

    // show in UI
    paswwordDisplay.value = password;

    // calculate strength
    calcStrength();
});


