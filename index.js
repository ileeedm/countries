import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;
const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"world",
  password:"159357",
  port: 5432,
});

db.connect()

var visitedCountries = []




app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.query("SELECT country_code FROM visited_countries",(err, res)=>{
  if(err){
    console.error("Error executing query", err.stack);
  } else {
    visitedCountries = res.rows
   
    app.get("/", async (req, response) => {
 

      let total = visitedCountries.length
      let countryCodes = visitedCountries.map(country => country.country_code);
    
     
      response.render("index.ejs",{countries:countryCodes,total});
     
    
    });
  }

 
})
      app.post("/add", async (req, response) => {
        let addedCountry = req.body.country
       
        
        db.query("SELECT country_code FROM countries WHERE country_name=($1)",[addedCountry],(err, resp)=>{
          visitedCountries = resp.rows
          let countryCodes = visitedCountries.map(country => country.country_code);
        
        
             db.query("INSERT INTO visited_countries(country_code) VALUES ($1)",[countryCodes[0]],(err, res)=>{ 

              if(err){
                console.error("Error executing query now", err.stack);
                let error = "Country already exists"
                visitedCountries = resp.rows
                let total = visitedCountries.length
                let countryCodes = visitedCountries.map(country => country.country_code);
                console.log(countryCodes)
               
                response.render("index.ejs",{countries:countryCodes,total},{error:error});
              } else {
                
                db.query("SELECT country_code FROM visited_countries",(err,res)=>{
                  if(err){
                    console.log("Error executing query country already exists")
                    
                  } else {
                    visitedCountries = res.rows
                    let total = visitedCountries.length
                    console.log(total)
                    let countryCodes = visitedCountries.map(country => country.country_code);
                   
                    response.render("index.ejs",{countries:countryCodes,total});
                  }

                });
               
              
                } 

              });
       
         })
    
    })
  


 
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  
});


