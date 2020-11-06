const balanceField = document.getElementById("balance")
const laptopField = document.getElementById("laptops-owned")
const nameField = document.getElementById("name")
const earningField = document.getElementById("earnings")
const laptopDropdown = document.getElementById("laptops-dropdown") // add fields to variables for easy access

document.getElementById("loan-btn").addEventListener("click", loan)
document.getElementById("bank-btn").addEventListener("click", bank)
document.getElementById("work-btn").addEventListener("click", work)
document.getElementById("buy-btn").addEventListener("click", buy) // add eventlisteners to elements

laptopDropdown.addEventListener("change", function () {
    getLaptopInfo(this.value)
})

let balance
let laptopsOwned = 0
let earnings = 0
let loanAmnt = 0
let price
let boughtLaptops = [] // declares variables that will be used in multiple functions

function getInfo() {
    fetch("./resources/data.json") // fetch all data from json
        .then(response=>response.json())
        .then(data=> {
            balance = data.people[0].balance

            nameField.innerHTML = data.people[0].name
            balanceField.innerHTML = balance
            earningField.innerHTML = earnings
            laptopField.innerHTML = laptopsOwned

            data.laptops.forEach(laptop => { // for each laptop-object in data, create an option
                laptopDropdown.innerHTML += `
                <option value="${laptop.id}">${laptop.name}</option>
                `
            });
        })
}

function getLaptopInfo(laptop) {
    document.getElementById("features").innerHTML = "" // clear element between every fetch
    
    if (!boughtLaptops.includes(laptop)) { // check if chosen laptop is already bought
        document.getElementById("buy-btn").textContent = "BUY NOW"
        document.getElementById("buy-btn").disabled = false
    } else {
        document.getElementById("buy-btn").textContent = "BOUGHT"
        document.getElementById("buy-btn").disabled = true
    }
    
    if (laptop === "undefined") { // check if value of option is undefined
        document.getElementById("feature-title").style.display = "none"
        document.getElementById("laptop-info").style.display = "none"
    } else {
        document.getElementById("laptop-info").style.display = "grid"
        fetch("./resources/data.json") // fetch all data from json
        .then(response=>response.json())
        .then(data=> {
            price = data.laptops[laptop].price

            document.getElementById("image").innerHTML = `<img src="${data.laptops[laptop].image}" alt="komputer" width="140px" height="140px" style="border-radius: 20px;">`
            document.getElementById("title").innerHTML = data.laptops[laptop].name
            document.getElementById("content").innerHTML = data.laptops[laptop].information
            document.getElementById("price-tag").innerHTML = price+" kr"
            document.getElementById("feature-title").style.display = "block"

            data.laptops[laptop].features.forEach(feature => { // add a row for each feature on laptop
                document.getElementById("features").innerHTML += `
                <p class="feature-row">${feature}</p>
            `
            })
        })
    }
}

function loan() {
    if (loanAmnt > 0) { // check if a loan has already been made and no laptop has been bought since
        alert("You have already loaned money, work for more money and then buy a laptop")
    } else { 
        let loanAns = prompt("How much money do you want to loan?", "")
        if (loanAns > balance*2 || loanAns <= 0 || loanAns === null || isNaN(loanAns)) { // validate input of loan, not too much, not too little, not null, not not a number
            alert("This amount cant be accepted, \n MIN: 1 \n MAX: Double your current balance")
        } else {
            loanAmnt = 1 
            balance = parseInt(balance)+parseInt(loanAns) 
            balanceField.innerHTML = balance
        }
    }
}

function bank() { // adds earned money to bank balance
    balance = parseInt(balance)+parseInt(earnings)
    earnings = 0
    balanceField.innerHTML = balance
    earningField.innerHTML = earnings
}

function work() { // gain 100 kr each click
    earnings = parseInt(earnings)+parseInt(100)
    earningField.innerHTML = earnings
}

function buy() { // if balance is higher or equal to price, deduct set amount from balance and add one laptop to "laptops"
    if (balance >= price) {
       document.getElementById("buy-btn").textContent = "BOUGHT"
       document.getElementById("buy-btn").disabled = true
       balance = parseInt(balance)-parseInt(price)
       balanceField.innerHTML = balance
       boughtLaptops.push(document.getElementById("laptops-dropdown").value)
       laptopsOwned++
       laptopField.innerHTML = laptopsOwned
       loanAmnt = 0
       alert("Congrats! You just bought a new laptop!")
    } else {
        alert("You do not have enough money to buy this. \n Take a loan or work for some money")
    }
}

