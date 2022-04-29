// Page server, API, sert à faire le lien entre le front et le back : les requêtes sql et configurations de connexion sont ici

// import des librairies
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const saltRounds = 10;



// Paramétrages server
app.use(express.json());
app.use(cors({
        origin: ["http://localhost:3000"],
        methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"],
        credentials: true,
    }
));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

//session
app.use(
    session({
        key: "userId",
        secret: "horse",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24 * 10,
        },
    })
);

// Connexion à mysql
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password:"root",
    database:"ppe1-tactiv",
});



// -----------------------------------------------------CRUD-----------------------------------------------------------

// -------------------------------------------------CREATE / POST------------------------------------------------------

app.post("/TACTIV/register", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    db.query("SELECT * FROM user WHERE email = ?",
        email,
        (err, result1) => {
            if (err) {
                res.send({ message: "sql erreur" });
            }if(result1.length != 0) {
                console.log("doublon");
                res.send({ message: "Utilisateur déjà enregistré" });
            }else{
                console.log("pas de doublon");
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        console.log(err);
                    }
                    db.query(
                        "INSERT INTO user (name, email, password, role) VALUES (?,?,?,?)",
                        [name, email, hash, role],
                        (err, result2) => {
                            if (err) {
                                console.log(err);
                            }else{
                                console.log(result2);
                                res.send({message : "L'utilisateur " + email + " est enregistré"});
                            }
                        }
                    );
                });
            }});
});


app.post("/TACTIV/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query(
        "SELECT * FROM user WHERE email = ?",
        email,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        req.session.user= result;
                        console.log(req.session.user);
                        res.send(result);

                    } if (err) {
                        res.send({ message: "Mauvaise combinaison email/mot de passe" });
                    }
                });
            } else {
                res.send({ message: "Adresse mail incorrect" });
            }
        }
    );
});


app.post("/TACTIV/measure-add", (req, res) => {
    const measure = req.body.addSteps;
    const id_user = req.session.user[0].id;

    db.query("INSERT INTO measure (distance, id_user) VALUES (?,?) ", [measure, id_user],
        (err) => {
            if (err) {
                console.log(err);
            }else
                res.send({message : "Enregitré"});
        });
});
app.post("/TACTIV/goal-add", (req, res) => {
    const goal = req.body.addGoal;
    const id_user = req.session.user[0].id;

    db.query("INSERT INTO goal (count, id_user) VALUES (?,?) ", [goal, id_user],
        (err) => {
            if (err) {
                console.log(err);
            }else
                res.send({message : "Enregitré"});
        });
});
// ---------------------------------------------------READ / GET-------------------------------------------------------
app.get("/", (req, res) => {
    res.send('Server started')
});

app.get("/TACTIV/login", (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send({ loggedIn: false });
    }
});

app.get('/TACTIV/logout',(req,res) => {
    req.session.destroy();
    res.clearCookie("userId");
    res.send({ loggedIn: false });
    console.log("logout");
});

app.get("/TACTIV/goal-user", (req, res) => {
    const id_user = req.session.user[0].id;
    db.query("SELECT * FROM goal WHERE DATE(date) = CURDATE() AND id_user = ? ORDER BY date DESC LIMIT 1",[id_user],
        (err, result) => {
            if (err){
                console.log(err);
            }else {
                res.send(result);
            }
        })
});

app.get("/TACTIV/stepcount-user", (req, res) => {
    const id_user = req.session.user[0].id;
    db.query("SELECT SUM(distance) AS 'count' FROM measure WHERE DATE(date) = CURDATE() AND id_user = ?",[id_user],
        (err, result) => {
            if (err){
                console.log(err);
            }else {
                res.send(result);
            }
        })
});

app.get("/TACTIV/hostoric-goal-user", (req, res) => {
    const id_user = req.session.user[0].id;
    db.query("SELECT *  FROM goal WHERE id_user = ? ORDER BY date DESC",[id_user],
        (err, result) => {
            if (err){
                console.log(err);
            }else {
                res.send(result);
            }
        })
});

app.get("/TACTIV/hostoric-measure-user", (req, res) => {
    const id_user = req.session.user[0].id;
    db.query("SELECT DATE(date) as 'date', SUM(distance) AS 'count' FROM measure WHERE id_user = ? GROUP BY DATE(date) ORDER BY DATE(date) DESC",[id_user],
        (err, result) => {
            if (err){
                console.log(err);
            }else {
                res.send(result);
            }
        })
});


// ---------------------------------------------------UPDATE / PUT-----------------------------------------------------

app.put("/TACTIV/goal-validation", (req, res) => {
    const id_user = req.session.user[0].id;
    db.query("UPDATE goal SET validation = 1 WHERE DATE(date) = CURDATE() AND id_user = ? ORDER BY date DESC LIMIT 1 ", id_user,
        (err, result) => {
            if (err) {
                console.log(err);
            }else
                console.log(result);
        });
});


// --------------------------------------------------DELETE / DELETE---------------------------------------------------


//END CRUD


//PORT SERVER API
app.listen(3001, () => {
    console.log("server on port 3001");
});