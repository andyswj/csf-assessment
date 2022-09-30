package vttp2022.assessment.csf.orderbackend.services;

import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;

import vttp2022.assessment.csf.orderbackend.models.Order;
import vttp2022.assessment.csf.orderbackend.models.OrderSummary;

@Service
public class OrderService {
	
	private static final String SQL_POST_ORDER = "insert into orders (name, email, pizza_size, thick_crust, sauce, toppings, comments) values (?, ?, ?, ?, ?, ?, ?)";

	private static final String SQL_GET_ORDER = "select * from orders where email = ?";
	@Autowired
	private PricingService priceSvc;
	
	 @Autowired
	private JdbcTemplate template;

	// POST /api/order
	// Create a new order by inserting into orders table in pizzafactory database
	// IMPORTANT: Do not change the method's signature
	public void createOrder(Order order) {
		int count = template.update(SQL_POST_ORDER,
				order.getName(),
				order.getEmail(),
				order.getSize(),
				order.isThickCrust(),
				order.getSauce(),
				order.getToppings().toString(),
				order.getComments());
		
		System.out.print(count);
	}

	// GET /api/order/<email>/all
	// Get a list of orders for email from orders table in pizzafactory database
	// IMPORTANT: Do not change the method's signature
	
	  public List<OrderSummary> getOrdersByEmail(String email) {
		  
		  List<Order> order = new LinkedList<>();
		  List<OrderSummary> orderSum = new LinkedList<>();
		  
		  SqlRowSet rs = template.queryForRowSet(SQL_GET_ORDER, email);
		  
		  if(rs.next()) {
			  order.add(Order.createOrder(rs));
		  }
		  
		  for(int i = 0; i < order.size(); i++) {
			  float amount = 0;
			  amount = priceSvc.size(order.get(i).getSize()) + priceSvc.sauce(order.get(i).getSauce());
			  
			  if(order.get(i).isThickCrust()) {
				  amount += priceSvc.thickCrust();
			  } else {
				  amount += priceSvc.thinCrust();
			  }
			  
			  for(int j = 0; j < order.get(i).getToppings().size(); i++) {
				  amount += priceSvc.topping(order.get(i).getToppings().get(j));
			  }
			  
			  OrderSummary orderSummary = new OrderSummary();
			  orderSummary.setName(order.get(i).getName());
			  orderSummary.setEmail(order.get(i).getEmail());
			  orderSummary.setOrderId(order.get(i).getOrderId());
			  orderSummary.setAmount(amount);
			  
			  orderSum.add(orderSummary);
		  }
		  
		  return orderSum;
	  }
	 
}
