import odm from "../config/mongoose.js";

const personaSchema = new odm.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
  },
  nro_documento: {
    type: String,
    unique: true,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  tipo_documento:{
    id_tipodoc:{
        type: Number,
        required: true,
    },
    nombre:{
        type: String,
        required: true,
    },
  },
  usuario:{
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    rol:{
        type: String,
        required: true,
    },
  },
  fecha_registro: {
    type: Date,
    default: Date.now,
  }
}, {collection:"persona", versionKey:"version"});

personaSchema.virtual('nombre_completo').get(function(){
    return `${this.nombre} ${this.apellido}`;
});

personaSchema.pre('save', function(next){
    console.log("... hook save ...");
    console.log(this.nombre);
    this.nombre=this.nombre.toUpperCase();
    this.apellido=this.apellido.toUpperCase();
    this.usuario.rol=this.usuario.rol.toLowerCase();
    return next();
});

export const Persona = odm.model('persona', personaSchema);

