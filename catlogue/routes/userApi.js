
const express = require('express')
const router = express.Router();
const lodash=require('lodash');
const userSchema = require('../models/userSchema')
const axios = require('axios');

// Définir le token d'accès (obtenu en créant une application sur le portail des développeurs de Facebook)
const accessToken = 'EAAPZA4N2HUuoBO43vkrGqzs5zkGgUgZCDZCAJ0ZCQhlwBEUoLpOi3WNz9a13GKM7Je674xJrm56u0kexNjfpqls3SujkbJzs14TKyDR5ZA9LCOg1U2ZCmfXeqx9vJRFEiK2yN98XiMUsvIyk6shOfUCzN9upkdOMimzEkM4MNDoO5zEubTySOFG4fSl3PLMtO3NWlwqMSe3GK6Y1JASbXwWUqE4Yv7GXsQlewGjZCZBSdhUZD';

// Intérêt que vous ciblez (investissements immobiliers)
const interest = 'real estate';
const dataUser=[]
// Endpoint de l'API Graph pour rechercher des pages liées à l'immobilier
const pagesEndpoint = `https://graph.facebook.com/v12.0/search?type=page&q=${interest}&access_token=${accessToken}`;

// Effectuer une requête GET à l'API Graph pour récupérer les pages liées à l'immobilier


  function convertDateToDDMMYY() {
    var currentDate = new Date();
    // Créer un objet Date à partir de la chaîne de date fournie
    var day = currentDate.getUTCDate();
    var month = currentDate.getUTCMonth() + 1; // Les mois commencent à 0, donc on ajoute 1
    var year = currentDate.getUTCFullYear() ; // Obtenir les deux derniers chiffres de l'année

    // Ajouter un zéro devant le jour et le mois si nécessaire
    if (day < 10) {
       var  d = '0' + day;
    }
    if (month < 10) {
      var   m = '0' + month;
    }
if (day >= 10) {
       var  d = '' + day;
    }
    if (month >= 10) {
      var   m = '' + month;
    }

    // Retourner la date au format "dd-mm-yy"
    return  d + '-' + m + '-' + year;
}
      function processUser(user) {
    // Parcours de toutes les clés de l'objet
    for (var key in user) {
        // Vérification si la valeur de la propriété est undefined
        if (user.hasOwnProperty(key) && user[key] === undefined) {
            // Attribuer une valeur de chaîne vide '' à la propriété undefined
            user[key] = '';
        }
    }
    return user; // Retourner l'objet user traité
}

////

async function  del(){
     console.log("del1")
     await userSchema.deleteMany()
      console.log("del2")
}
// // //
del()
router.get('/all', async (req, res) => {
     
    var user = await userSchema.find().populate('tableMeet');
      const jsonArray = user.map(doc => doc.toJSON());
     var arr = jsonArray.sort((a, b) => b.dateNumber - a.dateNumber);
   console.log(arr[0],'sort')
     res.send(arr);
//aaaa
 });
router.get('/dataUs', async (req, res) => {
     
    axios.get(pagesEndpoint)
  .then(response => {
    // Récupérer les IDs des pages
    const pageIds = response.data.data.map(page => page.id);
    // Pour chaque page, récupérer les utilisateurs qui ont aimé, suivi ou interagi avec cette page
    pageIds.forEach(pageId => {
      const usersEndpoint = `https://graph.facebook.com/v12.0/${pageId}/likes?access_token=${accessToken}`;
      axios.get(usersEndpoint)
        .then(usersResponse => {
          // Traiter les données des utilisateurs (par exemple, stocker dans une base de données)
        
          res.send(usersResponse.data)
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des utilisateurs:', error);
        });
    });
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des pages:', error);
  });
//aaaa
 });
router.get('/all/today', async (req, res) => {
     
    var user = await userSchema.find({dateUpdate:convertDateToDDMMYY()}).sort({ dateNumber: 1 }).populate('tableMeet');
      const jsonArray = user.map(doc => doc.toJSON());
    
     res.send(jsonArray);
//aaaa
 });
router.get('/all/today/messages', async (req, res) => {
     
    var user = await userSchema.find({dateUpdate:convertDateToDDMMYY()}).populate('tableMeet');
      const jsonArray = user.map(doc => doc.toJSON());
  var NumberMessages=0
  for (var i = 0; i <jsonArray.length ; i++) {
  NumberMessages=NumberMessages + jsonArray[i].historique.length
}
      
     res.send({message:NumberMessages});
//aaaa
 });
