

module.exports = (req,res) => {
    res.render(__dirname+'/embed',{id:req.params.id})
}