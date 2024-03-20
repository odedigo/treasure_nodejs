/**
 * db.js
 * 
 * This file includes functions to connect to a remote MongoDB (Atlas Data API)
 * Blocked by CORS
 * 
 * Written by: Oded Cnaan
 * Date: March 2024
 */

/**
 * Get access token
 * @param {*} tm 
 * @param {*} ind 
 */
function dbLogin(tm,ind) {
    fetch('https://eu-central-1.aws.services.cloud.mongodb.com/api/client/v2.0/app/data-ffvzc/auth/providers/custom-token/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'Access-Control-Allow-Origin': 'https://odedigo.github.io'
            },
            body: {
                "jwtTokenString": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXRhZGF0YSI6eyJuYW1lIjoib2RlZC5waHlzaWNzQGdtYWlsLmNvbSIsImdyb3VwIjoiVGhpc0lzTXlNYXNoYXIifSwiZXhwIjoxOTEwNzU5MTg5LCJpYXQiOjE3MTA3NTUxMTEsInN1YiI6InVzZXIxIiwiYXVkIjoiZGF0YS1mZnZ6In0.e_aiV9qLqyaQI3jA_5f_6jKvZldGcIQXd_oysEe3Voc"
            }
        }
    )
    .then(resp => {
        console.log(resp.json());
    })
    .catch(err => console.log(err))
}

/**
 * Update team status
 * @param {*} tm 
 * @param {*} ind 
 */
async function updateTeamStatus(tm,ind) {
    let _id = "65f7db30ce61ed8986782f66"
    if (tm == 'red') {
        _id = "65f7dadfce61ed8986782f64"
    }    
    else if (tm == 'green') {
        _id = "65f7db26ce61ed8986782f65"
    }
    _token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImJhYXNfZG9tYWluX2lkIjoiNjVmN2RjZTI3NzYxMTc4ODBiZjYwOGYzIiwiZXhwIjoxNzEwNzU3NDA5LCJpYXQiOjE3MTA3NTU2MDksImlzcyI6IjY1ZjgwZjE5NWRlNTg4ZWQzN2I3N2VjZCIsInN0aXRjaF9kZXZJZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsInN0aXRjaF9kb21haW5JZCI6IjY1ZjdkY2UyNzc2MTE3ODgwYmY2MDhmMyIsInN1YiI6IjY1ZjgwZWRhYjk3MzA1ZTc1ZDljYzkyMCIsInR5cCI6ImFjY2VzcyJ9.YIEEn_ggFTU8kYSbvzR1wL7jrmcTON2pfCZYRQCCvFw"
    console.log("updating status "+team+" "+rindex)
    const response = await fetch('https://eu-central-1.aws.data.mongodb-api.com/app/data-ffvzc/endpoint/data/v1/action/updateOne', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        //'Accept': 'application/json',
        //'Access-Control-Request-Headers': '*',
        //'Access-Control-Allow-Origin': 'https://odedigo.github.io',
        'Authorization': 'Bearer '+_token
        },
        body: {            
            "collection":"gameStatus",
            "database":"treasurehunt",
            "dataSource":"ClusterMashar",
            "filter": {
                "_id": { "$oid": _id }
            },
            "update": {
                "$set": {
                    "riddle": ind
                }
            }            
        }
    })
    .catch(error => {
        console.log("error updating team status...",error)
    });
    if (response != null) {
        const myJson = await response.json(); //extract JSON from the http response
        // do something with myJson
        console.log(myJson)
    }
}