const app = require('./app');

require('dotenv').config({path:`${process.cwd()}/.env`});

const PORT=process.env.PORT || 6060;

app.listen(PORT,()=>{
    console.log("server is running on",PORT);
})