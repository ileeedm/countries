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
var error = []
var errorOne = []
var visitedCountries = []

async function checkVisisted(req,response,error,errorOne) {
  console.log(error)
   
    db.query("SELECT country_code FROM visited_countries",(err,res)=>{
    console.log(error)
    visitedCountries = res.rows
    let total = visitedCountries.length
    
    let countryCodes = visitedCountries.map(country => country.country_code);
   
    response.render("index.ejs",{countries:countryCodes,total,error:error,errorOne:errorOne});
    
  });
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, response) => {
checkVisisted(req,response,error,errorOne)

});
  
app.post("/add", async (req, response) => {
  let addedCountry = req.body.country
  
  
  db.query("SELECT country_code FROM countries WHERE country_name ILIKE ($1)",[addedCountry],(err, resp)=>{
    console.log(addedCountry)
    
    if(resp.rows.length <= 0){
    errorOne.push(1)
    checkVisisted(req,response,error,errorOne)
    errorOne = []
      
    }
    else {
      visitedCountries = resp.rows
      let countryCodes = visitedCountries.map(country => country.country_code);
      console.log(countryCodes)
        db.query("INSERT INTO visited_countries(country_code) VALUES ($1) ",[countryCodes[0]],(err, res)=>{ 

        if(err){
          
        error.push(1)
        checkVisisted(req,response,error,errorOne)
        error = []
          
        } else {
          
          response.redirect('/')
          } 

        });
      }
    })
})

app.listen(port, () => {
console.log(`Server running on http://localhost:${port}`);

});


