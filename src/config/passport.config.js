import passport from "passport"
import local from "passport-local"
import { creaHash, validaPassword } from "../utils.js"
import { UsuariosManager } from "../dao/models/usuariosManagerMongo.js"
import github from "passport-github2"

const usuariosManager=new UsuariosManager

export const inicializaPassport=()=>{

    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField:"email", 
                passReqToCallback: true
            },
            async function(req, username, password, done){
try {
    let { nombre, email } = req.body;
  if (!nombre || !email) {
    return done(null, false)
  }

  // Validación de correo válido
  if (!await usuariosManager.validarEmail(email)) {
    return done(null, false, {message:"El formato del correo electrónico no es válido"});
  }

  // Validación de contraseña
  if (!await usuariosManager.validarPassword(password)) {
    return done(null, false, {message:"La contraseña debe contener 8 caracteres como minimo, una mayúscula y un caracter especial"})
 }

  // Usuario admin
  let rol = 'usuario';
  if (email === 'adminCoder@coder.com' && password === "adminCod3r123") {
    rol = 'admin';
  }

  let existe = await usuariosManager.getBy({ email });
  if (existe) {
    return done(null, false)
  }

  password = creaHash(password);

  let nuevoUsuario = await usuariosManager.create({ nombre, email, password, rol });
  return done(null, nuevoUsuario)
} catch (error) {
  return done(error)
}
            }
        )
    )

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (username, password, done)=>{
                try {
                    console.log({username})
                    let usuario=await usuariosManager.getBy({email:username})
                    if(!usuario){
                        return done(null, false)
                    }
                    if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                        if (usuario) {
                            usuario.rol = 'admin';
                        }
                    }
                    if(!validaPassword(usuario, password)){
                        return done(null, false)
                    }
                    return done(null, usuario)
                                    
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.serializeUser((usuario, done)=>{
        return done(null, usuario._id)
    })

    passport.deserializeUser(async (id, done)=>{
        let usuario=await usuariosManager.getBy({_id:id})
        return done(null, usuario)
    })
}


export const initPassport=()=>{

passport.use(
    "github",
    new github.Strategy(
        {
            clientID:"completar",
            clientScret:"completar",
            callBackURL:"http://localhost:8080/api/sessions/callbackGithub"
        },
        async function(accessToken, refreshToken, profile, done){
            try {
            console.log(profile)    
            } catch (error) {
                return done(error)
            }
        }
    )
)
    passport.serializeUser((usuario, done)=>{
        return done(null, usuario._id)
    })

    passport.deserializeUser((usuario, done)=>{
        return done(null, usuario)
    })
}