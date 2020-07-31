module.exports = {
    getError: (errors,prop)=>{
        if(errors){
           try{
            return errors.mapped()[prop].msg;
           }catch(err){
            return '';
           }
        }else{
            return '';
        }
    }
}