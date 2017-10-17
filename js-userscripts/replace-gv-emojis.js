// ==UserScript==
// @name         Google Voice Emojis to Codepoints
// @version      0.1
// @description  Replaces all the .png emoji images in Google Voice txt threads with their
//               Unicode codepoint equivalent so I can see the new emojis since I have the
//               latest Android emoji font installed on my laptop.
// @author       me
// @match        https://voice.google.com/*
// ==/UserScript==

function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function() {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}

function replaceEmojis() {
    window.setTimeout(function () {
        emojiImgs = document.querySelectorAll('img[class^="PQ"]');
        for(var i = 0, len = emojiImgs.length; i < len; i++) {
            codePoint = emojiImgs[i].getAttribute('alt').codePointAt(0);
            elemClass = emojiImgs[i].getAttribute('class');
            newEmoji = document.createElement('div');
            newEmoji.setAttribute('class', elemClass);
            styleString = "display:inline-block;";
            if (elemClass.endsWith('hJDwNd')) {
                styleString += "font-size:4rem;margin-top:1.5rem;margin-bottom:-.75rem;";
            } else {
                styleString += "font-size:2rem;";
            }
            newEmoji.setAttribute("style", styleString);
            newEmoji.innerHTML = "&#" + codePoint + ";";
            emojiImgs[i].parentNode.replaceChild(newEmoji, emojiImgs[i]);
        }
    }, 2000);
    // console.log("Replaced emojis!");
}

function addScrollListenerThenReplace() {
    var throttledReplaceEmojis = throttle(replaceEmojis, 1000); // run at most once per second when scrolling
    document.querySelector('gv-infinite-scroll').children[0].addEventListener('scroll', throttledReplaceEmojis);
    replaceEmojis();
}

(function() {
    window.setTimeout(addScrollListenerThenReplace, 5000);
    document.querySelector('gv-conversation-list').addEventListener('click', addScrollListenerThenReplace);
})();
