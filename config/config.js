/**
 * --------------------------
 * Treasure Hunt Application
 * --------------------------
 * 
 * @desc Cםמכןעורשאןםמ גשאש
 * 
 * Org: Mashar / Kfar-Sava
 * By: Oded Cnaan
 * Date: March 2024
 */
"use strict";


const config = {
    version: {
        v: "1.0.0",
        date: "21.3.24"
    },
    mongodb: {
        "protocol": "mongodb+srv",
        "dbname": "Mashar",
        "clusterURI": "masharcluster.qpsgps5.mongodb.net",
        "path": "retryWrites=true&w=majority&appName=MasharCluster"
    },
    app: {
        name: "Treasure Hunt - Masha",
        isProduction: process.env.NODE_ENV === 'production',
        logger_show_info: true,
        report_status: true,
        expiration: 1, // # of days
        reloadDelay: 2500,
        msgDelay: 2500
    },
    roles: {},
    accounts: {},
    validation: {}
};

export default config
