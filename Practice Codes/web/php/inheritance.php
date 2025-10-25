<?php

class Account{
    private $account_number;
    private $balance;

    public function __construct(string $account_number, int $balance)
    {
        $this->account_number = $account_number;
        $this->balance = $balance;
    }
    public function deposit(int $amount){
        print("Depositing " . $amount);
    }
    public function withdraw(int $amount){
        print("Withdrawing " . $amount);
    }
    public function get_balance(){
        return $this->balance;
    }
}

class CheckingAccount extends Account{
    public function something(){
        print("Something");
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inheritance</title>
</head>
<body>
<?php

$rm = new Account('123456', 50);
$checking = new CheckingAccount('987654', 60);

?>

<p><?php $rm->deposit(500); ?></p>
<p><?php print($rm->get_balance()); ?></p>
<p><?php print_r($checking); ?></p>
</body>
</html>