import { useState, createContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Navbar from "./components/Navbar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home";
import Add from "./components/Add";
import Completed from "./components/Completed";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  clearDatabase,
  createItem,
  updateItem,
  deleteItem,
  readItems,
  clearCompleted,
  changeTodoStatusToCurrentInDb,
  createTable,
} from "./db/db";

// Context for all todos
export const AllTodosContext = createContext();
import { ToastProvider } from "react-native-toast-notifications";

export default function App() {
  const Stack = createNativeStackNavigator();
  const [AllTodos, setAllTodos] = useState([]);
  console.log(AllTodos);
  const [CompletedTodos, setCompletedTodos] = useState([]);
  const [CurrentTodos, setCurrentTodos] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");

  const changeSelected = (date) => {
    setSelected(date);
  };

  useEffect(() => {
    createTable();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       console.log("fetching data");
  //       const items = await readItems();
  //       if (items.length > 0) {
  //         console.log(items);
  //         setAllTodos(items);
  //         // setCurrentTodos((prevTodos) => {
  //         //   return prevTodos.filter((t) => t.completed === false);
  //         // });
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const setAllTodosFunction = (items) => {
    setAllTodos(items);
  };
  const completeTodo = async (id) => {
    const todo = AllTodos.find((t) => t.id === id);
    setAllTodos((prevTodos) => {
      const finalTodos = prevTodos.map((t) => {
        if (t.id === id) {
          return { ...t, completed: 1 };
        }
        return t;
      });
      return finalTodos;
    });
    await updateItem(id);
    // Force reload
    // const currentRoute = navigation.getCurrentRoute();
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: currentRoute.name }],
    // });
  };

  const changeTodoStatusToCurrent = async (id) => {
    setAllTodos((prevTodos) => {
      const finalTodos = prevTodos.map((t) => {
        if (t.id === id) {
          return { ...t, completed: false };
        }
        return t;
      });
      return finalTodos;
    });
    changeTodoStatusToCurrentInDb(id);
  };
  const deleteTodo = async (id) => {
    setAllTodos((prevTodos) => {
      const finalTodos = prevTodos.filter((t) => t.id !== id);
      return finalTodos;
    });
    await deleteItem(id);
  };
  const clearCompletedTodos = async () => {
    setAllTodos((prevTodos) => {
      const finalTodos = prevTodos.filter((t) => t.completed === 0);
      return finalTodos;
    });
    clearCompleted();
  };
  return (
    <ToastProvider>
      <NavigationContainer>
        <AllTodosContext.Provider
          value={{
            AllTodos,
            CompletedTodos,
            changeTodoStatusToCurrent,
            completeTodo,
            setAllTodos,
            loading,
            setLoading,
            CurrentTodos,
            setAllTodosFunction,
            deleteTodo,
            clearCompletedTodos,
            changeSelected,
            selected,
            setSelected,
          }}
        >
          <KeyboardAvoidingView
            // behavior={Platform.OS === "ios" ? "padding" : "position"}
            style={{ flex: 1 }}
            enableOnAndroid={true}
            contentContainerStyle={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
                // initialParams={{ setAllTodos, AllTodos }}
              />
              <Stack.Screen
                name="AddTodo"
                component={Add}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Completed"
                component={Completed}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
            <Navbar />
          </KeyboardAvoidingView>
        </AllTodosContext.Provider>
      </NavigationContainer>
    </ToastProvider>
  );
}
