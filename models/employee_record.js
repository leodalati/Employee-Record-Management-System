let mongoose = require('mongoose');

// Create a model
let employeeRecordModel = mongoose.Schema(
    {
    name: String,
    position: String,
    department: String,
    contact_info: String,
    employment_status: String
},
{
    collection: "employee_records"
}
);
module.exports = mongoose.model('employee_record', employeeRecordModel);
