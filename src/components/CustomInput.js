import { Text, View, TextInput, Dimensions } from 'react-native';
import { React } from 'react';

export default function CustomInput({text, textSize, inputSize, value, setValue, placeholder, secureTextEntry, backgroundColor, color, flexDirection}) {

    return ( 

        <View style={{flexDirection: flexDirection }}>
            <Text style={{fontSize: textSize}}> {text} </Text>
            <TextInput 
                style={{paddingLeft: 10, backgroundColor: backgroundColor, color: color, minWidth: "100%", fontSize: inputSize}} 
                value={value}
                onChangeText={setValue}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
            />
        </View>


    )

}
