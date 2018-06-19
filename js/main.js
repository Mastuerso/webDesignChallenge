var woContainer = document.getElementById("welOve");
var userRequest = new XMLHttpRequest();
userRequest.open('GET', 'data.json');
userRequest.onload = function () {
    var userData = JSON.parse(userRequest.responseText);
    buildPage(userData);
};
userRequest.send();

function buildPage(data) {
    var userHeader ="<div class=\"band\">";
    userHeader += "<div class=\"userName\">Welcome " + data.userName + ", thanks for joining.</div>";
    userHeader += "<div class=\"close\">✖</div>";
    userHeader += "</div>";
    var bonuses;
    if (data.bonuses.length > 0) {
        bonuses = "<div class=\"title\">" + data.bonuses.length + " Bonuses for you to use now</div>";
        bonuses += "<div class=\"bonuses\">";        
        for (let index = 0; index < data.bonuses.length; index++) {
            bonuses += `
            <div class=\"bonus\"> 
                <div class=\"description\">${analyzeBonus(data.bonuses[index])}</div>
                <div class=\"${data.bonuses[index].status}\"></div>
                <button class="bonusBtn">play ${data.bonuses[index].game}</button>
            </div>
            `;
        }
        bonuses += "</div>";
    }
    var offers;
    if (data.offers.length > 0) {
        offers = "<div class=\"title\">Also pick 1 of " + availableOff(data.offers) + " Deposit Offers</div>";
        offers += "<div class=\"offers\">";
        for (let index = 0; index < data.offers.length; index++) {
            if (data.offers[index].status == "onhold") {
                offers += `
                <div class=\"offer\">
                <div class=\"description\">${analyzeOffer(data.offers[index])}</div>
                <div class=\"${data.offers[index].status}\"></div>
                <button class="depositBtn">Deposit to claim</button>
                </div>
                `;                
            } else {
                offers += `
                <div class=\"offerL\">
                <div class=\"description\">${analyzeOffer(data.offers[index])}</div>
                <div class=\"${data.offers[index].status}\"></div>
                </div>
                `;
            }
            
        }
        offers += "</div>";
    }
    var renderPage = userHeader + "<div class = \"bg\">" + "<div class = \"vColumn\">" + bonuses + offers + "</div></div>";
    woContainer.insertAdjacentHTML('afterbegin', renderPage);
}

function analyzeBonus(bonus) {
    let bonuString;
    switch (bonus.type) {
        case "currency":
            bonuString = "£" + bonus.ammount + " free " + bonus.game + " bonus to use now";            
        break;
        
        case "spins":
            bonuString = bonus.ammount + " free spins on " + bonus.game + " to use now";
        break;
    
        default:
            break;
    }
    bonuString += analyzeXtra(bonus);
    return bonuString;
}

function availableOff(offers) { 
    let avOffers = 0;
    for (let index = 0; index < offers.length; index++) {
        if (offers[index].status == "onhold") {
            avOffers++;            
        }        
    }
    return avOffers;
}

function analyzeOffer(offer){
    let offerString;
    if (offer.deposit == 1) {
        offerString = ordinal_suffix_of(offer.deposit) + " deposit offer ";        
    } else {
        offerString = ordinal_suffix_of(offer.deposit) + " deposit bonus <br><br>";
    }    
    if (offer.type == "percentage") {
        offerString += offer.ammount + "% ";
    }
    offerString += offer.game + " Bonus";
    offerString += analyzeXtra(offer);
    return offerString;
}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

function analyzeXtra(claim){
    let extraString;
    if (claim.extra.length > 0) {
        for (let index = 0; index < claim.extra.length; index++) {            
            extraString = " +" + claim.extra[index].ammount + " free " + claim.extra[index].type;
        }        
    } else {
        extraString =  "";
    }
    return extraString;    
}