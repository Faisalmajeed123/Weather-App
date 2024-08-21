import { Image, StatusBar, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'

import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {debounce} from 'lodash';

import { fetchlocations, fetchweatherforecast } from './src/api/weather';
// import { weatherImages } from './src/api/constants';



const App = () => {

  const weatherImages = {
    'Partly cloudy': require('./assets/images/partlycloudy.png'),
    'Moderate rain': require('./assets/images/moderaterain.png'),
    'Patchy rain possible': require('./assets/images/moderaterain.png'),
    'Sunny': require('./assets/images/sun.png'),
    'Clear': require('./assets/images/sun.png'),
    'Overcast': require('./assets/images/cloud.png'),
    'Cloudy': require('./assets/images/cloud.png'),
    'Light rain': require('./assets/images/moderaterain.png'),
    'Moderate rain at times': require('./assets/images/moderaterain.png'),
    'Heavy rain': require('./assets/images/heavyrain.png'),
    'Heavy rain at times': require('./assets/images/heavyrain.png'),
    'Moderate or heavy freezing rain': require('./assets/images/heavyrain.png'),
    'Moderate or heavy rain shower': require('./assets/images/heavyrain.png'),
    'Moderate or heavy rain with thunder': require('./assets/images/heavyrain.png'),
    'other': require('./assets/images/moderaterain.png')
  }
console.log('Weather Condition Text:', current?.condition?.text);



  const [search, setSearch] = useState(false)
  const [locations, setlocations] = useState([])
  const[weather, setweather] = useState({})
 

  const handlelocation= (loc) => {
    console.log('locations' ,  loc)
    setlocations([]);
    setSearch(false);
    fetchweatherforecast({
      cityName : loc.name,
      days: '7'
    }).then (data=>{ 
      setweather(data)
      console.log('got forecast ' , data);
    })
  }

  const handleSearch= value=> {
    // fetch locations
    if(value.length>2) {
    fetchlocations({cityName: value}).then(data =>{
      setlocations(data);
      console.log('got locations' , data);
    }) }
  }  

  useEffect(()=> {
    fetchmyeweatherdata();
  }, [])

  const fetchmyeweatherdata = async () => {
    fetchweatherforecast({
      cityName: 'London',
      days: '7'
    }).then (data=>{
      setweather(data);
    })
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const {current, location} = weather;


  return (
    <View className= "flex-1 relative">
    <StatusBar style = 'light'/>

      <Image blurRadius={70} source={require('./assets/images/bg.png')} className= "absolute h-full w-full "/> 
      

      <View className= "m-4 h-12 w-fit rounded-3xl bg-slate-300 flex-row justify-end items-center p-0.5 relative z-50"
       style={{ backgroundColor: search ? 'rgba(203, 213, 225, 0.2)' : 'transparent' }}>
        {
          search? 
          (<TextInput 
              onChangeText={handleTextDebounce}
              className="text-slate-200 p-3 flex-auto bg-opacity-20" 
              placeholder= 'Search City'
             placeholderTextColor={'#FFF'}/>) 
          : null
        }
        
        <TouchableOpacity className=" h-11 w-11 bg-white rounded-full mr-0.5 p-1.5 pl-2 opacity-20" onPress={() =>setSearch(!search)}>
          <AntDesign name = 'search1' size= {30} color= '#FFF'/>
        </TouchableOpacity>

     


        

        {locations.length> 0 && search? (
            <View className= 'absolute w-full top-20 left-0 right-0 rounded-3xl bg-white z-50'>
            
            {locations.map((loc, index)=> {
              let showborders = index+1 !== locations.length;
              let borderclass = showborders? 'border-b-2 border-b-gray-400' : '';
                  return(
                    <TouchableOpacity 
                    onPress={() => handlelocation(loc)}
                    key={loc.id || index}
                    className={"flex-row items-center border-0 p-3 px-4 mb-1"+ borderclass} >
                      <EvilIcons name= 'location' size={30} color= 'black'/>
                      <Text className= 'text-black text-lg ml-2'> {loc?.name}, {loc?.country}</Text>
                    </TouchableOpacity>
                  )
              })}
              
            </View>
         ) : 
          null
        }
      </View>
      




      <View className= 'flex-row justify-center relative'>
      <Text className= " text-slate-200 font-bold text-center mt-5" >{location?.name},</Text>
      <Text className= " text-slate-300 font-semibold text-center mt-5" > {" " + location?.country}</Text>
      </View>
      

      {/* <Image className= "h-40 w-40" source={weatherImages[current?.condition?.text]}/> */}
      {/* Images not loaded, file issue, syntax issue, above is the syntax of getting data from api */}
      {/* <Image className= "h-40 w-40" source={{uri: 'https:' + current?.condition?.icon}}/> */}

      <View className= 'items-center justify-center mt-12'>
      <Image
        className="h-40 w-40"
        source={weatherImages[current?.condition?.text] || weatherImages['other']}/>
        <Text className="font-bold text-5xl text-white mt-8">{current?.temp_c}{'\u00b0'}</Text>
        <Text className= 'opacity-80 mt-0.5 '>{current?.condition?.text}</Text>
      </View>

    
    


      <View className= ' h-12 w-full mt-8 flex-row justify-around'>
        <View className= "flex-row">
          <Feather name = 'wind' size ={30} color= 'white'/>
          <Text>
              {current?.wind_kph}km
          </Text>
        </View>
        <View className= "flex-row">       
          <SimpleLineIcons name = 'drop' size ={30} color= 'white'/>
          <Text>
              {current?.humidity}%
          </Text></View>
        <View className= "flex-row">
        <Feather name = 'sun' size ={30} color= 'white'/>
          <Text>
              6:56 AM
          </Text>
        </View>
      </View>



      <View className= "flex-row ml-3 ">
      <AntDesign name = 'calendar' size ={25} color= 'white'/>
      <Text  className='pl-1'> Daily forecast</Text>
      </View>


      <ScrollView
      horizontal
      contentContainerStyle={{paddingHorizontal:15, paddingVertical: 5}}
      showsHorizontalScrollIndicator= {false}>

        {
          weather?.forecast?.forecastday?.map((item,index)=>{
            let date = new Date (item.date);
            let options= {weekday: 'long'};
            let dayname = date.toLocaleDateString('en-US', options);
            dayname= dayname.split(',') [ 0]

            return(
            <View className= "w-24 h-21 rounded-3xl bg-slate-300 opacity-60 justify-center items-center space-y-1 mr-3"
            key={index}>
              {/* weatherImages[item?.day?.condition?.text ] */}
              {/* {uri: 'https:' + item?.day?.condition?.icon} */}
              <View className ='justify-center items-center space-y-1'>
                <Image className = 'h-14 w-14' source={weatherImages[item?.day?.condition?.text] || weatherImages['other'] }/>
                <Text className = 'opacity-90 text-white relative'>{dayname}</Text>
                <Text className= 'text-sm opacity-100 text-white'>{item?.day?.avgtemp_c}{'\u00b0'}</Text>
              </View>
            </View>
            ) 
          }) 
        }
      </ScrollView>
    </View>
  )
}

export default App