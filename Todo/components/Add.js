import {
  View,
  Text,
  TextInput,
  Button,
  StatusBar,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "./Navbar";
import { AllTodosContext } from "../App";
import { useState, useContext, useRef, useEffect } from "react";
import { createItem } from "../db/db";
import { readItems } from "../db/db";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { useToast } from "react-native-toast-notifications";

const AddTodo = () => {
  const {
    AllTodos,
    addTodo,
    setAllTodosFunction,
    setCurrentTodos,
    setLoading,
    changeSelected,
    selected,
  } = useContext(AllTodosContext);
  const toast = useToast();
  const [todoForm, setTodoForm] = useState({
    title: "",
    description: "",
    completed: false,
    date: "",
    startTime: "",
    endTime: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleChange = (value, name) => {
    setTodoForm({ ...todoForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    console.log(todoForm);
    if (
      !todoForm.title ||
      !todoForm.date ||
      !todoForm.startTime ||
      !todoForm.endTime
    ) {
      // Prevent submission if required fields are empty
      console.log("Title and date are required");
      toast.show("Please enter all required information", {
        type: "danger",
        placement: "top",
        duration: 4000,
        offset: -30,
        animationType: "zoom-in",
      });
      return;
    }
    await createItem(todoForm);
    console.log("todoForm.date", todoForm.date);
    changeSelected(todoForm.date);
    setAllTodosFunction((prevTodos) => [...prevTodos, todoForm]);
    toast.show("Task added successfully", {
      type: "success",
      placement: "top",
      duration: 4000,
      offset: -30,
      animationType: "zoom-in",
    });
    setTodoForm({
      title: "",
      description: "",
      completed: false,
      date: "",
      startTime: "",
      endTime: "",
    });
    titleRef.current.clear();
    descriptionRef.current.clear();
  };

  const handleDateChange = (e, date) => {
    if (e.type === "set" && date) {
      console.log("date", date);
      const formattedDate = date.toISOString().split("T")[0];
      setTodoForm({ ...todoForm, date: formattedDate });
      setShowDatePicker(false);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleStartTimeChange = (e, time) => {
    if (e.type === "set" && time) {
      console.log("time", time);
      const hours = time.getHours().toString().padStart(2, "0");
      const minutes = time.getMinutes().toString().padStart(2, "0");
      const finalFormattedTime = `${hours}:${minutes}:00`;
      console.log(finalFormattedTime);

      setTodoForm({ ...todoForm, startTime: finalFormattedTime });
      setShowStartTimePicker(false);
    } else {
      setShowStartTimePicker(false);
    }
  };

  const handleEndTimeChange = (e, time) => {
    if (e.type === "set" && time) {
      console.log("time", time);
      const hours = time.getHours().toString().padStart(2, "0");
      const minutes = time.getMinutes().toString().padStart(2, "0");
      const finalFormattedTime = `${hours}:${minutes}:00`;
      console.log(finalFormattedTime);

      setTodoForm({ ...todoForm, endTime: finalFormattedTime });
      setShowEndTimePicker(false);
    } else {
      setShowEndTimePicker(false);
    }
  };

  return (
    <SafeAreaView className="bg-white w-full h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar barStyle="light-content" backgroundColor="orange" />
          <View className="flex flex-col items-start justify-start h-[30%] bg-orange-300 w-full pl-3 pt-3 ">
            <Text className="text-xl text-white font-bold mb-2">
              Create New Task
            </Text>
            <Text className="text-[#e3e3e3] text-[12px]">Name</Text>
            <TextInput
              ref={titleRef}
              name="title"
              onChangeText={(value) => handleChange(value, "title")}
              placeholder="Enter Title"
              placeholderTextColor="white"
              className="text-white text-[12px] border-b-2 pt-2 pb-1 border-[#e3e3e3]  w-[90%] relative top-10"
            />
          </View>
          <View className="flex flex-col items-center justify-start h-[70%] rounded-t-xl w-full bg-white p-4 pt-5 ">
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                onChange={(e, date) => handleDateChange(e, date)}
                mode="date"
              />
            )}
            {showEndTimePicker && (
              <DateTimePicker
                value={new Date()}
                onChange={(e, time) => handleEndTimeChange(e, time)}
                mode="time"
              />
            )}
            {showStartTimePicker && (
              <DateTimePicker
                value={new Date()}
                onChange={(e, time) => handleStartTimeChange(e, time)}
                mode="time"
              />
            )}
            <View className="w-full h-[1rem] border-b-1 border-gray-100 flex flex-col items-start justify-start">
              <Text className="text-gray-400 text-[10px]">Date</Text>
              <View className="w-full h-[1rem] border-b-2 border-[#e3e3e3] flex flex-row items-center justify-start">
                <TextInput
                  placeholder="Select Date"
                  onPressIn={() => setShowDatePicker(true)}
                  value={todoForm.date}
                  className="text-black-400 pt-2 pb-2 w-[90%]"
                />
                <FontAwesomeIcon icon={faCalendar} style={{ color: "gray" }} />
              </View>
            </View>
            <View className="w-full h-[50px] flex flex-row items-center justify-between mt-10">
              <TouchableOpacity
                className="w-[45%] h-[40px] flex flex-row items-center justify-between bg-gray-200 rounded-md p-2"
                onPress={() => setShowStartTimePicker(true)}
              >
                <TextInput
                  placeholder="Start Time"
                  value={todoForm.startTime}
                  focusable={false}
                />
                <FontAwesomeIcon icon={faClock} style={{ color: "gray" }} />
              </TouchableOpacity>
              <TouchableOpacity
                className="w-[45%] h-[40px] flex flex-row items-center justify-between bg-gray-200 rounded-md p-2"
                onPress={() => setShowEndTimePicker(true)}
              >
                <TextInput
                  placeholder="End Time"
                  value={todoForm.endTime}
                  focusable={false}
                />
                <FontAwesomeIcon icon={faClock} style={{ color: "gray" }} />
              </TouchableOpacity>
            </View>
            <View className="w-full h-[50px] flex flex-col items-start justify-start mt-5 border-b-2 border-[#e3e3e3]">
              <Text className="text-gray-400 text-[10px]">Description</Text>
              <TextInput
                ref={descriptionRef}
                name="description"
                onChangeText={(value) => handleChange(value, "description")}
                placeholder="Task Description"
                placeholderTextColor="gray"
              />
            </View>
            <Pressable
              type="submit"
              onPress={handleSubmit}
              title="Add Todo"
              className="bg-orange-300 flex flex-row items-center justify-center w-full h-[40px] rounded-md mt-8 relative top-10"
            >
              <Text className="text-white text-[15px] font-bold">Add Task</Text>
            </Pressable>
          </View>
          {/* <Navbar /> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddTodo;
