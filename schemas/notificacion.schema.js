import odm from "../config/mongoose.js";

const notificacionSchema = new odm.Schema({
  email: {
    type: String,
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  },

   monto_total: {
   type: Number,
   required: true,
  },

  lectura: {
    type: Boolean,
    default: false,
  },
  fecha_registro: {
    type: Date,
    default: Date.now,
  }
}, {collection:"notificacion", versionKey:"version"});

export const Notificacion = odm.model('notificacion', notificacionSchema);

export const findAll = async function(){
    console.log("------------schema------------");
    const results= await Notificacion.find({});
    console.log(results);
    return results;
}

export const findById = async function(id_notificacion){
    console.log("------------schema------------");
    const results= await Notificacion.find({_id:id_notificacion});
    console.log(results);
    return results;
}

export const findByEmail = async function(email){
    console.log("------------schema------------");
    const results= await Notificacion.find({email:email});
    console.log(results);
    return results;
}

export const create = async function(objNotificacion){
    console.log("------------schema------------");
    const results= await Notificacion.create(objNotificacion);
    console.log(results);
    return results;
}

export const leer = async function(id_notificacion){
    console.log("------------schema------------");
    const results= await Notificacion.findByIdAndUpdate(
        id_notificacion, 
        {
            lectura:true,
        }
    );
    console.log(results);
    return results;
}


