import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
  Keyboard,
} from "react-native";
import {
  faHouse,
  faCirclePlus,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";

const Navbar = () => {
  const [selected, setSelected] = useState(1);
  const navigation = useNavigation();
  const [animation] = useState(new Animated.Value(0));
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const pressed = (id) => {
    if (id === 1) {
      navigation.navigate("Home", { refresh: true });
      setSelected(1);
    } else if (id === 2) {
      navigation.navigate("AddTodo");
      setSelected(2);
    } else if (id === 3) {
      navigation.navigate("Completed", { refresh: true });
      setSelected(3);
    }

    Animated.spring(animation, {
      toValue: id - 1,
      useNativeDriver: false,
    }).start();
  };

  const getAnimatedStyle = (index) => {
    return {
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [
              index === 0 ? -40 : 0,
              index === 1 ? -40 : 0,
              index === 2 ? -40 : 0,
            ],
          }),
        },
      ],
    };
  };

  if (isKeyboardVisible) {
    return null;
  }

  return (
    <View
      className="flex flex-row justify-around items-center p-2 relative bottom-0 w-full mt-2 rounded-t-lg shadow-l h-[10%] "
      style={{
        shadowColor: "black",
        shadowOffset: { width: 0, height: 15 },
        shadowRadius: 10,
        elevation: 20,
        backgroundColor: "white",
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // height: "10%",
      }}
    >
      <Pressable
        className="w-1/4 flex justify-center items-center h-full relative"
        onPress={() => pressed(1)}
      >
        <Animated.View style={getAnimatedStyle(0)}>
          <FontAwesomeIcon
            icon={faHouse}
            size={selected === 1 ? 50 : 40}
            color={selected === 1 ? "blue" : "grey"}
          />
        </Animated.View>
      </Pressable>
      <Pressable
        className="w-1/4 flex justify-center items-center h-full relative"
        onPress={() => pressed(2)}
      >
        <Animated.View
          style={[getAnimatedStyle(1), { borderRadius: 9999 }]}
          className={`${
            selected === 2
              ? "shadow-xl shadow-orange-800"
              : "shadow-xl shadow-grey-500"
          }`}
        >
          <FontAwesomeIcon
            icon={faCirclePlus}
            size={selected === 2 ? 50 : 40}
            color={selected === 2 ? "orange" : "grey"}
          />
        </Animated.View>
      </Pressable>
      <Pressable
        className="w-1/4 flex justify-center items-center h-full relative"
        onPress={() => pressed(3)}
      >
        <Animated.View style={getAnimatedStyle(2)}>
          <FontAwesomeIcon
            icon={faClipboardCheck}
            size={selected === 3 ? 50 : 40}
            color={selected === 3 ? "green" : "grey"}
            className="shadow-xl shadow-blue-800"
          />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default Navbar;
