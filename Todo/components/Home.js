import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Pressable,
  Animated,
} from "react-native";
import { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Navbar from "./Navbar";
import { AllTodosContext } from "../App";
import { useContext, useState, useEffect } from "react";
// import CheckBox from "@react-native-community/checkbox";
import CheckBox from "expo-checkbox";
import { readItems } from "../db/db";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from "react-native-calendars";
import uuid from "react-native-uuid";
import GestureRecognizer, { swipeDirections } from "react-native-swipe-detect";

const Home = ({}) => {
  const {
    AllTodos,
    completeTodo,
    changeTodoStatusToCurrent,
    setAllTodos,
    loading,
    setLoading,
    CurrentTodos,
    setAllTodosFunction,
    deleteTodo,
    changeSelected,
    selected,
    setSelected,
  } = useContext(AllTodosContext);

  const today = new Date().toISOString().split("T")[0];
  const [markedDates, setMarkedDates] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [swipeToDelete, setSwipeToDelete] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          console.log("fetching data");
          const items = await readItems();
          if (items && items.length > 0) {
            setAllTodosFunction(items);
            const allDates = items.map((task) =>
              task.completed === 0 ? task.date : ""
            );
            setMarkedDates(allDates.filter((date) => date !== ""));
            setSelectedTasks(
              items.filter((task) => {
                if (task.date === today && task.completed === 0) {
                  return task;
                }
                // else if (task.date === allDates[allDates.length - 1]) {
                //   return task;
                // }
              })
            );
          } else {
            setAllTodosFunction([]);
            setMarkedDates([]);
            setSelectedTasks([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );
  console.log("allDates", markedDates);
  console.log("selectedTasks", selectedTasks);

  //function to return strings of dates from array of dates without returning an array
  function markedDatesToString(markedDates) {
    const markedDatesObject = {};
    markedDates.forEach((date) => {
      markedDatesObject[date] = {
        selected: true,
        marked: true,
        selectedColor: "orange",
        selectedTextColor: "white",
      };
    });
    return markedDatesObject;
  }
  const showMoreDetails = (id) => {
    console.log("showDetails", showDetails);
    setShowDetails(!showDetails);
    setSelectedItemId(id);
  };
  // useEffect(() => {
  //   console.log("selected", selected);
  //   const selectedTasks = AllTodos.filter((task) => task.date === today);
  //   setSelectedTasks(selectedTasks);
  // }, []);

  useEffect(() => {
    console.log("selected", selected);
    if (AllTodos && AllTodos.length > 0) {
      setSelectedTasks(AllTodos.filter((task) => task.date === selected));
    } else {
      setSelectedTasks([]);
      console.log("selectedTasks", selectedTasks);
    }
  }, [selected, AllTodos]);
  // @ts-ignore fix for defaultProps warning: https://github.com/wix/react-native-calendars/issues/2455
  ExpandableCalendar.defaultProps = undefined;

  if (loading) {
    return (
      <View className="justify-center items-center bg-white w-full h-full ">
        <ActivityIndicator size="large" color="#0000ff" animating={loading} />
      </View>
    );
  } else {
    return (
      <View className="justify-center items-center bg-white w-full h-full ">
        <SafeAreaView
          className="w-full h-full"
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatusBar barStyle="light-content" backgroundColor="blue" />
          <View className="flex flex-row items-center justify-between w-full h-auto">
            <CalendarProvider
              date={today}
              // showTodayButton
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <ExpandableCalendar
                onDayPress={(day) => changeSelected(day.dateString)}
                theme={{
                  calendarBackground: "blue", // Set the calendar background color
                  dayTextColor: "white", // Set the day text color
                  monthTextColor: "white", // Set the month text color
                  textSectionTitleColor: "white", // Set the text color for weekdays (Sun, Mon, etc.)
                  selectedDayBackgroundColor: "white", // Background color of the selected day
                  selectedDayTextColor: "blue", // Text color of the selected day
                  todayTextColor: "yellow", // Color for today's date
                  arrowColor: "white", // Color of the arrows for changing months
                  backgroundColor: "blue",
                }}
                markedDates={markedDatesToString(markedDates)}
              />
            </CalendarProvider>
          </View>
          <ScrollView
            className="h-3/4 w-full z-1"
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "start",
              padding: 10,
            }}
          >
            {selectedTasks && selectedTasks.length > 0 ? (
              selectedTasks.map((todo) => {
                // console.log(todo.completed);
                if (!todo.completed) {
                  return (
                    <GestureRecognizer
                      key={uuid.v4()}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        shadowColor: "#4B5563",
                        shadowOffset: { width: 2, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 8,
                        borderRadius: 16,
                        backgroundColor: "white",
                        marginBottom:
                          showDetails && selectedItemId === todo.id ? 16 : 8,
                        borderLeftWidth: 4,
                        borderLeftColor: "#1E40AF",
                      }}
                      onSwipeLeft={() => setSwipeToDelete(true)}
                      onSwipeRight={() => setSwipeToDelete(false)}
                    >
                      <View className="flex flex-row justify-between items-center w-full h-[90px] p-3">
                        <View className="flex flex-row items-center justify-between w-[20%]">
                          <Text className="font-semibold text-gray-700">
                            {todo.startTime.slice(0, 5)}
                          </Text>
                          <View className="w-[20px] h-full flex-col items-center justify-start">
                            <View className="w-[10px] h-[15%] bg-blue-800 rounded-full animate-pulse"></View>
                            <View className="flex flex-col items-start justify-evenly h-[85%]">
                              {Array.from({ length: 7 }).map((_, index) => (
                                <View
                                  key={index}
                                  className="w-[3px] h-[3px] bg-blue-300 rounded-full"
                                ></View>
                              ))}
                            </View>
                          </View>
                        </View>
                        <Pressable
                          className="flex flex-col items-start justify-center pl-3 w-[70%]"
                          onPress={() => showMoreDetails(todo.id)}
                          style={({ pressed }) => [
                            {
                              transform: [{ scale: pressed ? 0.98 : 1 }],
                              opacity: pressed ? 0.9 : 1,
                            },
                          ]}
                        >
                          <Text className="text-xl font-bold text-gray-800">
                            {todo.title}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <Text className="text-sm text-blue-600 font-medium">
                              {todo.startTime} - {todo.endTime}
                            </Text>
                          </View>
                        </Pressable>
                        <View className="flex flex-col items-center justify-center w-[10%]">
                          <CheckBox
                            value={todo.completed === 1}
                            onValueChange={
                              todo.completed === 1
                                ? () => changeTodoStatusToCurrent(todo.id)
                                : () => completeTodo(todo.id)
                            }
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              borderWidth: 2,
                              borderColor: "#1E40AF",
                            }}
                            color="#1E40AF"
                          />
                        </View>
                        {swipeToDelete && selectedItemId === todo.id && (
                          <Animated.View
                            className="w-10 h-full rounded-lg bg-red-500"
                            style={{
                              transform: [
                                {
                                  translateX: swipeToDelete ? 0 : 100,
                                },
                                {
                                  scale: swipeToDelete ? 1 : 0.5,
                                },
                              ],
                              opacity: swipeToDelete ? 1 : 0,
                            }}
                          >
                            <TouchableOpacity
                              className="w-full h-full bg-red-500 justify-center items-center"
                              onPress={() => deleteTodo(todo.id)}
                            >
                              <FontAwesomeIcon
                                icon={faTrashCan}
                                size={24}
                                color="white"
                              />
                            </TouchableOpacity>
                          </Animated.View>
                        )}
                      </View>

                      {showDetails && selectedItemId === todo.id && (
                        <Animated.View
                          className="w-full bg-gray-50 p-4 rounded-b-2xl"
                          style={{
                            maxHeight:
                              showDetails && selectedItemId === todo.id
                                ? 200
                                : 0,
                            opacity:
                              showDetails && selectedItemId === todo.id ? 1 : 0,
                            transform: [
                              {
                                scale:
                                  showDetails && selectedItemId === todo.id
                                    ? 1
                                    : 0.8,
                              },
                              {
                                translateY:
                                  showDetails && selectedItemId === todo.id
                                    ? 0
                                    : -20,
                              },
                            ],
                            transition: {
                              type: "spring",
                              damping: 20,
                              stiffness: 300,
                            },
                          }}
                        >
                          <Text className="text-gray-600 leading-relaxed ">
                            {todo.description}
                          </Text>
                        </Animated.View>
                      )}
                    </GestureRecognizer>
                  );
                }
              })
            ) : (
              <View className="w-full h-full flex justify-center items-center ">
                <Text>No tasks for today</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
};

export default Home;
