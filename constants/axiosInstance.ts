import axios from "axios"

export default axios.create({
    // baseURL: __DEV__ ? 'https://koumi.ml/api-koumi' : 'https://mon-backend.com/api'
    baseURL: __DEV__ ? 'http://185.98.137.196/api-koumi' : 'https://mon-backend.com/api'
})