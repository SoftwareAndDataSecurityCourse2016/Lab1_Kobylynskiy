/**
 * Created by kobyl on 05.10.2016.
 */
var message = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
var character = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
var english = new Array('E','T','A','O','I','N','S','H','R','D','L','C','U','M','W','F','G','Y','P','B','V','K','J','X','Q','Z');
var substitute = false;
var previous = "";
window.onload = function() {
        go_frequency();
}
function slider_support()
{
    var i = document.createElement("input");
    i.setAttribute("type", "range");
    return i.type != "text";
}

function go_frequency()
{
    document.getElementById("plaintext").onkeyup = function (){update_frequency();};
    document.getElementById("controls").style.visibility = "hidden";
    document.getElementById("frequency").style.visibility = "visible";
    document.getElementById("output").innerHTML = "";
    update_frequency();
}

function update_frequency()
{
    var charcode;
    var plaintext = document.getElementById("plaintext").value;
    message = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    for(var i=0;i<plaintext.length;i++)
    {
        charcode = plaintext.charCodeAt(i);
        if(charcode > 64 && charcode < 91 || charcode > 96 && charcode < 123)
        {
            if(charcode > 96) { charcode -= 97; } else { charcode -= 65; }
            message[charcode]++;
        }
    }

    var subs = document.querySelectorAll(".substitute");
    for(var i=0;i<26;i++)
    {
        subs[i].innerHTML = message[i];
    }
}

function decipher()
{
    var plaintext = document.getElementById("plaintext").value;
    var ciphertext = "";
    var charcode, capital;

    if(!slider)
    {
        if(isNaN(document.getElementById("offset").value) || document.getElementById("offset").value < 0) { document.getElementById("offset").value = 0; }
        if(document.getElementById("offset").value > 25) { document.getElementById("offset").value = 25; }
    }
    else
    {
        document.getElementById("offset_value").innerHTML = document.getElementById("offset").value;
    }

    for(var i=0;i<plaintext.length;i++)
    {
        charcode = plaintext.charCodeAt(i);
        if(charcode > 64 && charcode < 91 || charcode > 96 && charcode < 123)
        {
            if(charcode > 96) { capital = false; charcode -= 97; } else { capital = true; charcode -= 65; }
            charcode = (eval(charcode) + eval(offset))%26;
            if(capital == true) { charcode += 65; } else { charcode += 97; }
        }
        ciphertext = ciphertext + String.fromCharCode(charcode);
    }
    document.getElementById("output").innerHTML = ciphertext+ " ";
}

function remove_combo(letter)
{
    var new_div, parent;

    // swap div for combo
    new_div = document.createElement('div');
    new_div.setAttribute('id', letter.getAttribute('id'));
    new_div.setAttribute('class', letter.getAttribute('class'));
    new_div.innerHTML = letter.options[letter.selectedIndex].text
    parent = letter.parentNode;
    parent.insertBefore(new_div, letter);
    parent.removeChild(letter);
    new_div.onclick = function (){show_combo(this);};
    substitution();
}

function change_letter(letter)
{
    var char = String.fromCharCode(letter.selectedIndex+65);
    var subs = document.querySelectorAll(".substitute");
    letter.onblur = null;
    for(var i=0;i<26;i++)
    {
        if(subs[i].innerHTML == char) { subs[i].innerHTML = previous; }
    }
    substitution();
    remove_combo(letter);
}

function show_combo(letter)
{
    var i, option, combo, charcode, parent;
    previous = letter.innerHTML;

    // swap div for combo
    combo = document.createElement('select');
    combo.setAttribute('id', letter.getAttribute('id'));
    combo.setAttribute('class', letter.getAttribute('class'));
    charcode = letter.innerHTML.charCodeAt(0) - 65;
    parent = letter.parentNode;
    parent.insertBefore(combo, letter);
    parent.removeChild(letter);

    // add options
    for (i = 65; i < 91; i++)
    {
        option = document.createElement('option');
        option.value = option.text = String.fromCharCode(i);
        combo.add(option);
    }
    combo.selectedIndex = charcode;
    combo.focus();
    combo.onchange = function (){change_letter(this);};
    combo.onblur = function (){remove_combo(this);};
}

function substitution()
{
    var charcode, capital;
    var plaintext = document.getElementById("plaintext").value;
    var ciphertext = "";

    for(var i=0;i<plaintext.length;i++)
    {
        charcode = plaintext.charCodeAt(i);
        if(charcode > 64 && charcode < 91 || charcode > 96 && charcode < 123)
        {
            if(charcode > 96) { charcode -= 97; capital = false; } else { charcode -= 65; capital = true;}
            if(capital)
            {
                ciphertext = ciphertext + document.getElementById(String.fromCharCode(charcode+65)).innerHTML;
            }
            else
            {
                ciphertext = ciphertext + document.getElementById(String.fromCharCode(charcode+65)).innerHTML.toLowerCase();
            }
        }
        else
        {
            ciphertext = ciphertext + String.fromCharCode(charcode);
        }
    }
    document.getElementById("output").innerHTML = ciphertext;
}

function reset_order()
{
    character = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    english = ['E','T','A','O','I','N','S','H','R','D','L','C','U','M','W','F','G','Y','P','B','V','K','J','X','Q','Z'];

    update_frequency();
}
// get the frequency table of each char in a string
function analyse_frequency()
{
    var i, j, temp;

    for(i=0; i<25; i++)
    {
        for(j=i+1; j<=25; j++)
        {
            if(message[i] < message[j])
            {
                temp = message[j];
                message[j] = message[i];
                message[i] = temp;
                temp = character[j];
                character[j] = character[i];
                character[i] = temp;
            }
        }
    }

    for(i=0; i<25; i++)
    {
        for(j=i+1; j<=25; j++)
        {
            if(character[i] > character[j])
            {
                temp = english[j];
                english[j] = english[i];
                english[i] = temp;
                temp = character[j];
                character[j] = character[i];
                character[i] = temp;
            }
        }
    }

    var subs = document.querySelectorAll(".substitute");
    for(var i=0;i<26;i++)
    {
        subs[i].innerHTML = english[i];
    }
    substitution();
}

function start_substitution()
{
    var subs = document.querySelectorAll(".substitute");
    for(var i=0;i<26;i++)
    {
        subs[i].onclick = function (){show_combo(this);};
    }

    document.getElementById("plaintext").readOnly = true;
    document.getElementById("subs_button").value = "Reset";
    substitute = true;
    analyse_frequency();
}

function end_substitution()
{
    var subs = document.querySelectorAll(".substitute");
    for(var i=0;i<26;i++)
    {
        subs[i].onclick = "";
    }

    document.getElementById("plaintext").readOnly = false;
    document.getElementById("subs_button").value = "Analyse";
    substitute = false;
    reset_order();
    update_frequency();
}

function substitute_switch()
{
    if(substitute) { end_substitution(); } else	{ start_substitution();	}
}
