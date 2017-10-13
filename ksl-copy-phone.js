// ==UserScript==
// @name         KSL Copy Phone on Click
// @namespace
// @version      0.1
// @description  Adds JavaScript to copy a seller's phone number on KSL classified ads.
// @author       You
// @match        https://www.ksl.com/classifieds/listing/*
// @grant        none
// ==/UserScript==

// KSL.com is a popular online news and classifieds site in Utah. They recently redesigned
// the classifieds section and did this weird thing where the seller's phone number is nested
// inside of an <a> element that links to href="javascript:void(0)". Because of the way the 
// element is styled (I guess, I don't really understand CSS well enough to say for sure), you
// can't select and copy the text of the seller's phone number. This was annoying me because I
// shop on the classifieds site all the time and use Google Voice to communicate with sellers.
// So I wrote this Tampermonkey script that will add another element to the page when you load
// a KSL.com classified ad which you can simply click and it will copy the seller's phone
// number which you can then paste wherever. I copied most of the code from this excellent
// answer on StackOverflow: https://stackoverflow.com/a/30810322

(function() {

    function copySellerPhone() {
        var textArea = document.createElement("textarea");

        // *** This styling is an extra step which is likely not required. ***
        //
        // Why is it here? To ensure:
        // 1. the element is able to have focus and selection.
        // 2. if element was to flash render it has minimal visual impact.
        // 3. less flakyness with selection and copying which **might** occur if
        //    the textarea element is not visible.
        //
        // The likelihood is the element won't even render, not even a flash,
        // so some of these are just precautions. However in IE the element
        // is visible whilst the popup box asking the user for permission for
        // the web page to copy to the clipboard.
        //

        // Place in top-left corner of screen regardless of scroll position.
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = 0;

        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';

        // Avoid flash of white box if rendered for any reason.
        textArea.style.background = 'transparent';
        var sellerPhone = document.getElementsByClassName('listingContactSeller-homePhone')[0].childNodes[1].innerText;
        console.log("Seller's phone number is " + sellerPhone);
        textArea.value = sellerPhone;
        textArea.innerText = sellerPhone;

        // Add element to the page
        document.body.appendChild(textArea);

        // Select text in textarea element
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copy phone command was ' + msg);
        } catch (err) {
            console.log('Unable to copy seller phone');
        }

        document.body.removeChild(textArea);
    }

    var copySellerPhoneButton = document.createElement('button');
    copySellerPhoneButton.setAttribute('class', 'listingContactSeller-option');
    copySellerPhoneButton.setAttribute('style', 'background: white;');
    copySellerPhoneButton.addEventListener('click', function(event) {
        copySellerPhone();
    });

    var btnIcon = document.createElement('span');
    btnIcon.setAttribute('class', 'icon icon--right-arrow');
    copySellerPhoneButton.appendChild(btnIcon);

    var btnLabel = document.createElement('span');
    btnLabel.setAttribute('class', 'listingContactSeller-optionText');
    btnLabel.innerText = 'Copy Seller Phone #';
    copySellerPhoneButton.appendChild(btnLabel);

    document.getElementsByClassName('listingContactSeller-innerContainer')[0].appendChild(copySellerPhoneButton);
})();
