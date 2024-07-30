const mongoose = require('mongoose')

//connect to the database
const connectDB = async () =>{
    try {
        await mongoose.connect('mongodb://localhost:27017/Employee');
        console.log('connected to the database')
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

connectDB();


//define the schema
const employeeSchema = new mongoose.Schema({
    newEmployeeName: {
        type: String,
        required: true
    },
    newEmployeeNumber: {
        type: Number,
        required: true
    }
});

//create a model
const employeeModel = mongoose.model('Employee', employeeSchema);

module.exports = employeeModel;