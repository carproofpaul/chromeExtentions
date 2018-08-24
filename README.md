# chromeExtentions

This directory contains three individual chrome extenstions. They all inject the True Value of the vehicle into the page automatically (For Kijiji, this data was instead shown in a popup). It does this by running a content script when a page with a specific url is loaded (e.g. *.kijiji.ca/*). To get the True Value, we need the vin and mileage:

    For Adesa, this was pretty easy. The vin and mileage is visibly embedded in the page. To acquire these fields, I simply got the text of the page, and split it by whitespace. This gave me an array of each 'word' on the page, after that I iterated through the array until I saw "vin" or "odometer", then +1 of the index gave me the value. 

    For Kijiji, the vin was possibly embbedded in two places, in the carproof vhr link or in the html itself. I got this data by making a fetch call to the kijiji link (this wasn't needed, chrome extensions can get the page's html directly, but I didn't know that at this moment). After knowing the pattern, I was able to just use a regex to get the vin. For the odometer reading, it was directly embedded in the page.

    For Autotrader, it uses a mix of both techniques. There's two possible carproof links that we can use. The listings with an already purchased vhr, I took the link, went o the vhr page and scrape the vin from there. The listings that have the 'purchase a carproof' link, the vin was embedded in that. For mileage, I use the same adesa method. There's a particular option where the user needs to enter their email to see the vhr, for these cases, I couldn't scrape the vin.

    To add an extension to your browser:
        Visit chrome://extensions (via omnibox or menu -> Tools -> Extensions).
        Enable Developer mode by ticking the checkbox in the upper-right corner.
        Click on the "Load unpacked extension..." button.
        Select the directory containing your unpacked extension.