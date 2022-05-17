import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.0.37:8000/';
axios.defaults.headers.common['Accept'] = "application/json";