router.get('/all/redy', async (req, res) => {
     
    var user = await userSchema.find({color:"4"}).populate('tableMeet');
      const jsonArray = user.map(doc => doc.toJSON());
      
     res.send(jsonArray.reverse());
//aaaa
 });
router.get('/ledsEmployer/:id', async (req, res) => {
     
    var user = await userSchema.find({employer:req.params.id}).populate('tableMeet');
      const jsonArray = user.map(doc => doc.toJSON());
     res.send(jsonArray.reverse());
//aaaa
 });
 router.get('/:id', async (req, res) => {
  console.log("habib")
var user=  await userSchema.findById(req.params.id).populate('tableMeet')
      
 res.send(user)


})
 router.post('/addUser', async (req, res) => {
   console.log("habibbbbb")
   var user = await userSchema.create(req.body)
    user.DateN=new Date()
   await user.save()
  //  if(req.body.dateMeet){
  //   user.dateRendezVous = req.body.dateMeet;
  //  }
  //  if(req.body.timeMeet){
  //   user.timeRendezVous=req.body.timeMeet
  //  }
  
   
  
     res.send(user);
 });
router.post('/addUser/NewLeadArr', async (req, res) => {
   console.log("habibbbbb")
   let date = new Date();

let timeInMillis = date.getTime();
   var user = await userSchema.create(req.body)
  user.date=convertDateToDDMMYY()
  user.DateN=date
  user.dateUpdate=convertDateToDDMMYY()
  user.dateNumber=timeInMillis
    user.statut="new"
  user.color="3"
    await user.save()
  //  if(req.body.dateMeet){
  //   user.dateRendezVous = req.body.dateMeet;
  //  }
  //  if(req.body.timeMeet){
  //   user.timeRendezVous=req.body.timeMeet
  //  }
  
   
  
     res.send(user);
 });
 router.post('/addXl', async (req, res) => {
      // console.log(req.body.tabExel)
      let date = new Date();

let timeInMillis = date.getTime();

      let tableauAvecAttributAjouté = req.body.tabExel.map(object => {
    var user = {
        name:object.name,
         email:object.email,
         country:object.country,
         phone:object.phone,
         project:object.project,
         isFacebook:false,
         isWebsite:false,
             isOffplan:"",
          realEstateType:"",
         budjet:"",
        dateSale:"",
           color : "3",
          statut:"new",
          DateN:new Date(),
            employer: req.body.employer ,
         dateUpdate:req.body.date,
         date:req.body.date,
          dateNumber:timeInMillis,
    };
          return  processUser(user);
});
  // console.log(tableauAvecAttributAjouté)
  await userSchema.insertMany(tableauAvecAttributAjouté)
    res.send({message:true});
});
 router.put('/:id', async (req, res) => {
   // Créer un objet Date à partir de la chaîne de date fournie
    var currentDate = new Date();

    // Extraire le jour, le mois et l'année de l'objet Date
    var day = currentDate.getUTCDate();
    var month = currentDate.getUTCMonth() + 1; // Les mois commencent à 0, donc on ajoute 1
    var year = currentDate.getUTCFullYear() ; // Obtenir les deux derniers chiffres de l'année

    // Ajouter un zéro devant le jour et le mois si nécessaire
    if (day < 10) {
       var  d = '0' + day;
    }
    if (month < 10) {
      var   m = '0' + month;
    }
if (day >= 10) {
       var  d = '' + day;
    }
    if (month >= 10) {
      var   m = '' + month;
    }

    // Retourner la date au format "dd-mm-yy"
    var dateUpdate= d + '-' + m + '-' + year;
     var  user1 = await userSchema.findByIdAndUpdate(req.params.id)

  var  user = await userSchema.findByIdAndUpdate(req.params.id, req.body, { new: true })
      user.date=user1.date
      user.dateUpdate=dateUpdate
      await user.save()
  res.send({message:true,user:user})
})

router.delete('/:id', async (req, res) => {

 await userSchema.deleteOne({ _id: req.params.id })
 res.send({message:true})

});
  router.get('/del', async (req, res) => {
    try{
         console.log("are")
        await userSchema.deleteMany()
          
            res.send({message:true})
       
        
   
        
    
    }catch(error){
        res.send(error.message)   
    }
    
});
 module.exports = router;
 
