// ==UserScript==
// @name         Raize investment percentages
// @namespace    https://tiagoboldt.net/
// @updateURL    https://github.com/tiagoboldt/tampermonkey-scripts/raize-values.js
// @version      0.1
// @author       Tiago Boldt Sousa
// @match        https://www.raize.pt/*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    window.getReactElement = function(dom) {
    for (var key in dom) {
        if (key.startsWith("__reactInternalInstance$")) {
            return dom[key];
        }
    }
    return null;
}

window.getValues = async function(){
    for(var i =1; i<=20; i++){
        var reactElement = getReactElement(document.getElementsByClassName("clickable")[i])
        reactElement.pendingProps.onClick()
        var myRe = /Tem (.*)%/gm;
        var value = 0;
        var tries = 10;
        while(tries > 0){
            tries--;
            await new Promise(r => setTimeout(r, 500));
            try{
                value = myRe.exec(document.getElementsByClassName("carousel-inner")[0].innerText)[1];
                break;
            } catch(err){
                continue;
            }
        }
        try{
            document.getElementsByClassName("close")[0].click();
            document.getElementsByClassName("clickable")[i].append(value);
        } catch(err) { // if the loan is no longer available, just skip
            document.getElementsByClassName("btn-primary")[0].click();
            document.getElementsByClassName("clickable")[i].append('gone');
        }
    }
}
    document.getElementsByClassName("icon-toggle")[0].insertAdjacentHTML("afterend", "<button id=\"getValues\">get values</button>")
    document.getElementById("getValues").addEventListener("click", getValues);
})();
