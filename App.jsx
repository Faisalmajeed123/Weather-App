import {
  Image,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {debounce} from 'lodash';
import {fetchlocations, fetchweatherforecast} from './src/api/weather';

const App = () => {
  const weatherImages = {
    'Partly cloudy': require('./assets/images/partlycloudy.png'),
    'Moderate rain': require('./assets/images/moderaterain.png'),
    'Patchy rain possible': require('./assets/images/moderaterain.png'),
    Sunny: require('./assets/images/sun.png'),
    Clear: require('./assets/images/sun.png'),
    Overcast: require('./assets/images/cloud.png'),
    Cloudy: require('./assets/images/cloud.png'),
    'Light rain': require('./assets/images/moderaterain.png'),
    'Moderate rain at times': require('./assets/images/moderaterain.png'),
    'Heavy rain': require('./assets/images/heavyrain.png'),
    'Heavy rain at times': require('./assets/images/heavyrain.png'),
    'Moderate or heavy freezing rain': require('./assets/images/heavyrain.png'),
    'Moderate or heavy rain shower': require('./assets/images/heavyrain.png'),
    'Moderate or heavy rain with thunder': require('./assets/images/heavyrain.png'),
    other: require('./assets/images/moderaterain.png'),
  };

  const [search, setSearch] = useState(false);
  const [locations, setlocations] = useState([]);
  const [weather, setweather] = useState({});

  console.log('weather: ', weather);

  const handlelocation = loc => {
    console.log('locations', loc);
    setlocations([]);
    setSearch(false);
    fetchweatherforecast({
      cityName: loc.name,
      days: '7',
    }).then(data => {
      setweather(data);
      console.log('got forecast ', data);
    });
  };

  const handleSearch = value => {
    if (value.length > 2) {
      fetchlocations({cityName: value}).then(data => {
        setlocations(data);
        console.log('got locations', data);
      });
    }
  };

  useEffect(() => {
    fetchmyeweatherdata();
  }, []);

  const fetchmyeweatherdata = async () => {
    fetchweatherforecast({
      cityName: 'Islamabad',
      days: '5',
    }).then(data => {
      setweather(data);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1000), []);

  const {current, location} = weather;

  return (
    <View className="flex-1 relative">
      <Image
        blurRadius={70}
        source={require('./assets/images/bg.png')}
        className="absolute h-full w-full "
      />

      <SafeAreaView className="flex flex-1 p-2 gap-5">
        <View style={{height: '7%'}} className="mx-4 relative z-50">
          <View
            style={{
              backgroundColor: search
                ? 'rgba(203, 213, 225, 0.2)'
                : 'transparent',
            }}
            className="flex-row justify-end items-center rounded-full">
            {search ? (
              <TextInput
                onChangeText={handleTextDebounce}
                className="pl-6 h-14 pb-1 flex-1 text-base text-white"
                placeholder="Search City"
                placeholderTextColor={'lightgray'}
              />
            ) : null}
            <TouchableOpacity
              className=" m-1 bg-white rounded-full p-3 opacity-40"
              onPress={() => setSearch(!search)}>
              <AntDesign name="search1" size={18} color="white" />
            </TouchableOpacity>

            {locations.length > 0 && search ? (
              <View className="absolute w-full top-14 left-0 right-0 rounded-3xl bg-white">
                {locations.map((loc, index) => {
                  let showborders = index + 1 !== locations.length;
                  let borderclass = showborders
                    ? 'border-b-2 border-b-gray-400'
                    : '';
                  return (
                    <Pressable
                      onPress={() => handlelocation(loc)}
                      key={loc.id || index}
                      className={
                        'flex-row items-center border-0 p-3 px-4 mb-1' +
                        borderclass
                      }>
                      <EvilIcons name="location" size={30} color="black" />
                      <Text className="text-black text-lg ml-2">
                        {' '}
                        {loc?.name}, {loc?.country}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>
        </View>

        <View className="flex-row justify-center relative">
          <Text className=" text-slate-200 font-extrabold text-center mt-5 ">
            {location?.name},
          </Text>
          <Text className=" text-slate-300 font-semibold text-center mt-5 ">
            {' '}
            {' ' + location?.country}
          </Text>
        </View>

        <View className="items-center justify-center mt-12">
          <ImageBackground
            className="h-40 w-40"
            source={
              weatherImages[current?.condition?.text] || weatherImages['other']
            }
          />
          <Text className="font-bold text-5xl text-white mt-8">
            {current?.temp_c}
            {'\u00b0'}
          </Text>
          <Text className="opacity-80 mt-0.5 ">{current?.condition?.text}</Text>
        </View>

        <View className=" h-12 w-full mt-8 flex-row justify-around">
          <View className="flex-row">
            <Feather name="wind" size={30} color="white" />
            <Text>{current?.wind_kph}km</Text>
          </View>
          <View className="flex-row">
            <SimpleLineIcons name="drop" size={30} color="white" />
            <Text>{current?.humidity}%</Text>
          </View>
          <View className="flex-row">
            <Feather name="sun" size={30} color="white" />
            <Text>6:56 AM</Text>
          </View>
        </View>

        <View className="flex-row ml-3 ">
          <AntDesign name="calendar" size={25} color="white" />
          <Text className="pl-1"> Daily forecast</Text>
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={{paddingHorizontal: 10}}
          showsHorizontalScrollIndicator={false}>
          {weather?.forecast?.forecastday?.map((item, index) => {
            let date = new Date(item.date);
            let options = {weekday: 'long'};
            let dayname = date.toLocaleDateString('en-US', options);
            dayname = dayname.split(',')[0];

            return (
              <View
                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4 bg-slate-400"
                key={index}>
                <Image
                  className="h-14 w-14"
                  source={
                    weatherImages[item?.day?.condition?.text] ||
                    weatherImages['other']
                  }
                />
                <Text className=" text-white ">{dayname}</Text>
                <Text className="text-sm  text-white">
                  {item?.day?.avgtemp_c}
                  {'\u00b0'}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default App;
