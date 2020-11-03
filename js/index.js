document.getElementById("loan-btn").addEventListener("click", loan)
document.getElementById("bank-btn").addEventListener("click", bank)
document.getElementById("work-btn").addEventListener("click", work)
document.getElementById("buy-btn").addEventListener("click", buy)
const balanceField = document.getElementById("balance")
const nameField = document.getElementById("name")
const earningField = document.getElementById("earnings")
const laptopDropdown = document.getElementById("laptops-dropdown")

let balance
let name
let earnings = 0
let loanAmnt = 0
let price
let boughtLaptops

function getInfo() {
    fetch("./resources/data.json")
        .then(response=>response.json())
        .then(data=> {
            balance = data.people[0].balance
            name = data.people[0].name

            nameField.innerHTML = name
            balanceField.innerHTML = balance
            earningField.innerHTML = earnings

            data.laptops.forEach(laptop => {
                laptopDropdown.innerHTML += `
                <option value="${laptop.id}">${laptop.name}</option>
                `
            });
        })
}

function getLaptopInfo(laptop) {
    document.getElementById("features").innerHTML = ""
    document.getElementById("buy-btn").textContent = "BUY NOW"
    document.getElementById("buy-btn").disabled = false
    if (laptop != "undefined") {
        document.getElementById("laptop-info").style.display = "grid"
        fetch("./resources/data.json")
        .then(response=>response.json())
        .then(data=> {
            price = data.laptops[laptop].price

            document.getElementById("title").innerHTML = data.laptops[laptop].name
            document.getElementById("content").innerHTML = data.laptops[laptop].information
            document.getElementById("price-tag").innerHTML = price+" kr"
            document.getElementById("feature-title").style.display = "block"
            data.laptops[laptop].features.forEach(feature => {
                document.getElementById("features").innerHTML += `
                <p class="feature-row">${feature}</p>
            `
            })
        })
    } else {
        document.getElementById("feature-title").style.display = "none"
        document.getElementById("laptop-info").style.display = "none"
    }
}

function loan() {
    if (loanAmnt > 0) {
        alert("You have already loaned money, work for more money and then buy a laptop")
    } else { 
        let loanAns = prompt("How much money do you want to loan?", "")
        if (loanAns > balance*2 || loanAns === null) {
            alert("This amount cant be accepted, \n MIN: 1 \n MAX: Double your current balance")
        } else {
            loanAmnt = 1
            balance = parseInt(balance)+parseInt(loanAns) 
            balanceField.innerHTML = balance
        }
    }
}

function bank() {
    balance = parseInt(balance)+parseInt(earnings)
    earnings = 0
    balanceField.innerHTML = balance
    earningField.innerHTML = earnings
}

function work() {
    earnings = parseInt(earnings)+parseInt(100)
    earningField.innerHTML = earnings
}

function buy() {
    console.log();
    if (balance >= price) {
       document.getElementById("buy-btn").textContent = "BOUGHT"
       document.getElementById("buy-btn").disabled = true
       balance = parseInt(balance)-parseInt(price)
       balanceField.innerHTML = balance
       alert("Congrats! You just bought a new laptop!")
    } else {
        alert("You do not have enough money to buy this. \n Take a loan or work for some money")
    }
}

