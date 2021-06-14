'use strict';
const express=require('express');
const cors=require('cors');
const axios=require('axios');
require('dotenv').config();
const mongoose=require('mongoose');
const server=express();
server.use(cors());
server.use(express.json());
const PORT=process.env.PORT;

mongoose.connect('mongodb://localhost:27017/digimons',  
  { useNewUrlParser: true, useUnifiedTopology: true });

const digimonsSchema=new mongoose.Schema({
    img:String,
    name:String,
    level:String,
})
const myDigimonsModel=mongoose.model('digimons',digimonsSchema)

server.get('/Digimons',DigimonsFunction);
server.post('/addToFav',addToFavoriteFunction);
server.get('/getFavoriteDigimons',getFavoriteFunction);
server.delete('/deleteDigimon/:id',deleteFunction);
server.put('/updateDigimon/:id',updateFunction);

function DigimonsFunction(req,res){
    const url=`https://digimon-api.vercel.app/api/digimon`;
    axios.get(url).then(result=>{
        const digimonArray=result.data.map(digimon=>{
            return new Digimon(digimon);
        })
        res.send(digimonArray);
    })

}
function addToFavoriteFunction(req,res){
    const {name,level,img}=req.body;
    const newDigiom= new myDigimonsModel({
        
name:name,
level:level,
        img:img,
    })
    newDigiom.save();
}
function getFavoriteFunction(req,res){
    myDigimonsModel.find({},(error,data)=>{
        res.send(data)
    })

}
function deleteFunction(req,res){
    const id=req.params.id;
    myDigimonsModel.remove({_id:id},(error,datal)=>{
        myDigimonsModel.find({},(error,data)=>{
            res.send(data)
        })
    })

}
function updateFunction(req,res){
    const {newName,newLevel,newImg}=req.body;
    const id=req.params.id;
    myDigimonsModel.findOne({_id:id},(error,data1)=>{
        data1.name=newName;
        data1.level=newLevel;
        data1.img=newImg;
        data1.save().then(()=>{
            myDigimonsModel.find({},(erorr,data)=>{
                res.send(data)
            })
        })


    })
}
class Digimon{
    constructor(data){
        this.img=data.img
        this.name=data.name
        this.level=data.level

    }
}

server.listen(PORT,()=>{
    console.log((`listing to ${PORT}`));
})