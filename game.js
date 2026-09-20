import targetWords from "./targetWords.js";
import validWords from "./validWords.js";
import hints from "./hints.js";

const params = new URLSearchParams(window.location.search);
const targetWordIndex = Number(params.get("word"));
const input = document.getElementById("guess-input");
const inputLine = document.getElementById("input-line");
const successMessage = document.getElementById("successMessage");
const remainingGuesses = document.getElementById("remainingGuesses");
const guessRecap = document.getElementById("guessRecap");
const output = document.getElementById("terminal-output");
const maxNumGuess = 6;
let targetWord;
let guess;
let numGuesses = 0;
let gameWon = false;
let gameOver = false;
let tempTargetWord;

//Press Enter
input.addEventListener("keydown", function(event) 
{ if (event.key === "Enter") { checkWord(); }});

//Focus input on click
document.addEventListener("click", function()
{ if (!gameOver) {input.focus()} });

function checkWord()
{
    
    if (gameOver)
    {
        return;
    }

    guess = input.value.trim().toUpperCase();

    output.innerHTML +=
    `
        <p>
            <span class = "prompt">C:\\AccessCurrent&gt;</span>
            ${guess}
        </p>
    `;

    // Error out if word isn't long enough
    if (guess.length != 6)
    {
        if (guess == "HINT")
        {
            output.innerHTML += `<span class="hint">HINT:  ${hints[targetWordIndex]}</span><br>`;
            input.value = "";
        }
        else
        {
            output.innerHTML += `<span class="error">ERROR: Given command must be 6 letters.</span><br>`;
            input.value = "";
        }
        return;
    }
    else if (!validWords.includes(guess))
    {
        output.innerHTML += `<span class="error">ERROR: Invalid command.</span><br>`;
        input.value = "";
        return;
    }

    //Guess is valid
    setTargetWord();
    numGuesses++;
    const recap = displayGuessRecap();

    //Correct Guess
    if (guess == targetWord)
    {
        gameWon = true;
        gameOver = true;
        showLoadingBar();
        input.value = "";
        input.disabled = true;
        inputLine.style.display = "none";
        return;
    } 
   
    //Wrong guess
    output.innerHTML += `<span class="error">ERROR: Incorrect Password.</span><br>`;
    output.innerHTML += `<p>${recap}</p><br>`;

    //Check if out of guesses
    if (numGuesses >= maxNumGuess)
    {
        gameOver = true;
        output.innerHTML += `<span class="error">FAIL: Maximum attempts reached.</span><br>`;
        output.innerHTML += `<span class="error">CONNECTION LOST</span><br>`;
        output.innerHTML += `<p>Reload to try again.</p>`
        input.value = "";
        input.disabled = true;
        inputLine.style.display = "none";
        return;
    }

    //Still has guesses remaining
    output.innerHTML += `<p>Attempts Remaining: ${maxNumGuess - numGuesses}<br><br></p>`;

    input.value = "";
}

function displayGuessRecap()
{
    //console.log("racap function called", guess.length);
    let recapWord = [];
    let skipIndex = [];
    let numLetters = compareMatchingLetters(targetWord, guess);
    let lettersSeen = 0;

    for (let i = 0; i < guess.length; i++)
    {
        let letter = guess[i];

        if (letter == targetWord[i])
        {
            recapWord[i] = `<span class = "correct-letter">${letter}</span>`;
            skipIndex.push(i);
            tempTargetWord[i] = '*';
            lettersSeen++;
        }
        console.log(skipIndex);
    }

    for (let i = 0; i < guess.length; i++)
    {
        let letter = guess[i];
        console.log("Indexes to skip: " + skipIndex);

        if (!skipIndex.includes(i)) 
        {
            if (tempTargetWord.includes(letter) && lettersSeen != numLetters)
            {
                recapWord[i] = `<u>${letter}</u>`;
                lettersSeen++;
            }
            else { recapWord[i] = letter; }
        }
    }
    
    return recapWord.join("");
}

function compareMatchingLetters(word1, word2)
{
    let matchingLetters = 0;
    let guessedLetters = [];

    for (let i = 0; i < word1.length; i++)
    {
        if (word1.includes(word2[i]) && !guessedLetters.includes(word2[i])) 
            { 
                matchingLetters++; 
                guessedLetters.push(word2[i]);
            }
    }

    return matchingLetters;
}

function setTargetWord()
{
    if (Number.isInteger(targetWordIndex) && targetWordIndex >= 0 && targetWordIndex < targetWords.length)
    {
        targetWord = targetWords[targetWordIndex];
        tempTargetWord = targetWord.split("");
    }
}

function showLoadingBar()
{
    output.innerHTML +=
        `<p>PASSWORD CORRECT</p>
        <div class = "loading-bar">
            <div class = "loading-bar-progress"></div>
        </div>`;

        const loadingBarProgress = document.querySelector(".loading-bar-progress");

    // start update
    setTimeout(function()
    {
        loadingBarProgress.style.width = "100%";

        //trigger codeScroll after 1.5s
        setTimeout(function()
        {
            startCodeScroll()
        }, 1500);

    }, 100);
}

function startCodeScroll()
{
    //clear screen
    output.innerHTML = "";

    const codeScroll = document.createElement("div");
    codeScroll.classList.add("code-scroll");

    output.appendChild(codeScroll);

    const codeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]<>/=+*#$%@";

    function addCodeScrollLine()
    {
        let line = "";

        for (let i = 0; i < 45; i++)
        {
            line += codeChars[Math.floor(Math.random() * codeChars.length)];
        }

        //add new line
        codeScroll.innerHTML += `<div>${line}</div>`;

        // Scroll to newest line
        codeScroll.lastElementChild.scrollIntoView({
            behavior: "auto",
            block: "end"
        });
    }

    //Add new line in 20ms
    const scrollInterval = setInterval(addCodeScrollLine, 20);

    //Stop scroll after 3 sec
    setTimeout(function()
    {
        clearInterval(scrollInterval);

        setTimeout(function()
        {
            showWinScreen();  
        }, 500);
    }, 3000);
}

function showWinScreen()
{
    output.innerHTML = "";

    //delay half second before display
    setTimeout(function()
    {
        const winMessage = document.createElement("div");
        winMessage.classList.add("win-message");
        output.appendChild(winMessage);

        const message = "WELCOME TO THE CURRENT";
        let index = 0;

        // "Type" out the win message
        const displayInterval = setInterval(function()
        {
            winMessage.textContent += message[index];
            index++;

            if (index >= message.length)
            {
                clearInterval(displayInterval);

                //Add Gain Insight message
                const insightMessage = document.createElement("div");
                insightMessage.classList.add("gain-insight");

                insightMessage.textContent = "Gain 1 Insight"

                winMessage.appendChild(insightMessage);
            }
        }, 100);
    }, 500);
}