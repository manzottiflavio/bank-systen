const express = require("express");
const {v4:uuidv4} = require("uuid");
const app = express();

app.use(express.json());


const customers=[];

//middleware
function verifyIfExistsAccountCpf(request,response,next){
    const {cpf}= request.headers;
    //const {cpf} = request.params;

const customer = customers.find((customer)=>customer.cpf === cpf);
if(!customer){
    return response.status(400).json({error:"customer not found"});
}
request.customer=customer;

return next();
}

function getBalalce(statement){
const balance= statement.reduce((acc,operation)=>{
    if(operation.type==='credit'){
        return acc+operation.account;
    }else{
        return acc- operation.amount;
    }
},0)
return balance;
}




app.post("/account",(request,response)=>{
const {cpf, name} = request.body;

const customerAlreadyExists=customers.some(
    (customer)=>customer.cpf === cpf);

    if(customerAlreadyExists){
        return response.status(400).json({Erro:" customer Already Existy"})
    };

customers.push({
    cpf,
    name,
    id:uuidv4(),
    statement: [],
});
return response.status(201).send();


});

app.get("/statement",verifyIfExistsAccountCpf, (request,response)=>{
const {customer}=request;

return response.status(200).json(customer.statement);

});

app.post("/deposit",verifyIfExistsAccountCpf,(request,response)=>{
    const {description,amount}=request.body;
const {customer}=request;

const statementOperation={
    description,
    amount,
    created_at:new Date(),
    type:"credit"
}

customer.statement.push(statementOperation);

return response.status(201).json()

})

app.post("/withdraw",verifyIfExistsAccountCpf,(request,response)=>{
const {amount}= request.body;
const {customer}=request;
const balance= getBalalce(customer.statement);

if(balance < amount){
    return response.status(400).json({error:"insufficient funds"})
}

const statementOperation={
    amount,
    created_at: new Date(),
    type:"debit"
};

customer.statement.push(statementOperation);

return response.status(200).json();

})

app.get("/statement/:date",verifyIfExistsAccountCpf, (request,response)=>{
    const {customer}=request;
    const {date}=request.query;

    const dateFormat=new Date(date + "00:00");

    const statement=customer.statement.filter((statement)=>statement.created_at.toDateString()===new Date(dateFormat).toDateString());
    return response.status(200).json(customer.statement);
    
    });

app.put("/account",verifyIfExistsAccountCpf, (request,response)=>{
    const {name} = request.body;
    const {customer}=request;
    customer.name=name;

    return response.status(201).send();
})


app.get("/account",verifyIfExistsAccountCpf, (request,response)=>{
    const {customer}=request;
    return response.status(200).json(customer)
})
       
app.delete("/account",verifyIfExistsAccountCpf, (request,response)=>{
    const {customer}=request;

    customers.splice(customer, 1);

    return response.status(201).json(customer);
})


app.listen(8888);