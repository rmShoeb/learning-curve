<?php

class Basket{
    private int $items_total;
    private int $shipping_cost;

    public function set_items_total(int $items_total){
        $this->items_total = $items_total;
    }
    public function set_shipping_cost(int $shipping_cost){
        $this->shipping_cost = $shipping_cost;
    }
    public function calculate_total(){
        return $this->items_total + $this->shipping_cost;
    }
}

$basket = new Basket();

$basket->set_items_total(50);
$basket->set_shipping_cost(10);

var_dump($basket->calculate_total());

?>