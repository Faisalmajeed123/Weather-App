import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const style = () => {
  return (
    <View className="flex-1 relative">
      <Image
        blurRadius={70}
        source={require('./assets/images/bg.png')}
        className="absolute h-full w-full "
      />

      <SafeAreaView className="flex flex-1">
        {/* Search section */}
        <View style={{height: '70%'}} className="mx-4 relative z-50">
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
                className="pl-6 h-10 pb-1 flex-1 text-base text-white"
                placeholder="Search City"
                placeholderTextColor={'lightgray'}
              />
            ) : null}
            <TouchableOpacity
              className=" m-1 bg-white rounded-full p-3 opacity-30"
              onPress={() => setSearch(!search)}>
              <AntDesign name="search1" size={25} color="white" />
            </TouchableOpacity>
          </View>

          {locations.length > 0 && search ? (
            <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
              {locations.map((loc, index) => {
                let showborders = index + 1 != locations.length;
                let borderclass = showborders
                  ? 'border-b-2 border-b-gray-400'
                  : '';
                return (
                  <TouchableOpacity
                    onPress={() => handlelocation(loc)}
                    key={loc.id || index}
                    className={
                      'flex-row items-center border-0 p-3 px-4 mb-1' +
                      borderclass
                    }>
                    <EvilIcons name="location" size={20} color="gray" />
                    <Text className="text-black text-lg ml-2">
                      {' '}
                      {loc?.name}, {loc?.country}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>

        {/* Forecast Section */}
        <View className="flex justify-around flex-1 mb-2 mx-4">
          <Text className=" text-white font-bold text-center text-2xl">
            {location?.name},
            <Text className=" text-lg font-semibold text-gray-300">
              {' '}
              {' ' + location?.country}
            </Text>
          </Text>
          {/* Weather Image */}
          <View className="flex-row justify-center">
            <Image
              className="h-52 w-52"
              source={
                weatherImages[current?.condition?.text] ||
                weatherImages['other']
              }
            />
          </View>
          {/* degree celsius */}
          <View className="space-y-2">
            <Text className="text-center font-bold text-white text-6xl ml-5">
              {current?.temp_c}
              {'\u00b0'}
            </Text>
            <Text className="text-center font-bold text-white text-xl tracking-widest">
              {current?.condition?.text}
            </Text>
          </View>
          {/* other stats */}
          <View className="flex-row justify-between mx-4">
            <View className=" flex-row space-x-2 items-center">
              <Feather name="wind" size={30} color="white" />
              <Text className=" text-white font-semibold text-base">
                {current?.wind_kph}km
              </Text>
            </View>
            <View className=" flex-row space-x-2 items-center">
              <SimpleLineIcons name="drop" size={30} color="white" />
              <Text className=" text-white font-semibold text-base">
                {current?.humidity}%
              </Text>
            </View>
            <View className=" flex-row space-x-2 items-center">
              <Feather name="sun" size={30} color="white" />
              <Text className=" text-white font-semibold text-base">
                6:56 AM
              </Text>
            </View>
          </View>
        </View>

        {/* Forecast for next days */}
        <View className="mb-2 space-y-2">
          <View className="flex-row items-center mx-5 space-x-2">
            <AntDesign name="calendar" size={22} color="white" />
            <Text className="text-white text-base"> Daily forecast</Text>
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={{paddingHorizontal: 15}}
            showsHorizontalScrollIndicator={false}>
            {weather?.forecast?.forecastday?.map((item, index) => {
              let date = new Date(item.date);
              let options = {weekday: 'long'};
              let dayname = date.toLocaleDateString('en-US', options);
              dayname = dayname.split(',')[0];

              return (
                <View
                  className=" flex w-24 rounded-3xl py-3 bg-slate-300 justify-center items-center space-y-1 mr-4 opacity-20"
                  style={{backgroundColor: 'white'}}>
                  <View className="justify-center items-center space-y-1">
                    <Image
                      className="h-11 w-11"
                      source={
                        weatherImages[item?.day?.condition?.text] ||
                        weatherImages['other']
                      }
                    />
                    <Text className=" text-white">{dayname}</Text>
                    <Text className="text-xl font-semibold text-white">
                      {item?.day?.avgtemp_c}
                      {'\u00b0'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default style;
