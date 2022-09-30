import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PizzaService } from '../pizza.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orderEmail !: string

  constructor(private activatedRouter : ActivatedRoute, private pizzaSvc : PizzaService) { }

  ngOnInit(): void {
    this.orderEmail = this.activatedRouter.snapshot.params['email'];
    this.pizzaSvc.getOrders(this.orderEmail)
      .then(result =>
        result.toString
      )
    .catch((error : HttpErrorResponse) => {
    })
  }

}

