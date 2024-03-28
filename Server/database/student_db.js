const pgPool = require('./pg_connection');

const sql = {
    GET_ALL_STUDENTS: 'SELECT fname, lname, username FROM student',
    GET_STUDENT: 'SELECT fname, lname, username FROM student WHERE username=$1',
    ADD_NOTE: 'INSERT INTO note (msg, student_uname) VALUES ($1, $2)'
}


async function getStudents(){
    let result = await pgPool.query(sql.GET_ALL_STUDENTS);
    return result.rows;
}

async function getStudent(username){
    let result = await pgPool.query(sql.GET_STUDENT, [username]);
    return result.rows[0];
}

async function addNote(username, msg){
    try{
        await pgPool.query(sql.ADD_NOTE, [msg, username]);
    }catch(err){
        throw new Error("Username not found!")
    }
}

module.exports = {getStudents, getStudent, addNote};