const express = require('express')
const con = require('../db.js');
const bodyParser = require('body-parser')
const router = express.Router()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
const apiName = 'users'

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('-----------------------------')
    console.log('Time: ' + Date.now())
    next()
})

// ===== define the method. =====
// HTTP : GET Method.
router.get('/', function (req, res) {
    console.log('Request HTTP GET /' + apiName)

    let results = {
        result : true,
        data : []
    }

    const sql = 'SELECT * FROM USERS'
    con.query(sql, (err, rows, fields) => {
        if (err) {
            console.log('Error query users : ' + err)
            results.result = false
            results.massage = err.sqlMessage
            // throw err
        } else {
            console.log('Query successfully.')
            results.data = rows
        }
        res.json(results)
    })
})

router.get('/:userId', (req, res) => {
    console.log(`Request HTTP GET /${apiName}/${req.params.userId}`)

    let results = {
        result : true,
        data : []
    }

    const sql = 'SELECT * FROM USERS ' 
                + ' WHERE USER_NO = ?'
    con.query(sql, req.params.userId, (err, rows) => {
        if (err) {
            console.log('Error query users/' + req.params.userId + ' : ' + err)
            results.result = false
            results.massage = err.sqlMessage
            // throw err
        } else {
            console.log('Query successfully.')
            if (rows[0]) {
                console.log(rows[0])
                results.data = rows[0]
            } else {
                results.massage = 'Not found!'
                console.log('Not found!')
            }
        }
        res.json(results)
    })
})

// router.get('/:userName/:password', (req, res) => {
//     console.log(`Request HTTP GET /${apiName}/${req.params.userName}/${req.params.password}`)

//     let results = {
//         result : false,
//         data : []
//     }

//     const sql = 'SELECT * FROM USERS ' 
//                 + ' WHERE USERNAME = ? AND PASSWORD = ?'
//     console.log('sql : ' + sql)
//     con.query(sql, [req.params.userName, req.params.password], (err, rows, fields) => {
//         if (err) {
//             console.log('Error query users/' + req.params.userName + '/'+ req.params.password +' : ' + err)
//             // throw err
//             results.massage = err.sqlMessage
//         } else {
//             console.log('Query successfully.')
//             if (rows[0]) {
//                 console.log(rows[0])
//                 results.result = true
//                 results.data = rows[0]
//             } else {
//                 results.massage = 'Username or password incorrect!'
//                 console.log('Username or password incorrect!')
//             }
//         }
//         res.json(results)
//     })
// })

// HTTP : POST Method.
router.post('/signin', (req, res) => {
    console.log(`Request HTTP POST /${apiName}/signin`)

    let results = {
        result : false,
        data : []
    }

    const sql = 'SELECT * FROM USERS ' 
                + ' WHERE USERNAME = ? AND PASSWORD = ?'
    console.log('sql : ' + sql)

    const user = req.body
    con.query(sql, [user.username, user.password], (err, rows, fields) => {
        if (err) {
            console.log('Error query users/signin' + user.username + '/'+ user.password +' : ' + err)
            results.massage = err.sqlMessage
            // throw err
        } else {
            console.log('Query successfully.')
            if (rows[0]) {
                console.log(rows[0])
                results.result = true
                results.data = rows[0]
            } else {
                results.massage = 'Username or password incorrect!'
                console.log('Username or password incorrect!')
            }
        }
        res.json(results)
    })
})

router.post('/', (req, res) => {
    console.log(`Request HTTP POST /${apiName}`)
    // console.log(req.body)

    const sql = 'INSERT INTO USERS (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, CREATE_BY, UPDATE_BY) '
                + ' VALUES (?, ?, ?, ?, ?, ?)'
    console.log('sql : ' + sql)

    let results = {
        result : true,
        data : []
    }

    const user = req.body
    // console.log(user)
    con.query(sql, [
            user.username,
            user.password,
            user.firstName,
            user.lastName,
            'Registation Web',
            'Registation Web'
    ], function (err, result) {
        if (err) {
            console.log('Error insert ' + apiName + '/ : ' + err)
            results.result = false
            results.massage = err.sqlMessage
            res.json(results)
            // throw err
        } else {
            console.log('Insert successfully, ID: ' + result.insertId)
            const sql2 = 'SELECT * FROM USERS WHERE USER_NO = ?'
            con.query(sql2, result.insertId, (err, rows, fields) => {
                if (err) throw err
                // console.log(rows[0])
                results.data = rows[0]
                console.log(results)
                res.json(results)
            })
        }
    })
})

// router.post('/many', (req, res) => {
//     console.log(`Request HTTP POST /${apiName}`)
//     // console.log(req.body)

//     const sql = 'INSERT INTO USERS (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, CREATE_BY, UPDATE_BY) '
//                 + ' VALUES (?, ?, ?, ?, ?, ?)'
//     console.log('sql : ' + sql)

//     const users = req.body
//     // console.log(users)
//     users.forEach(function(user) {
//         // console.log(user)
//         con.query(sql, [
//                 user.username,
//                 user.password,
//                 user.firstName,
//                 user.lastName,
//                 'User',
//                 'User'
//         ], function (err, result) {
//             if (err) {
//                 console.log('Error insert ' + apiName + '/ : ' + err)
//                 res.json({result:false, massage:err})
//                 throw err
//             } else {
//                 console.log('Insert successfully, ID: ' + result.insertId)
//                 user.userNo = result.insertId
//                 console.log(user)
//             }
//         })
//     })
//     res.json(users)
// })

// HTTP : PUT Method.
router.put('/', (req, res) => {
    console.log(`Request HTTP PUT /${apiName}`)
    // console.log(req.body)

    const sql = 'UPDATE USERS SET USERNAME = ?, PASSWORD = ?, FIRST_NAME = ?, LAST_NAME = ?, UPDATE_BY = ?, UPDATE_DATE = CURRENT_TIMESTAMP '
                + ' WHERE USER_NO = ?'
    console.log('sql : ' + sql)

    let results = {
        result : true,
        data : []
    }

    const user = req.body
    // console.log(user)
    con.query(sql, [
            user.username,
            user.password,
            user.firstName,
            user.lastName,
            'User',
            user.userNo
    ], function (err, result) {
        if (err) {
            console.log('Error update ' + apiName + '/ : ' + err)
            results.result = false
            results.massage = err.sqlMessage
            res.json(results)
            // throw err
        } else {
            console.log('Update successfully, ID: ' + user.userNo)
            const sql2 = 'SELECT * FROM USERS WHERE USER_NO = ?'
            con.query(sql2, user.userNo, (err, rows, fields) => {
                if (err) throw err
                // console.log(rows[0])
                results.data = rows[0]
                console.log(results)
                res.json(results)
            })
        }
    })
})

// HTTP : DELETE Method.
router.delete('/:userId', (req, res) => {
    console.log(`Request HTTP DELETE /${apiName}/${req.params.userId}`)
    const sql = 'DELETE FROM USERS ' 
                + ' WHERE USER_NO = ?'
    con.query(sql, req.params.userId, (err, rows, fields) => {
        if (err) {
            console.log('Error delete ' + apiName + '/' + req.params.userId + ' : ' + err)
            throw err
        }
        console.log('Delete successfully.')
        res.json({result: true})
    })
})

module.exports = router