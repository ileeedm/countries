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
let total = ''
let visitedCountries = []




app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.query("SELECT country_code FROM visited_countries",(err, res)=>{
  if(err){
    console.error("Error executing query", err.stack);
  } else {
    visitedCountries = res.rows
   
    app.get("/", async (req, res) => {
 

      total = visitedCountries.length
      let countryCodes = visitedCountries.map(country => country.country_code);
      console.log(countryCodes)
     
      res.render("index.ejs",{countries:countryCodes,total});
     
    
    });
  }

 
})

    app.post("/add", async (req, res) => {
      let addedCOuntry = req.body.country
      db.query("INSERT INTO visited_countries(country_code) VALUES ($1)",[addedCOuntry]);
      
      console.log(addedCOuntry)
      db.query("SELECT country_code FROM visited_countries",(err, res)=>{
        if(err){
          console.error("Error executing query", err.stack);
        } else {
          visitedCountries = res.rows}
          total = visitedCountries.length
      let countryCodes = visitedCountries.map(country => country.country_code);
      console.log(countryCodes)
     
      res.render("index.ejs",{countries:countryCodes,total});
        
        })
     
    
     
    
    });
  

 




app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


