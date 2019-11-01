const express = require('express')
const con = require('../db.js');
const bodyParser = require('body-parser')
var cors = require('cors')
const router = express.Router()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(cors())
const apiName = 'pattern'

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('-----------------------------')
    console.log('Time: ' + Date.now())
    next()
})

// ===== define the method. =====
// HTTP : GET Method.
router.get('/', function (req, res) {
    console.log('Request HTTP GET : /' + apiName)

    let results = {
        result : true,
        data : []
    }

    const sql = 'SELECT * FROM BOARD_PATTERN'
    con.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(`Error query ${apiName} : ${err}`)
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

// router.get('/:patternId', (req, res) => {
//     var patternId = req.params.patternId
//     console.log(`Request HTTP GET /${apiName}/${patternId}`)

//     let results = {
//         result : true,
//         data : []
//     }

//     getPatternByKey(patternId).then(rows => {
//         if (rows) {
//             console.log(rows[0])
//             results.data = rows[0]
//         } else {
//             results.massage = 'Not found!'
//             console.log('Not found!')
//         }
//         res.json(results)
//     }).catch(err => {
//         console.log(`Error query ${apiName}/${patternId} :  ${err}`)
//         results.result = false
//         results.massage = err.sqlMessage
//         res.json(results)
//     })

// })

router.get('/:pattern', (req, res) => {
    var pattern = req.params.pattern
    console.log(`Request HTTP GET /${apiName}/${pattern}`)

    let results = {
        result : true,
        data : []
    }

    getPatternByBoardPattern(pattern).then(rows => {
        if (rows) {
            console.log(rows[0])
            results.data = rows[0]
        } else {
            results.massage = 'Not found!'
            console.log('Not found!')
        }
        res.json(results)
    }).catch(err => {
        console.log(`Error query ${apiName}/${pattern} :  ${err}`)
        results.result = false
        results.massage = err.sqlMessage
        res.json(results)
    })

})

// HTTP : POST Method.
router.post('/', (req, res) => {
    console.log(`Request HTTP POST /${apiName}`)

    let results = {
        result : true
    }

    const pattern = req.body.pattern
    console.log(pattern)

    getPatternByBoardPattern(pattern).then(rows => {
        // console.log(rows.length);
        if (rows.length > 0) {
            // มีอยู่แล้ว
            console.log(rows[0])
            results.data = rows[0]
            res.json(results)
        } else {
            // insertPattern
            insertPattern(pattern).then(patternId => {
                if (patternId) {
                    results.data = {
                        "BOARD_PATTERN_ID": patternId,
                        "PATTERN": pattern
                    }
                    res.json(results)
                } else {
                    
                }
            }).catch(err => {
                console.log(`Error insertPattern ${apiName} :  ${err}`)
                results.result = false
                results.massage = err.sqlMessage
                res.json(results)
            })
        }
    }).catch(err => {
        console.log(`Error query ${apiName} :  ${err}`)
        results.result = false
        results.massage = err.sqlMessage
        res.json(results)
    })
})


// ----- Function ----- 
function getPatternByKey(patternId) {
    return new Promise((resolve,reject) => {
        try {
            const sql = 'SELECT * FROM BOARD_PATTERN ' 
                + ' WHERE BOARD_PATTERN_ID = ?'
            con.query(sql, patternId, (error, row) => {
                if (error) throw error
                
                console.log('Query successfully.')
                resolve(row)
            })
        } catch (error) {
            console.log(`Error getPatternByKey( ${patternId} ) :  ${error}`)
            reject(error)
        }
    });
}

function getPatternByBoardPattern(pattern) {
    return new Promise((resolve,reject) => {
        try {
            const sql = 'SELECT * FROM BOARD_PATTERN ' 
                + ' WHERE PATTERN = ?'
            con.query(sql, pattern, (error, row) => {
                if (error) throw error
                
                console.log('Query successfully.')
                resolve(row)
            })
        } catch (error) {
            console.log(`Error getPatternByBoardPattern( ${pattern} ) :  ${error}`)
            reject(error)
        }
    });
}

function getPathByPathToWin(path, playerWin) {
    return new Promise((resolve,reject) => {
        try {
            const sql = 'SELECT * FROM BOARD_PATTERN ' 
                + ' WHERE PATTERN = ?'
            con.query(sql, pattern, (error, row) => {
                if (error) throw error
                
                console.log('Query successfully.')
                resolve(row)
            })
        } catch (error) {
            console.log(`Error getPatternByBoardPattern( ${pattern} ) :  ${error}`)
            reject(error)
        }
    });
}

function insertPattern(pattern) {
    return new Promise((resolve,reject) => {
        try {
            const sql = 'INSERT INTO BOARD_PATTERN (PATTERN) '
                + ' VALUES (?)'
            console.log('sql : ' + sql)
            console.log('pattern : ' + pattern)

            con.query(sql, [
                pattern
            ], function (err, result) {
                if (err) throw err
                
                console.log('Insert successfully, ID: ' + result.insertId)
                resolve(result.insertId)
            })
        } catch (error) {
            console.log(`Error insertPattern( ${pattern} ) :  ${error}`)
            reject(error)
        }
    });

    
}

module.exports = router