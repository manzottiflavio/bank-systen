const express = require("express");
const {v4:uuidv4} = require("uuid");
const app = express();

app.use(express.json());


const customer=[];

app.post("/account",(request,response)=>{
const {cpf, name} = request.body;

const customerAlreadyExists=customer.some(
    (customer)=>customer.cpf === cpf);

    if(customerAlreadyExists){
        return response.status(400).json({Erro:" customer Already Existy"})
    };

customer.push({
    cpf,
    name,
    id:uuidv4(),
    statement: [],
});
return response.status(201).send();


});

app.get("/statement/:cpf", (request,response)=>{
const {cpf} = request.body;

const customer = customer.find((customer)=>customer.cpf === cpf);

return response.status(200).json(customer.statement);

});







app.listen(8888);