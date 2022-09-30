// Add your models here if you have any

export interface Order {
    name : string
    email : string
    pizza_size : number
    thick_crust : boolean
    sauce : string
    topping : string[]
    comments : string
}

export interface orderSummary {
    id : number
    price : number
}