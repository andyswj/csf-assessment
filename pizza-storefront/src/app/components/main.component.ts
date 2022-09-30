import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from '../models';
import { PizzaService } from '../pizza.service';

const SIZES: string[] = [
  "Personal - 6 inches",
  "Regular - 9 inches",
  "Large - 12 inches",
  "Extra Large - 15 inches"
]

const PizzaToppings: string[] = [
    'chicken', 'seafood', 'beef', 'vegetables',
    'cheese', 'arugula', 'pineapple'
]

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  pizzaSize = SIZES[0]
  form !: FormGroup
  toppings : string[] = []
  order : Order = {
    name: '',
    email: '',
    pizza_size: 0,
    thick_crust: false,
    sauce: '',
    topping: [],
    comments: ''
  }

  constructor(private fb : FormBuilder, private router : Router, private pizzaSvc : PizzaService) {}

  ngOnInit(): void {
    this.form = this.createForm()
  }

  updateSize(size: string) {
    this.pizzaSize = SIZES[parseInt(size)]
  }

  createForm() : FormGroup {

    return this.fb.group({
      name : this.fb.control<string>("", [Validators.required]),
      email : this.fb.control<string>("", [Validators.required, Validators.email]),
      pizza_size : this.fb.control<number>(0, [Validators.required]),
      base : this.fb.control<string>("", [Validators.required]),
      sauce : this.fb.control<string>("classic", [Validators.required]),
      chicken : this.fb.control<boolean>(false),
      seafood : this.fb.control<boolean>(false),
      beef : this.fb.control<boolean>(false),
      vegetables : this.fb.control<boolean>(false),
      cheese : this.fb.control<boolean>(false),
      arugula : this.fb.control<boolean>(false),
      pineapple : this.fb.control<boolean>(false),
      comments : this.fb.control<string>(""),
    })
  }

  saveOrder() {
    //console.info(">>>>>> saving order")
    //console.info(this.form.value.pineapple)

    PizzaToppings.forEach((topping : string) => {
      //console.info(this.form.value[topping])

      if(this.form.value[topping] == true) {
        this.toppings.push(topping)
      }
    });
    console.info(this.form.value.name)

    this.order.name = this.form.value.name
    this.order.email = this.form.value.email
    this.order.pizza_size = this.form.value.pizza_size
    if(this.form.value.base == "thick") {
      this.order.thick_crust = true
    } else {
      this.order.thick_crust = false
    }
    this.order.sauce = this.form.value.sauce
    this.order.topping = this.toppings
    this.order.comments = this.form.value.comments
    //this.order.topping = this.toppings.toString()

    console.info(">>>>>>my order: ", this.order)

    this.pizzaSvc.createOrder(this.order)
    
    this.form = this.createForm()
    this.router.navigate([ '/orders/' + this.order.email])
  }

  listOrder(email : string) {
    console.info("email: " + email)
  }
}
