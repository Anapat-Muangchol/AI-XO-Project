const express = require('express')
const con = require('../db.js');
const bodyParser = require('body-parser')
var cors = require('cors')
const router = express.Router()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(cors())
const apiName = 'pathToWin'

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('-----------------------------')
    console.log('Time: ' + Date.now())
    next()
})

// ===== define the method. =====
// HTTP : GET Method.
router.get('/:path', (req, res) => {
    const path = req.params.path
    console.log(`Request HTTP GET /${apiName}/${path}`)

    let results = {
        result : true,
        data : []
    }

    getPathToWin(path, null).then(rows => {
        results.data = rows
        res.json(results)
    }).catch(err => {
        console.log(`Error query /${apiName}/${path} :  ${err}`)
        results.result = false
        results.massage = err.sqlMessage
        res.json(results)
    })

})

router.get('/:path/:player', (req, res) => {
    const path = req.params.path
    const player = req.params.player
    console.log(`Request HTTP GET /${apiName}/${path}/${player}`)

    let results = {
        result : true,
        data : []
    }

    getPathToWin(path, player).then(rows => {
        results.data = rows
        res.json(results)
    }).catch(err => {
        console.log(`Error query /${apiName}/${path}/${player} :  ${err}`)
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

    const pathToWin = req.body.pathToWin
    const playerWin = req.body.playerWin
    // console.log(pathToWin)
    // console.log(playerWin)

    getPathByPathToWin(pathToWin, playerWin).then(rows => {
        // console.log(rows.length);
        if (rows.length > 0) {
            // มีอยู่แล้ว
            console.log(rows[0])
            results.data = rows[0]
            res.json(results)
        } else {
            // ยังไม่มี
            const newPathToWin = '|0|' + pathToWin;
            console.log(newPathToWin)
            insertPathToWin(newPathToWin, playerWin).then(pathId => {
                if (pathId) {
                    results.data = {
                        "PATH_ID": pathId,
                        "PATH": newPathToWin,
                        "PLAYER_WIN": playerWin
                    }
                    res.json(results)
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
function getPathByPathToWin(path, playerWin) {
    return new Promise((resolve,reject) => {
        try {
            const sql = 'SELECT * FROM PLAY_TO_WIN_PATH ' 
                + ' WHERE PATH LIKE ? AND PLAYER_WIN = ?'
            con.query(sql, ['%'+path+'%', playerWin], (error, row) => {
                if (error) throw error
                
                console.log('Query successfully.')
                resolve(row)
            })
        } catch (error) {
            console.log(`Error getPathByPathToWin( ${path}, ${playerWin} ) :  ${error}`)
            reject(error)
        }
    });
}

function getPathToWin(path, player) {
    return new Promise((resolve,reject) => {
        try {
            let sql = 'SELECT * FROM PLAY_TO_WIN_PATH ' 
                + ' WHERE PATH LIKE ? '
            if (player) sql += ' AND PLAYER_WIN = ?'

            let condition = ['%|'+path+'|%']
            if (player) condition.push(player)

            con.query(sql, condition, (error, row) => {
                if (error) throw error
                
                console.log('Query successfully.')
                resolve(row)
            })
        } catch (error) {
            console.log(`Error getPathToWin( ${path}, ${player} ) :  ${error}`)
            reject(error)
        }
    });
}

function insertPathToWin(pathToWin, playerWin) {
    return new Promise((resolve,reject) => {
        try {
            const sql = 'INSERT INTO PLAY_TO_WIN_PATH (PATH, PLAYER_WIN) '
                + ' VALUES (?, ?)'
            console.log('sql : ' + sql)
            console.log('path : ' + pathToWin)
            console.log('playerWin : ' + playerWin)

            con.query(sql, [
                pathToWin,
                playerWin
            ], function (err, result) {
                if (err) throw err
                
                console.log('Insert successfully, ID: ' + result.insertId)
                resolve(result.insertId)
            })
        } catch (error) {
            console.log(`Error insertPattern( ${pathToWin}, ${playerWin} ) :  ${error}`)
            reject(error)
        }
    });
}


// SELECT * FROM PLAY_TO_WIN_PATH
// WHERE PATH LIKE '0|%' AND PLAYER_WIN = '2'

module.exports = router