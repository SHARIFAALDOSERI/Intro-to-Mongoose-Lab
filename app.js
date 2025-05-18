require('dotenv').config();
const mongoose = require('mongoose');
const prompt = require('prompt-sync')({ sigint: true });
const Customer = require('./customer');


mongoose.connect(process.env.MONGODB_URI, 
{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => 
{
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function mainMenu() 
{
  console.log('\nWelcome to the CRM');

  while (true) 
 {
    console.log
 (`

`);

    const choice = prompt('Number of action to run: ');

    switch (choice) 
    {
      case '1':
        await createCustomer();
        break;
      case '2':
        await viewCustomers();
        break;
      case '3':
        await updateCustomer();
        break;
      case '4':
        await deleteCustomer();
        break;
      case '5':
        console.log('Exiting the application');
        await mongoose.connection.close();
        process.exit(0);
      default:
        console.log('Invalid choice, please enter a number between 1 and 5.');
    }
  }
}

async function createCustomer() 
{
  const name = prompt('Enter customer name: ');
  const age = parseInt(prompt('Enter customer age: '), 10);

  if (!name || isNaN(age)) 
  {
    console.log('Invalid input. Name must be text and age must be a number.');
    return;
  }

  const customer = new Customer({ name, age });
  await customer.save();

  console.log('Customer created successfully.');
}

async function viewCustomers() 
{
  const customers = await Customer.find();

  if (customers.length === 0) 
  {
    console.log('No customers found.');
    return;
  }

  customers.forEach(c => 
  {
    console.log(`id: ${c._id} --  Name: ${c.name}, Age: ${c.age}`);
  });
}

async function updateCustomer() 
{
  const customers = await Customer.find();

  if (customers.length === 0) 
  {
    console.log('No customers to update.');
    return;
  }

  console.log('Below is a list of customers:\n');

  customers.forEach(c => 
  {
    console.log(`id: ${c._id} --  Name: ${c.name}, Age: ${c.age}`);
  });

  const id = prompt('\nCopy and paste the id of the customer you would like to update here: ');
  const customer = await Customer.findById(id.trim());

  if (!customer) 
  {
    console.log('Customer not found.');
    return;
  }

  const newName = prompt('What is the customers new name? ');
  const newAge = parseInt(prompt('What is the customers new age? '), 10);

  if (!newName || isNaN(newAge)) 
  {
    console.log('Invalid input. Name must be text and age must be a number.');
    return;
  }

  customer.name = newName;
  customer.age = newAge;
  await customer.save();

  console.log('Customer updated successfully.');
}

async function deleteCustomer() 
{
  const customers = await Customer.find();

  if (customers.length === 0) 
  {
    console.log('No customers to delete.');
    return;
  }

  console.log('Below is a list of customers:\n');

  customers.forEach(c => 
  {
    console.log(`id: ${c._id} --  Name: ${c.name}, Age: ${c.age}`);
  });

  const id = prompt('\nCopy and paste the id of the customer you would like to delete here: ');
  const result = await Customer.findByIdAndDelete(id.trim());

  if (!result) 
  {
    console.log('Customer not found.');
  } else 
  {
    console.log('Customer deleted successfully.');
  }
}


mainMenu();
