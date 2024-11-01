import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "./Navbar";
import { AllTodosContext } from "../App";
import { useContext } from "react";
import CheckBox from "expo-checkbox";
import { readItems } from "../db/db";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const Completed = () => {
  const {
    AllTodos,
    changeTodoStatusToCurrent,
    completeTodo,
    deleteTodo,
    clearCompletedTodos,
  } = useContext(AllTodosContext);

  return (
    <SafeAreaView className="justify-center items-center bg-white w-full h-full p-5">
      <StatusBar barStyle="light-content" backgroundColor="green" />
      <View className="w-full h-[30%] bg-green-300 absolute top-0 rounded-b-[40px]" />
      <Text className="text-3xl font-bold text-white absolute top-14">
        Completed Tasks
      </Text>
      <ScrollView className="w-full h-full mt-24">
        {AllTodos && AllTodos.length > 0 && (
          <TouchableOpacity
            className="bg-red-500 w-40 h-8 justify-center items-center ml-auto mb-5 rounded-full shadow-lg"
            onPress={() => clearCompletedTodos()}
            style={{
              shadowColor: "#ef4444",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              elevation: 5,
            }}
          >
            <Text className="text-white font-semibold">
              Clear All Completed
            </Text>
          </TouchableOpacity>
        )}
        {AllTodos && AllTodos.length > 0 ? (
          AllTodos.map((todo) => {
            if (todo.completed) {
              return (
                <View
                  key={todo.id}
                  className="flex flex-row justify-between items-center bg-white mb-4 p-4 rounded-xl mx-2"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row items-center flex-1">
                    <CheckBox
                      value={todo.completed}
                      onValueChange={() => changeTodoStatusToCurrent(todo.id)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        marginRight: 12,
                      }}
                      color={todo.completed ? "#22c55e" : undefined}
                    />
                    <View className="flex-1 mr-4">
                      <Text
                        className="text-lg font-semibold text-gray-800 mb-1"
                        style={{
                          textDecorationLine: todo.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {todo.title}
                      </Text>
                      <Text
                        className="text-sm text-gray-500"
                        style={{
                          textDecorationLine: todo.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {todo.description}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    className="bg-red-100 w-10 h-10 rounded-full justify-center items-center"
                    onPress={() => deleteTodo(todo.id)}
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      size={16}
                      color="#ef4444"
                    />
                  </TouchableOpacity>
                </View>
              );
            }
          })
        ) : (
          <View className="w-full h-[80%] justify-center items-center">
            <Text className="text-xl text-gray-400 font-semibold">
              No Completed Tasks
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Completed;
