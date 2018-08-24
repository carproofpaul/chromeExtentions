window.addEventListener("load", function load(event){
    setTimeout(() => getData(), 1000)
}, false);

async function getData(){
    //console.log(document.body.outerHTML)

    const vin = await getVin().catch(e => console.log(e))
    const odometer = getOdometer()
    const value = await getTrueValue(vin, odometer).catch(e => console.log(e))
    const tag = getKilometerTag()

    console.log('vin: ' + vin)
    console.log('odometer: ' + odometer)
    console.log('true value: ' + value)
    console.log('stock number: ' + tag)

    inject('Kilometres', 'True Value™')
    if(value !== undefined) inject(tag, '$'+formatNumber(value.toFixed(0)))
    else inject(tag, 'n\\a')
    
}

const formatNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function inject(old, replaced){
    var elements = document.getElementsByTagName('*');

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
    
        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];
    
            if (node.nodeType === 3) {
                let text = node.nodeValue;
                var replacedText = text.replace(old, replaced);
    
                if (replacedText !== text) {
                    var br = document.createElement("br");
                    element.appendChild(br);
                    element.appendChild(document.createTextNode(replacedText), node);
                    return
                }
            }
        }
    }
}

function getVin(){
    try {
        return new Promise((resolve, reject) => {
            const text = document.body.outerHTML
            

            const links = text.match(/href="https:\/\/reports.carproof.com\/main(.*?)"/g)
            if(links !== null){
                let link = links[0].replace('href=', '').replace(/['"]+/g, '')
                fetch(link)
                    .then(response => response.text())
                    .then((text) =>{
                        vin = text.match(/<div id="actualVin">(.*?)<\/div>/g)[0].match(/[a-zA-Z0-9]{9}[a-zA-Z0-9-]{3}[0-9]{5}/g)[0]
                        console.log('vin => ' + vin)
                        resolve(vin)
                        return
                    })
                    .catch(e => reject(e.message))
            }

            const arr = text.split(/\s+/)
            let link = null;
            for(i = 0; i < arr.length; i++){
                if(arr[i].substring(0, 29) === '"https://reports.carproof.com'){
                    link = arr[i].replace(/['"]+/g, '').replace(';', '')
                    console.log('carproof link: ' + link)
                    let vin;
                    fetch(link)
                        .then(response => response.text())
                        .then((text) =>{
                            vin = text.match(/<div id="actualVin">(.*?)<\/div>/g)[0].match(/[a-zA-Z0-9]{9}[a-zA-Z0-9-]{3}[0-9]{5}/g)[0]
                            console.log('vin => ' + vin)
                            resolve(vin)
                        })
                        .catch(e => reject(e.message))
                    break
    
                } else if(arr[i].includes('vin=')){
                    resolve((arr[i].match(/[a-zA-Z0-9]{9}[a-zA-Z0-9-]{3}[0-9]{5}/g)[0]))
                    return
                }
            }
            if(link == null) console.log('NO VIN OR LINK')
        })
    } catch(e){
        reject(e.message)
    }
}

function getKilometerTag(){
    try {
        const text = document.body.innerText
        const arr = text.split(/\s+/)
        let link;
        for(i = 0; i < arr.length; i++){
            if(arr[i] === 'Kilometres'){
               return arr[i+1] + ' ' +  arr[i+2];
            }
        }
    } catch(e){
        console.log(e.message)
    }
}

function getOdometer(){
    try {
        const text = document.body.innerText
        const arr = text.split(/\s+/)
        let link;
        for(i = 0; i < arr.length; i++){
            if(arr[i] === 'Kilometres'){
               return arr[i+1].replace(/\,/g,'');
            }
        }
    } catch(e){
        console.log(e.message)
    }
}

function getTrueValue(vin, odo){
    return new Promise((resolve, reject) => {
        const x = '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'

        var xmlhttp = new XMLHttpRequest();    
        xmlhttp.open("GET", 'https://devapivaluationwebservice.carproof.com/MlValuation/Retail?request.vin=' + vin + 
        '&request.odometer=' + odo + '&request.fsa=n1g', true);

        xmlhttp.setRequestHeader("webServiceToken", x);
        xmlhttp.send();
    
        xmlhttp.onreadystatechange = (function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                json = JSON.parse(xmlhttp.responseText)
                resolve(json.Prediction.Prediction)
            } else if(xmlhttp.readyState === 4 && xmlhttp.status !== 200){
                reject(xmlhttp.status)
            }
        }).bind(this)
    })
}
