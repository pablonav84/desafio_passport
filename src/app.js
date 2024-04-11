import express from 'express';
import {engine} from 'express-handlebars';
import __dirname from './utils.js';
import path from 'path';
import {router as vistasRouter } from "./routes/vistasRouter.js"
import {router as sessionsRouter} from "./routes/sessionsRouter.js"
import {router as cartRouter} from "./routes/cartRouter.js"
import MongoStore from 'connect-mongo';
import session from 'express-session';
import mongoose from 'mongoose';
import { inicializaPassport } from './config/passport.config.js';
import passport from 'passport';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session(
    {
        secret:"CoderCoder123", 
        resave: true, 
        saveUninitialized: true,
        store: MongoStore.create(
            {
                mongoUrl: "mongodb+srv://pablonav84:pablo1810@cluster0.1ym0zxu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
                ttl: 60
            }
        )
    }
))

//Passport
inicializaPassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine("handlebars", engine({
  runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
 },
}))
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use("/", vistasRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/carts", cartRouter)

app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(404).send('error 404 - page not found');
});

const server = app.listen(PORT, () => {
  console.log(`Server escuchando en puerto ${PORT}`);
});

const connect = async () => {
    try {
      await mongoose.connect(
        "mongodb+srv://pablonav84:pablo1810@cluster0.1ym0zxu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        { dbName: "ecommerce"}
      );
      console.log("DB Online");
    } catch (error) {
      console.log("Fallo conexión. Detalle:", error.message);
    }
  };
  connect();