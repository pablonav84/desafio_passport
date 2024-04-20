export const auth2=(accesos=[])=>{
    return (req, res, next)=>{
        accesos=accesos.map(a=>a.toLowerCase())

        if(accesos.includes("public")){
            return next()
        }

        if(!req.user || !req.user.rol){
            res.setHeader('Content-Type','application/json');
            return res.status(401).json({error:`No existen usuarios autenticados`})
        }

        if(!accesos.includes(req.user.rol.toLowerCase())){
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`No tiene privilegios suficientes para acceder al recurso`})
        }

        next()
    }
}