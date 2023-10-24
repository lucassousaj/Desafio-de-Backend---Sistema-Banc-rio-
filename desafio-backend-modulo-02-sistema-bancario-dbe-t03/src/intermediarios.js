const validarSenha = (req,res, next) =>{
    const senha =  req.query.senha_banco
    if(!senha){
        return res.status(400).json({mensage:'Senha Obrigatória'})
    }
    if(senha==='Cubos123Bank'){
    next()
    }
    return res.status(403).json({ error: 'Senha Inválida' })    
    
}
module.exports = validarSenha;