import axios from 'axios';
import { API_KEY } from './constants';

const forecast_endpoint = params => 
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.cityName}&days=${params.days}&alerts=no`;
  
  const location_endpoint = params => 
    `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.cityName}`;
  
// const forecast_endpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}=${params.cityName}&days=${params.days}=no&alerts=no`
// const location_endpoint = params => `https://api.weatherapi.com/v1/search.json?key=${API_KEY}=${params.cityName}`

const apiCall = async(endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    }
    try{
        const response = await axios.request(options);
        return response.data
    }catch(err){
        console.log('error', err);
        return null;
    }
}

export const fetchweatherforecast = params => {
     return apiCall(forecast_endpoint(params))
}

export const fetchlocations = params=> {
     return apiCall(location_endpoint(params))
}

