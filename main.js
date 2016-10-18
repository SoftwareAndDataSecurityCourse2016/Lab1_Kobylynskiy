function $(id) {
    return document.getElementById(id);    
}

function strip(str) {
    return str.replace(/\s+/g, '');
}


window.onload = function() {
    var cipherTextArea = $('ciphertext_area'),
        crackButton = $('crack_button'),
        crackList = $('crack_list'),
        listTitle = $('list_title');

    crackButton.onclick = function() {
        var i, li, div;
        
        listTitle.style.display = 'block';

        cipherTextArea.value = strip(cipherTextArea.value).toUpperCase();
        crackInfo = Vigenere.crack(cipherTextArea.value, 10);
        for (i = 0; i < crackInfo.length; ++i) {
            li = document.createElement('li');
            li.innerHTML = crackInfo[i][1];
            crackList.appendChild(li);
        }
        console.log(crackInfo.length);
    };
    
    
    
    
};
