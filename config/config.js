/**
 * Config file
 * 
 * By: Oded Cnaan
 * April 2019
 */
'use strict';


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
    },
    roles: {},
    accounts: {},
    validation: {}
};

export default {config}