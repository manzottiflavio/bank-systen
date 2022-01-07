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





app.listen(8888);